# PDF Processing & Offline Quiz Generation Setup Guide

This guide explains how to set up the offline PDF processing system that generates quizzes and flashcards from your PDF textbooks using Gemma3n.

## Prerequisites

1. **Python 3.8+** installed on your system
2. **Ollama** installed and running with Gemma3n model
3. **PDF textbooks** organized by subject and chapter

## Installation Steps

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Install Ollama

Visit [ollama.ai](https://ollama.ai) and follow the installation instructions for your operating system.

### 3. Pull Gemma3n Model

```bash
ollama pull gemma3n
```

### 4. Test the System

Run the test script to verify everything is working:

```bash
python test_pdf_setup.py
```

This will:
- Create a test PDF with educational content
- Process it using Gemma3n
- Generate sample quizzes and flashcards
- Verify the system is working correctly

### 5. Organize Your PDFs

Create the following directory structure in your project:

```
src/lib/
├── books/
│   ├── Mathematics/
│   │   ├── Chapter 1 - Introduction.pdf
│   │   ├── Chapter 2 - Algebra.pdf
│   │   └── Chapter 3 - Geometry.pdf
│   ├── Science/
│   │   ├── Chapter 1 - Physics.pdf
│   │   ├── Chapter 2 - Chemistry.pdf
│   │   └── Chapter 3 - Biology.pdf
│   └── English/
│       ├── Chapter 1 - Grammar.pdf
│       ├── Chapter 2 - Literature.pdf
│       └── Chapter 3 - Writing.pdf
└── scripts/
    └── (Generated content will be saved here)
```

## Usage

### 1. Upload PDFs via Dashboard

1. Open the dashboard and navigate to "Study Materials"
2. Click the "PDF Browser" button
3. Click "Upload PDF" to add new PDFs
4. Specify the subject and chapter name
5. The system will automatically process the PDF and generate content

### 2. Generate Content from Existing PDFs

1. In the PDF Browser, select a subject and chapter from the dropdown
2. Click "Generate Quizzes & Flashcards"
3. The system will:
   - Extract text from the PDF
   - Process content with Gemma3n
   - Generate quizzes and flashcards
   - Save the content for offline use

### 3. Use Generated Content

Once content is generated, you can:
- Start quizzes with PDF-generated questions
- Study flashcards created from your textbook content
- All content works completely offline

## How It Works

### PDF Processing Pipeline

1. **Text Extraction**: Uses PyMuPDF and pdfplumber to extract text from PDFs
2. **Content Chunking**: Breaks large PDFs into manageable chunks (4500 characters with 700 character overlap)
3. **AI Processing**: Sends each chunk to Gemma3n for quiz and flashcard generation
4. **Content Storage**: Saves generated content in localStorage for offline access
5. **Format Conversion**: Converts AI-generated content to the dashboard's standard format

### Content Generation

The system generates:
- **10-15 flashcards** per chapter with questions and answers
- **10-15 quiz questions** with multiple choice options
- Content is tailored for Class 1-5 level students
- Questions are based strictly on the PDF content

## File Structure

```
src/lib/
├── pdfProcessor.py          # Main PDF processing script
├── pdfGeneratedContent.ts   # TypeScript interfaces and utilities
├── books/                   # PDF storage directory
├── scripts/                 # Generated content storage
└── components/
    └── PDFBrowser.tsx       # PDF browser component
```

## Troubleshooting

### Common Issues

1. **Ollama not running**
   - Start Ollama: `ollama serve`
   - Check if gemma3n model is available: `ollama list`

2. **PDF text extraction fails**
   - Ensure PDF is not password protected
   - Try different PDF format or OCR if needed
   - Check if PDF contains actual text (not just images)

3. **Content generation fails**
   - Check Ollama logs for errors
   - Ensure sufficient system memory for Gemma3n
   - Verify PDF content is readable and substantial

### Performance Tips

- Use PDFs with clear, readable text
- Keep chapter PDFs under 50 pages for optimal processing
- Ensure stable internet connection during initial model download
- Close other applications to free up memory during processing

## Security Notes

- All processing happens locally on your machine
- No PDF content is sent to external servers
- Generated content is stored locally in browser localStorage
- PDF files remain on your local system

## Customization

You can modify the generation prompts in `pdfProcessor.py` to:
- Adjust difficulty levels
- Change question types
- Modify content format
- Add specific subject requirements

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check browser console for JavaScript errors
4. Review Python script logs for processing errors 