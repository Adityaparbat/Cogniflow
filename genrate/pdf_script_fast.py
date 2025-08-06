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

def chunk_text(text, max_chars=4000):
    """Split text into chunks"""
    if len(text) <= max_chars:
        return [text]
    
    chunks = []
    current_chunk = ""
    
    for paragraph in text.split('\n'):
        if len(current_chunk) + len(paragraph) > max_chars:
            if current_chunk:
                chunks.append(current_chunk.strip())
                current_chunk = paragraph
            else:
                # If paragraph is too long, split it
                words = paragraph.split()
                for word in words:
                    if len(current_chunk) + len(word) + 1 > max_chars:
                        chunks.append(current_chunk.strip())
                        current_chunk = word
                    else:
                        current_chunk += " " + word if current_chunk else word
        else:
            current_chunk += "\n" + paragraph if current_chunk else paragraph
    
    if current_chunk.strip():
        chunks.append(current_chunk.strip())
    
    return chunks

def generate_simple_script(text_chunks):
    """Generate a simple script without AI"""
    script_content = ""
    
    for i, chunk in enumerate(text_chunks, 1):
        # Extract sentences from the chunk
        sentences = re.split(r'[.!?]+', chunk)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        script_content += f"Chunk {i}: Introduction\n"
        script_content += f"Pet: \"Hello! Let's learn about this interesting topic.\"\n\n"
        
        # Add a few key sentences as learning points
        for j, sentence in enumerate(sentences[:3], 1):
            if len(sentence) > 10:  # Only use meaningful sentences
                script_content += f"Scene {j}: Learning Point {j}\n"
                script_content += f"Pet: \"Let's learn about: {sentence[:100]}...\"\n\n"
        
        script_content += f"Scene Final: Summary\n"
        script_content += f"Pet: \"Great job learning with me today! Keep exploring and asking questions!\"\n\n"
    
    return script_content

def main():
    if len(sys.argv) != 2:
        print("[ERROR] Usage: python pdf_script_fast.py <pdf_path>")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    
    if not os.path.exists(pdf_path):
        print(f"[ERROR] PDF file not found: {pdf_path}")
        sys.exit(1)
    
    # Create scripts directory if it doesn't exist
    scripts_dir = os.path.join(os.path.dirname(pdf_path), '..', '..', 'scripts')
    os.makedirs(scripts_dir, exist_ok=True)
    
    # Generate output filename
    pdf_filename = os.path.splitext(os.path.basename(pdf_path))[0]
    script_path = os.path.join(scripts_dir, f"{pdf_filename}_script.txt")
    
    print(f"[INFO] Processing PDF: {pdf_path}")
    print(f"[INFO] Output script: {script_path}")
    
    # Extract text
    print(f"[INFO] Extracting text from: {pdf_path}")
    text = extract_text_from_pdf(pdf_path)
    
    if not text:
        print("[ERROR] Failed to extract text from PDF")
        sys.exit(1)
    
    # Split into chunks
    chunks = chunk_text(text)
    print(f"[INFO] File: {os.path.basename(pdf_path)} | Total chunks: {len(chunks)}")
    
    # Generate simple script
    script_content = generate_simple_script(chunks)
    
    # Save script
    with open(script_path, 'w', encoding='utf-8') as f:
        f.write(script_content)
    
    print(f"[SUCCESS] Script saved to: {script_path}")
    print(f"[INFO] Script length: {len(script_content)} characters")

if __name__ == "__main__":
    main() 