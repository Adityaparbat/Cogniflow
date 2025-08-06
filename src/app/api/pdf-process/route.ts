import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const subject = formData.get('subject') as string;
    const chapter = formData.get('chapter') as string;
    const action = formData.get('action') as string;

    if (!subject || !chapter) {
      return NextResponse.json(
        { error: 'Subject and chapter are required' },
        { status: 400 }
      );
    }

    // Create directories if they don't exist
    const booksDir = join(process.cwd(), 'src', 'lib', 'books', subject);
    const scriptsDir = join(process.cwd(), 'src', 'lib', 'scripts');
    
    await mkdir(booksDir, { recursive: true });
    await mkdir(scriptsDir, { recursive: true });

    if (file) {
      // Handle file upload
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Save the PDF file
      const fileName = `${chapter}.pdf`;
      const filePath = join(booksDir, fileName);
      await writeFile(filePath, buffer);

      console.log(`PDF saved to: ${filePath}`);
    }

    // Process the PDF using Python script
    const pythonScriptPath = join(process.cwd(), 'src', 'lib', 'pdfProcessor.py');
    
    // Run the Python script
    const { stdout, stderr } = await execAsync(
      `python "${pythonScriptPath}" --subject "${subject}" --chapter "${chapter}"`,
      { cwd: process.cwd() }
    );

    if (stderr) {
      console.error('Python script stderr:', stderr);
    }

    console.log('Python script stdout:', stdout);

    // Read the generated TypeScript content
    const generatedContentPath = join(scriptsDir, `${subject}_${chapter}_content.ts`);
    
    try {
      const contentData = await readFile(generatedContentPath, 'utf-8');
      
      // Extract content stats from the TypeScript file
      const quizMatch = contentData.match(/export const generatedQuizzes: QuizQuestion\[\] = \[([\s\S]*?)\];/);
      const flashcardMatch = contentData.match(/export const generatedFlashcards: Flashcard\[\] = \[([\s\S]*?)\];/);
      
      const quizCount = quizMatch ? (quizMatch[1].match(/\{/g) || []).length : 0;
      const flashcardCount = flashcardMatch ? (flashcardMatch[1].match(/\{/g) || []).length : 0;

      return NextResponse.json({
        success: true,
        content: {
          subject,
          chapter,
          total_quizzes: quizCount,
          total_flashcards: flashcardCount,
          file_path: `${subject}_${chapter}_content.ts`
        },
        message: 'PDF processed successfully and content generated'
      });
    } catch (readError) {
      console.error('Error reading generated content:', readError);
      return NextResponse.json({
        success: false,
        error: 'Failed to read generated content'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const subject = searchParams.get('subject');

    if (action === 'subjects') {
      // Get available subjects
      const fs = await import('fs/promises');
      const booksDir = join(process.cwd(), 'src', 'lib', 'books');
      
      try {
        const subjects = await fs.readdir(booksDir);
        return NextResponse.json({ subjects });
      } catch (error) {
        return NextResponse.json({ subjects: [] });
      }
    }

    if (action === 'chapters' && subject) {
      // Get available chapters for a subject
      const fs = await import('fs/promises');
      const subjectDir = join(process.cwd(), 'src', 'lib', 'books', subject);
      
      try {
        const files = await fs.readdir(subjectDir);
        const chapters = files
          .filter(file => file.endsWith('.pdf'))
          .map(file => file.replace('.pdf', ''));
        return NextResponse.json({ chapters });
      } catch (error) {
        return NextResponse.json({ chapters: [] });
      }
    }

    if (action === 'content') {
      // Get content for all subjects or a specific subject
      const fs = await import('fs/promises');
      const scriptsDir = join(process.cwd(), 'src', 'lib', 'scripts');
      const chapter = searchParams.get('chapter');
      
      try {
        const files = await fs.readdir(scriptsDir);
        let contentFiles = files.filter(file => file.endsWith('_content.ts'));
        
        // If subject is specified, filter for that specific subject
        if (subject) {
          contentFiles = contentFiles.filter(file => 
            file.startsWith(`${subject}_`)
          );
        }
        
        // If chapter is specified, filter for that specific chapter
        if (chapter) {
          contentFiles = contentFiles.filter(file => 
            file.includes(`_${chapter}_`)
          );
        }
        
        const content = [];
        for (const file of contentFiles) {
          const contentData = await fs.readFile(join(scriptsDir, file), 'utf-8');
          
          // Extract stats from TypeScript file
          const quizMatch = contentData.match(/export const generatedQuizzes: QuizQuestion\[\] = \[([\s\S]*?)\];/);
          const flashcardMatch = contentData.match(/export const generatedFlashcards: Flashcard\[\] = \[([\s\S]*?)\];/);
          
          const quizCount = quizMatch ? (quizMatch[1].match(/\{/g) || []).length : 0;
          const flashcardCount = flashcardMatch ? (flashcardMatch[1].match(/\{/g) || []).length : 0;
          
          // Extract subject and chapter name from filename
          const fileNameParts = file.replace('_content.ts', '').split('_');
          const fileSubject = fileNameParts[0];
          const fileChapter = fileNameParts.slice(1).join('_');
          
          content.push({
            subject: fileSubject,
            chapter: fileChapter,
            total_quizzes: quizCount,
            total_flashcards: flashcardCount,
            file_path: file
          });
        }
        
        return NextResponse.json({ content });
      } catch (error) {
        console.error('Error reading content files:', error);
        return NextResponse.json({ content: [] });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Error in GET request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 