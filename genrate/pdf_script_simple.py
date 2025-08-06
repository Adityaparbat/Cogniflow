import os
import sys
import PyPDF2
import pdfplumber

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

def generate_simple_script(raw_text):
    """Generate a simple educational script without using Ollama"""
    lines = raw_text.split('\n')
    script_lines = []
    
    script_lines.append("Chunk 1: Introduction")
    script_lines.append('Pet: "Hello, young learners! Welcome to our exciting lesson today!"')
    script_lines.append('')
    
    # Take first few meaningful lines from the text
    meaningful_lines = [line.strip() for line in lines if line.strip() and len(line.strip()) > 10][:5]
    
    for i, line in enumerate(meaningful_lines, 1):
        script_lines.append(f"Scene {i}: Learning Point {i}")
        script_lines.append(f'Pet: "Let\'s learn about: {line[:100]}..."')
        script_lines.append('')
    
    script_lines.append("Scene Final: Summary")
    script_lines.append('Pet: "Great job learning with me today! Keep exploring and asking questions!"')
    
    return '\n'.join(script_lines)

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
    
    print(f"[INFO] File: {os.path.basename(pdf_path)} | Text length: {len(raw_text)} chars")
    print(f"[PROCESSING] Generating simple script...")
    
    script = generate_simple_script(raw_text)
    
    with open(script_path, 'w', encoding='utf-8') as f:
        f.write(script)
    
    print(f"[FINISHED] Script saved to: {script_path}")
    print(f"[SUCCESS] Script generation completed successfully!")

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