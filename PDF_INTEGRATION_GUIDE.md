# PDF Integration Guide

## Overview

This guide explains how the PDF integration works in the CogniFlow learning platform. The system allows users to upload PDF files and automatically generate quizzes and flashcards from the content using AI.

## How It Works

### 1. PDF Upload Process

1. **Upload PDF**: Users upload a PDF file through the PDF Browser interface
2. **Content Extraction**: The system extracts text from the PDF using PyMuPDF and pdfplumber
3. **AI Processing**: The extracted text is processed by Gemma3n AI to generate educational content
4. **Content Generation**: Quizzes and flashcards are automatically created from the PDF content
5. **TypeScript Generation**: The content is saved as TypeScript files for easy integration

### 2. File Structure

```
src/
├── lib/
│   ├── books/                    # PDF storage
│   │   ├── English/
│   │   │   └── 10.pdf
│   │   └── Mathematics/
│   │       └── Chapter1.pdf
│   ├── scripts/                  # Generated content
│   │   ├── English_10_content.ts
│   │   └── Mathematics_Chapter1_content.ts
│   └── pdfProcessor.py          # PDF processing script
├── app/
│   └── api/
│       └── pdf-process/
│           └── route.ts         # API endpoint
└── components/
    ├── PDFBrowser.tsx           # PDF upload interface
    ├── flashcards.tsx           # Flashcard component
    └── quizes.tsx              # Quiz component
```

### 3. API Endpoints

#### POST `/api/pdf-process`
Upload and process a PDF file.

**Request Body:**
```typescript
{
  file: File,           // PDF file
  subject: string,      // Subject name (e.g., "Mathematics")
  chapter: string       // Chapter name (e.g., "Chapter 1")
}
```

**Response:**
```typescript
{
  success: boolean,
  content: {
    subject: string,
    chapter: string,
    total_quizzes: number,
    total_flashcards: number,
    file_path: string
  },
  message: string
}
```

#### GET `/api/pdf-process?action=subjects`
Get list of available subjects.

#### GET `/api/pdf-process?action=chapters&subject={subject}`
Get chapters for a specific subject.

#### GET `/api/pdf-process?action=content&subject={subject}`
Get generated content for a subject.

## Usage Instructions

### For Users

1. **Access PDF Browser**: Click on "PDF Browser" in the Learning Tools section
2. **Upload PDF**: 
   - Click "Upload PDF" button
   - Select your PDF file
   - Enter subject and chapter names
   - Click "Upload"
3. **Wait for Processing**: The system will process your PDF and generate content
4. **Start Learning**: Use the generated quizzes and flashcards

### For Developers

#### Adding PDF Content to Components

```typescript
// In your component
const [usePDFContent, setUsePDFContent] = useState(false);
const [selectedSubject, setSelectedSubject] = useState('');
const [selectedChapter, setSelectedChapter] = useState('');

// Pass these props to quiz/flashcard components
<Quiz
  usePDFContent={usePDFContent}
  subject={selectedSubject}
  chapter={selectedChapter}
  onComplete={handleQuizComplete}
/>
```

#### Loading PDF Content Programmatically

```typescript
// Load PDF-generated content
const loadPDFContent = async (subject: string, chapter: string) => {
  try {
    const module = await import(`@/lib/scripts/${subject}_${chapter}_content.ts`);
    return {
      quizzes: module.generatedQuizzes || [],
      flashcards: module.generatedFlashcards || []
    };
  } catch (error) {
    console.log('No PDF content found');
    return { quizzes: [], flashcards: [] };
  }
};
```

## Generated Content Structure

### Quiz Questions
```typescript
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  hint: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}
```

### Flashcards
```typescript
export interface Flashcard {
  id: number;
  front: string;
  back: string;
  subject: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}
```

## Configuration

### Python Dependencies
Make sure you have the required Python packages installed:

```bash
pip install PyMuPDF pdfplumber ollama
```

### Ollama Setup
Ensure Ollama is running with the Gemma3n model:

```bash
ollama run gemma3n
```

## Troubleshooting

### Common Issues

1. **PDF Processing Fails**
   - Check if Ollama is running
   - Verify the PDF file is not corrupted
   - Check Python dependencies are installed

2. **Content Not Loading**
   - Verify the TypeScript file was generated
   - Check file paths are correct
   - Ensure subject/chapter names match exactly

3. **AI Generation Issues**
   - Check Ollama service status
   - Verify Gemma3n model is available
   - Check network connectivity

### Debug Mode

Enable debug logging by setting environment variables:

```bash
export DEBUG_PDF_PROCESSING=true
export DEBUG_AI_GENERATION=true
```

## Best Practices

1. **PDF Quality**: Use high-quality, text-based PDFs for best results
2. **Naming**: Use consistent subject and chapter naming conventions
3. **Content Size**: Large PDFs may take longer to process
4. **Backup**: Keep original PDF files as backup
5. **Testing**: Test with small PDFs first before processing large documents

## Security Considerations

- PDF files are stored locally on the server
- Generated content is saved as TypeScript files
- No sensitive data is transmitted to external services
- AI processing is done locally via Ollama

## Performance Tips

1. **Chunk Processing**: Large PDFs are processed in chunks to avoid memory issues
2. **Caching**: Generated content is cached as TypeScript files
3. **Lazy Loading**: Content is loaded only when needed
4. **Optimization**: Use appropriate chunk sizes for your PDFs

## Future Enhancements

- Support for more document formats (DOCX, TXT)
- Advanced content filtering and customization
- Batch processing for multiple PDFs
- Content versioning and updates
- Export functionality for generated content
- Integration with external learning management systems

## Support

For issues or questions about the PDF integration:

1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Test with the provided test script: `python test_pdf_integration.py`
4. Contact the development team for assistance

---

**Note**: This integration requires Ollama to be running with the Gemma3n model for AI-powered content generation. 