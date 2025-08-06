import os
import sys
import locale
import time

# Set UTF-8 encoding for Windows compatibility
if sys.platform.startswith('win'):
    # Set console to UTF-8 mode
    os.environ['PYTHONIOENCODING'] = 'utf-8'
    # Force UTF-8 encoding for stdout/stderr
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

import fitz  # PyMuPDF
import pdfplumber
import gc
import json
import argparse
from ollama import chat  # Official Python client

BOOKS_DIR = os.path.join(os.path.dirname(__file__), 'books')
SCRIPTS_DIR = os.path.join(os.path.dirname(__file__), 'scripts')
os.makedirs(SCRIPTS_DIR, exist_ok=True)
os.makedirs(BOOKS_DIR, exist_ok=True)

def extract_text_from_pdf(pdf_path):
    text = ''
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ''
    except Exception as e:
        print(f"Error extracting {pdf_path} with pdfplumber: {e}, trying PyMuPDF...")
        try:
            doc = fitz.open(pdf_path)
            for page in doc:
                text += page.get_text()
        except Exception as e2:
            print(f"Failed to extract {pdf_path}: {e2}")
    return text

def chunk_text(text, max_chars=1000, overlap=100):
    """Create smaller, more focused chunks for faster processing"""
    start = 0
    length = len(text)
    while start < length:
        end = min(start + max_chars, length)
        chunk = text[start:end]
        
        # Try to end at a sentence boundary
        if end < length:
            last_period = chunk.rfind('.')
            last_question = chunk.rfind('?')
            last_exclamation = chunk.rfind('!')
            last_newline = chunk.rfind('\n')
            
            best_end = max(last_period, last_question, last_exclamation, last_newline)
            if best_end > max_chars * 0.7:  # Only adjust if we don't lose too much content
                end = start + best_end + 1
                chunk = text[start:end]
        
        yield chunk
        start = end - overlap

def generate_lesson_script(raw_text, subject, chapter_name, chunk_idx=None):
    prompt = f"""Analyze this text and provide a comprehensive summary with key concepts, important facts, and main ideas. Focus on extracting educational content that could be used for learning.

    Text: {raw_text[:800]}
    
    Provide a detailed analysis covering:
    1. Main topics and concepts
    2. Key facts and information
    3. Important details that students should remember
    4. Connections between different ideas in the text"""
    
    try:
        import time
        start_time = time.time()
        
        response = chat(model="gemma3n", messages=[
            {"role": "user", "content": prompt}
        ])
        
        processing_time = time.time() - start_time
        result = response['message']['content']
        print(f"[SUCCESS] Chunk {chunk_idx} generated in {processing_time:.1f}s")
        return result.strip()
        
    except KeyboardInterrupt:
        print(f"[WARNING] Chunk {chunk_idx} interrupted by user")
        return "Analysis interrupted by user"
    except Exception as e:
        print(f"[ERROR] Error in generating lesson for chunk {chunk_idx}: {e}")
        return "Error occurred during analysis"

def find_pdf_by_subject_chapter(subject, chapter):
    """Find PDF file by subject and chapter name"""
    subject_dir = os.path.join(BOOKS_DIR, subject)
    if not os.path.exists(subject_dir):
        return None
    
    for file in os.listdir(subject_dir):
        if file.lower().endswith('.pdf') and chapter.lower() in file.lower():
            return os.path.join(subject_dir, file)
    return None

