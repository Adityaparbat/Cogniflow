import os
import sys
import PyPDF2
import pdfplumber
import gc
from ollama import chat  # Official Python client

def extract_text_from_pdf(pdf_path):
    text = ''
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ''
    except Exception as e:
        print(f"[ERROR] pdfplumber failed on {pdf_path}: {e}, trying PyPDF2...")
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() or ''
        except Exception as e2:
            print(f"[ERROR] PyPDF2 also failed: {e2}")
    return text

def chunk_text(text, max_chars=4500, overlap=700):
    start = 0
    length = len(text)
    while start < length:
        end = min(start + max_chars, length)
        yield text[start:end]
        start += max_chars - overlap

def generate_lesson_script(raw_text, subject, chunk_idx=None):
    prompt = f"""You are Gemma 3n, an expert children's script generator. Transform the given raw lesson text into only the pet's spoken lines, organized with chunk and scene headings exactly as in this example:

Chunk 1: Introduction  
Pet: "Hello, superstar learners! I'm Pippin the Puppy, and today we're going on an amazing adventure—right inside your wonderful body! We'll sing, clap, wiggle, and explore all the parts that make you, you! Are you ready? Let's go!"

Scene 1: The Song of Our Parts  
Pet: "Two little hands go clap, clap, clap!  
Two little legs go tap, tap, tap!  
Two little eyes are open wide,  
One little head goes side to side!"  
Pet: "Clap with me—clap, clap! Tap with me—tap, tap! Now wiggle your head side to side—tilt, tilt! Great job!"

Scene 2: Eyes and Ears Exploration  
Pet: "Let's look at our amazing eyes and ears next!"  
Pet: "Two little eyes are open wide,  
Two little ears to hear inside!"  
Pet: "Can you look all around and listen for sounds? What do you see? What do you hear? Tell me!"

Scene 3: All Together Now  
Pet: "Time for another song about you!  
One little head goes side to side,  
One little body that belongs to me!"  
Pet: "That's right—your body is yours, a special gift to play, learn, and grow!"
this is the format in which you have to generate the script and stick to the format do not generating anything like actions sepcification or additional. but keep it engaging
Raw Lesson Text:  
{raw_text}

Instructions:  
- Produce only the "Chunk/Scene" headings and the Pet's lines in this exact format.  
- Do not include any other narration, stage directions, or metadata.  
- Preserve line breaks and punctuation as shown.  
"""
    try:
        response = chat(model="gemma3n", messages=[{"role": "user", "content": prompt}])
        result = response['message']['content']
        print(f"[SUCCESS] Chunk {chunk_idx} generated successfully.")
        return result.strip()
    except Exception as e:
        print(f"[ERROR] Error in generating lesson: {e}")
        return "[Error: Ollama generation failed]"

def run_script_generation(pdf_path, script_path):
    if not os.path.exists(pdf_path):
        print(f"[ERROR] PDF file not found: {pdf_path}")
        return
    
    os.makedirs(os.path.dirname(script_path), exist_ok=True)

    print(f"[INFO] Extracting text from: {pdf_path}")
    raw_text = extract_text_from_pdf(pdf_path)

    if not raw_text.strip():
        print(f"[WARNING] Extracted text is empty for: {pdf_path}")
        return
    
    chunks = list(chunk_text(raw_text, max_chars=4500, overlap=700))
    print(f"[INFO] File: {os.path.basename(pdf_path)} | Total chunks: {len(chunks)}")

    with open(script_path, 'w', encoding='utf-8') as f:
        f.write("")  # Clear file

    for idx, chunk in enumerate(chunks, 1):
        print(f"[PROCESSING] Processing chunk {idx} ({len(chunk)} chars)...")
        lesson_script = generate_lesson_script(chunk, "lesson", chunk_idx=idx)
        with open(script_path, 'a', encoding='utf-8') as f:
            f.write(f"\n---\n[Script for Chunk {idx}]\n{lesson_script}\n")
        gc.collect()
        print(f"[SAVED] Appended chunk {idx} to {script_path}")

    print(f"[FINISHED] Script saved to: {script_path}")

# === RUN SCRIPT ===
if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Get PDF path from command line argument
        pdf_path = sys.argv[1]
        # Create output script path
        script_dir = os.path.join(os.path.dirname(pdf_path), '..', '..', 'scripts')
        os.makedirs(script_dir, exist_ok=True)
        script_path = os.path.join(script_dir, f"{os.path.splitext(os.path.basename(pdf_path))[0]}_script.txt")
        
        print(f"[INFO] Processing PDF: {pdf_path}")
        print(f"[INFO] Output script: {script_path}")
        
        run_script_generation(pdf_path, script_path)
    else:
        print("[ERROR] Please provide PDF path as command line argument")
        sys.exit(1)
