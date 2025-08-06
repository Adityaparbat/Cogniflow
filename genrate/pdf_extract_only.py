import os
import sys
import PyPDF2

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF using PyPDF2"""
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text.strip()
    except Exception as e:
        print(f"Error extracting text: {e}")
        return ""

def main():
    if len(sys.argv) != 2:
        print("[ERROR] Usage: python pdf_extract_only.py <pdf_path>")
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
    
    print(f"[INFO] Extracting text from: {pdf_path}")
    
    # Extract text
    text = extract_text_from_pdf(pdf_path)
    
    if not text:
        print("[ERROR] Failed to extract text from PDF")
        sys.exit(1)
    
    # Create a simple script format
    script_content = f"""Chunk 1: Introduction
Pet: "Hello, young learners! Welcome to our exciting lesson today!"

Scene 1: Learning Point 1
Pet: "Let's learn about: {text[:200]}..."

Scene 2: Learning Point 2
Pet: "Let's learn about: {text[200:400] if len(text) > 200 else text}..."

Scene 3: Learning Point 3
Pet: "Let's learn about: {text[400:600] if len(text) > 400 else text}..."

Scene Final: Summary
Pet: "Great job learning with me today! Keep exploring and asking questions!"
"""
    
    # Save script
    with open(script_path, 'w', encoding='utf-8') as f:
        f.write(script_content)
    
    print(f"[SUCCESS] Script saved to: {script_path}")
    print(f"[INFO] Extracted {len(text)} characters from PDF")

if __name__ == "__main__":
    main() 