def process_pdf_for_subject_chapter(subject, chapter):
    """Process PDF for specific subject and chapter"""
    pdf_path = find_pdf_by_subject_chapter(subject, chapter)
    if not pdf_path:
        print(f"[ERROR] No PDF found for subject '{subject}' and chapter '{chapter}'")
        return None
    
    print(f"[INFO] Extracting text from: {pdf_path}")
    raw_text = extract_text_from_pdf(pdf_path)
    if not raw_text.strip():
        print(f"[WARNING] Extracted text is empty for: {pdf_path}")
        return None
    
    # Process chunks one by one to avoid memory issues
    chunk_generator = chunk_text(raw_text, max_chars=1000, overlap=100)
    all_flashcards = []
    all_quizzes = []
    
    # Process only first 2 chunks for faster results
    chunk_count = 0
    max_chunks = 2
    
    for chunk in chunk_generator:
        if chunk_count >= max_chunks:
            break
            
        chunk_count += 1
        print(f"[INFO] Processing chunk {chunk_count} ({len(chunk)} chars)...")
        lesson_script = generate_lesson_script(chunk, subject, chapter, chunk_idx=chunk_count)
        
        # Debug: Print the first 200 characters of the response
        print(f"[DEBUG] AI Response preview: {lesson_script[:200]}...")
        
        # Create TypeScript content directly from AI response
        print(f"[INFO] Creating TypeScript content from chunk {chunk_count}")
        
        # Generate flashcards and quizzes based on the AI response
        # We'll create structured content based on the text analysis
        import re
        
        # Extract key concepts from the AI response for flashcards
        sentences = re.split(r'[.!?]+', lesson_script)
        key_concepts = []
        
        for sentence in sentences:
            sentence = sentence.strip()
            if len(sentence) > 20 and len(sentence) < 200:  # Reasonable length for flashcards
                key_concepts.append(sentence)
        
        # Create flashcards from key concepts (limit to 3 per chunk)
        chunk_flashcards = []
        for i, concept in enumerate(key_concepts[:3]):
            # Clean the concept text
            clean_concept = concept.replace('*', '').replace('#', '').strip()
            if len(clean_concept) > 20:
                # Create a simple question-answer pair
                words = clean_concept.split()
                if len(words) > 8:
                    # Split into question and answer
                    mid_point = len(words) // 2
                    question_words = words[:mid_point]
                    answer_words = words[mid_point:]
                    
                    question = ' '.join(question_words)
                    answer = ' '.join(answer_words)
                    
                    # Create a proper question
                    if question.lower().startswith('what is'):
                        front = question
                    else:
                        front = f"What is {question}?"
                    
                    flashcard = {
                        "front": front,
                        "back": answer,
                        "subject": subject,
                        "category": chapter,
                        "difficulty": "easy"
                    }
                    chunk_flashcards.append(flashcard)
        
        # Create quiz questions from the content
        chunk_quizzes = []
        for i, concept in enumerate(key_concepts[:2]):
            clean_concept = concept.replace('*', '').replace('#', '').strip()
            if len(clean_concept) > 30:
                # Create a meaningful question
                question_text = clean_concept[:100] if len(clean_concept) > 100 else clean_concept
                quiz = {
                    "question": f"What is the main topic discussed in: '{question_text}'?",
                    "options": [
                        "Traditional craftsmanship",
                        "Modern technology", 
                        "Economic development",
                        "Social issues"
                    ],
                    "answer": 0,
                    "hint": "Think about the traditional aspects mentioned",
                    "subject": subject,
                    "difficulty": "easy",
                    "points": 10
                }
                chunk_quizzes.append(quiz)
        
        # Add to main collections
        all_flashcards.extend(chunk_flashcards)
        all_quizzes.extend(chunk_quizzes)
        
        print(f"[INFO] Added {len(chunk_flashcards)} flashcards and {len(chunk_quizzes)} quizzes from chunk {chunk_count}")
        
        gc.collect()
    
    # Add IDs to flashcards and quizzes
    for i, flashcard in enumerate(all_flashcards):
        flashcard['id'] = i + 1
    
    for i, quiz in enumerate(all_quizzes):
        quiz['id'] = i + 1
    
    # Generate TypeScript file with the content
    ts_content = f"""// Auto-generated content from PDF: {subject} - {chapter}
// Generated on: {time.strftime('%Y-%m-%d %H:%M:%S')}

import {{ QuizQuestion, Flashcard }} from '../quizData';

// Generated Quiz Questions
export const generatedQuizzes: QuizQuestion[] = [
"""
    
    # Add quiz content
    for i, quiz in enumerate(all_quizzes, 1):
        # Clean and escape the question text
        question_text = quiz.get('question', 'Question')
        question_text = question_text.replace('"', '\\"').replace('\n', ' ').replace('\r', ' ')
        question_text = ' '.join(question_text.split())  # Remove extra whitespace
        
        hint_text = quiz.get('hint', 'Hint')
        hint_text = hint_text.replace('"', '\\"').replace('\n', ' ').replace('\r', ' ')
        hint_text = ' '.join(hint_text.split())  # Remove extra whitespace
        
        ts_content += f"""  {{
    id: {i},
    question: "{question_text}",
    options: {json.dumps(quiz.get('options', ['A', 'B', 'C', 'D']))},
    answer: {quiz.get('answer', 0)},
    hint: "{hint_text}",
    subject: "{quiz.get('subject', subject)}",
    difficulty: "{quiz.get('difficulty', 'easy')}",
    points: {quiz.get('points', 10)}
  }},
"""
    
    ts_content += """];

// Generated Flashcards
export const generatedFlashcards: Flashcard[] = [
"""
    
    # Add flashcard content
    for i, flashcard in enumerate(all_flashcards, 1):
        # Clean and escape the flashcard text
        front_text = flashcard.get('front', 'Question')
        front_text = front_text.replace('"', '\\"').replace('\n', ' ').replace('\r', ' ')
        front_text = ' '.join(front_text.split())  # Remove extra whitespace
        
        back_text = flashcard.get('back', 'Answer')
        back_text = back_text.replace('"', '\\"').replace('\n', ' ').replace('\r', ' ')
        back_text = ' '.join(back_text.split())  # Remove extra whitespace
        
        ts_content += f"""  {{
    id: {i},
    front: "{front_text}",
    back: "{back_text}",
    subject: "{flashcard.get('subject', subject)}",
    category: "{flashcard.get('category', chapter)}",
    difficulty: "{flashcard.get('difficulty', 'easy')}"
  }},
"""
    
    ts_content += """];

// Helper functions
export const getGeneratedQuizzes = (): QuizQuestion[] => {
  return generatedQuizzes;
};

export const getGeneratedFlashcards = (): Flashcard[] => {
  return generatedFlashcards;
};

export const getGeneratedContentStats = () => {
  return {
    totalQuizzes: generatedQuizzes.length,
    totalFlashcards: generatedFlashcards.length,
    subject: "{subject}",
    chapter: "{chapter}"
  };
};
"""
    
    # Save the TypeScript file
    ts_file_path = os.path.join(SCRIPTS_DIR, f"{subject}_{chapter}_content.ts")
    with open(ts_file_path, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    
    print(f"[SUCCESS] Generated TypeScript file: {ts_file_path}")
    print(f"[INFO] Total quizzes: {len(all_quizzes)}, Total flashcards: {len(all_flashcards)}")
    
    return {
        'subject': subject,
        'chapter': chapter,
        'flashcards': all_flashcards,
        'quizzes': all_quizzes,
        'total_flashcards': len(all_flashcards),
        'total_quizzes': len(all_quizzes)
    }

def get_available_subjects():
    """Get list of available subjects (folders in BOOKS_DIR)"""
    if not os.path.exists(BOOKS_DIR):
        return []
    return [d for d in os.listdir(BOOKS_DIR) if os.path.isdir(os.path.join(BOOKS_DIR, d))]

def get_available_chapters(subject):
    """Get list of available chapters for a subject"""
    subject_dir = os.path.join(BOOKS_DIR, subject)
    if not os.path.exists(subject_dir):
        return []
    
    chapters = []
    for file in os.listdir(subject_dir):
        if file.lower().endswith('.pdf'):
            # Extract chapter name from filename (remove .pdf extension)
            chapter_name = os.path.splitext(file)[0]
            chapters.append(chapter_name)
    return chapters

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process PDF and generate quizzes/flashcards')
    parser.add_argument('--subject', required=True, help='Subject name')
    parser.add_argument('--chapter', required=True, help='Chapter name')
    
    args = parser.parse_args()
    
    # Process the specific subject and chapter
    result = process_pdf_for_subject_chapter(args.subject, args.chapter)
    
    if result:
        print(f"[SUCCESS] Successfully processed {args.subject} - {args.chapter}")
        print(f"[INFO] Generated {result['total_flashcards']} flashcards and {result['total_quizzes']} quizzes")
    else:
        print(f"[ERROR] Failed to process {args.subject} - {args.chapter}")
        sys.exit(1) 