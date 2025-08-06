import os
import sys
import PyPDF2
import pdfplumber
import re

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF using multiple methods"""
    text = ""
    
    # Try pdfplumber first
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        if text.strip():
            return text.strip()
    except Exception as e:
        print(f"pdfplumber failed: {e}")
    
    # Fallback to PyPDF2
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text.strip()
    except Exception as e:
        print(f"PyPDF2 failed: {e}")
        return ""

def chunk_text(text, chunk_size=500):
    """Split text into chunks for processing"""
    words = text.split()
    chunks = []
    current_chunk = []
    current_length = 0
    
    for word in words:
        if current_length + len(word) + 1 <= chunk_size:
            current_chunk.append(word)
            current_length += len(word) + 1
        else:
            if current_chunk:
                chunks.append(' '.join(current_chunk))
            current_chunk = [word]
            current_length = len(word)
    
    if current_chunk:
        chunks.append(' '.join(current_chunk))
    
    return chunks

def generate_detailed_lesson_script(text):
    """Generate a detailed educational script with multiple scenes"""
    # Clean and process the text
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Extract key concepts and create detailed content
    lines = text.split('.')
    key_concepts = []
    
    for line in lines:
        line = line.strip()
        if len(line) > 20 and not line.startswith('Chapter') and not line.startswith('Unit'):
            key_concepts.append(line)
    
    # Create a comprehensive script structure
    script_parts = []
    
    # Introduction (30-45 seconds)
    script_parts.append({
        'scene': 'Introduction',
        'content': f"""Hello, young learners! Welcome to our exciting educational journey today! 
        We're going to explore some wonderful concepts together. 
        Get ready to learn, discover, and have fun as we dive into this amazing lesson!"""
    })
    
    # Main content scenes (1-2 minutes each)
    for i, concept in enumerate(key_concepts[:6], 1):  # Take up to 6 concepts
        if len(concept) > 10:
            script_parts.append({
                'scene': f'Learning Point {i}',
                'content': f"""Let's learn about: {concept}
                
                This is a fascinating concept that helps us understand our world better. 
                Let me explain this in detail so you can really grasp the idea.
                
                {concept} - this is something very important for us to learn.
                Think about it this way: when we understand this concept, we can apply it in many different situations.
                
                Let's break it down step by step. First, we need to understand the basic idea.
                Then, we can explore how it works in practice.
                Finally, we'll see how it connects to other things we know."""
            })
    
    # Interactive elements (30-45 seconds each)
    script_parts.append({
        'scene': 'Interactive Practice',
        'content': """Now let's practice what we've learned! 
        
        This is where the fun really begins. Let's work together to understand these concepts better.
        
        Can you think of examples from your own life? 
        How do you see these ideas in the world around you?
        
        Take a moment to reflect on what we've learned so far.
        What questions do you have? What would you like to explore further?"""
    })
    
    # Summary and conclusion (30-45 seconds)
    script_parts.append({
        'scene': 'Summary and Conclusion',
        'content': """Excellent work today! Let's review what we've learned.
        
        We've covered some really important concepts together.
        Remember, learning is a journey, and every step forward is progress.
        
        Keep exploring, keep asking questions, and keep growing!
        You're doing amazing work, and I'm so proud of your effort today.
        
        Thank you for learning with me! See you next time for more exciting discoveries!"""
    })
    
    # Format the script
    script_content = ""
    for part in script_parts:
        script_content += f"Scene: {part['scene']}\n"
        script_content += f"Pet: \"{part['content']}\"\n\n"
    
    return script_content

def main():
    if len(sys.argv) != 2:
        print("[ERROR] Usage: python pdf_script_enhanced.py <pdf_path>")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    
    if not os.path.exists(pdf_path):
        print(f"[ERROR] PDF file not found: {pdf_path}")
        sys.exit(1)
    
    print(f"[INFO] Extracting text from: {pdf_path}")
    
    # Extract text
    text = extract_text_from_pdf(pdf_path)
    
    if not text:
        print("[ERROR] Failed to extract text from PDF")
        sys.exit(1)
    
    print(f"[INFO] Extracted {len(text)} characters")
    
    # Generate detailed script
    script_content = generate_detailed_lesson_script(text)
    
    # Save script
    pdf_filename = os.path.splitext(os.path.basename(pdf_path))[0]
    script_path = f"scripts/{pdf_filename}_script.txt"
    
    # Ensure scripts directory exists
    os.makedirs("scripts", exist_ok=True)
    
    with open(script_path, 'w', encoding='utf-8') as f:
        f.write(script_content)
    
    print(f"[SUCCESS] Detailed script saved to: {script_path}")
    print(f"[INFO] Script contains {len(script_content.split())} words")
    print(f"[INFO] Estimated video duration: 2-3 minutes")

if __name__ == "__main__":
    main() 