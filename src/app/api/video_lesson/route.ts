import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readdir, readFile } from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

// Helper function to get the video lesson assets path
function getVideoLessonAssetsPath(subPath: string = '') {
  return path.join(process.cwd(), 'video_lesson_assets', subPath);
}

// GET endpoint for chapters and video serving
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const subject = searchParams.get('subject');
    const filename = searchParams.get('filename');

    // Serve static files
    if (action === 'static') {
      const filePath = searchParams.get('path');
      if (!filePath) {
        return NextResponse.json({ error: 'File path is required' }, { status: 400 });
      }

      const fullPath = path.join(getVideoLessonAssetsPath(), filePath);
      
      try {
        const fileBuffer = await readFile(fullPath);
        
        // Determine content type based on file extension
        const ext = path.extname(filePath).toLowerCase();
        let contentType = 'application/octet-stream';
        
        if (ext === '.mp4') contentType = 'video/mp4';
        else if (ext === '.wav') contentType = 'audio/wav';
        else if (ext === '.png') contentType = 'image/png';
        else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        else if (ext === '.pdf') contentType = 'application/pdf';
        
        return new NextResponse(fileBuffer as any, {
          headers: {
            'Content-Type': contentType,
            'Content-Length': fileBuffer.length.toString(),
          },
        });
      } catch (error) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
    }

    // Serve video files
    if (action === 'video' && filename) {
      const videoPath = path.join(getVideoLessonAssetsPath('generated_videos'), filename);
      
      try {
        const videoBuffer = await readFile(videoPath);
        return new NextResponse(videoBuffer as any, {
          headers: {
            'Content-Type': 'video/mp4',
            'Content-Length': videoBuffer.length.toString(),
          },
        });
      } catch (error) {
        return NextResponse.json({ error: 'Video not found' }, { status: 404 });
      }
    }

    // Get chapters for a subject
    if (action === 'chapters' && subject) {
      const subjectPath = path.join(getVideoLessonAssetsPath('books'), `class1_${subject}[1]`);
      
      try {
        const files = await readdir(subjectPath);
        const pdfFiles = files.filter(file => file.endsWith('.pdf'));
        
        const chapters = pdfFiles.map((file, index) => ({
          id: index + 1,
          name: `Chapter ${index + 1}`,
          filename: file,
          path: `books/class1_${subject}[1]/${file}`
        }));
        
        return NextResponse.json({ chapters });
      } catch (error) {
        console.error('Error reading chapters:', error);
        return NextResponse.json({ error: 'Failed to read chapters' }, { status: 500 });
      }
    }

    // Serve book files
    if (action === 'book' && filename && subject) {
      const bookPath = path.join(getVideoLessonAssetsPath('books'), `class1_${subject}[1]`, filename);
      
      try {
        const bookBuffer = await readFile(bookPath);
        return new NextResponse(bookBuffer as any, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Length': bookBuffer.length.toString(),
          },
        });
      } catch (error) {
        return NextResponse.json({ error: 'Book not found' }, { status: 404 });
      }
    }

    // Health check
    if (action === 'health') {
      return NextResponse.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        message: 'Video lesson API is running'
      });
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

// POST endpoint for text extraction and video generation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, pdfPath, scriptPath, outputPath } = body;

    if (action === 'extract-text') {
      // Text extraction from PDF
      if (!pdfPath) {
        return NextResponse.json({ error: 'PDF path is required' }, { status: 400 });
      }

      const fullPath = path.join(getVideoLessonAssetsPath(), pdfPath.replace(/^\//, ''));
      
      console.log('Extracting text from:', fullPath);
      
      try {
        const { stdout, stderr } = await execAsync(
          `python "${getVideoLessonAssetsPath('pdf_script_enhanced.py')}" "${fullPath}"`,
          { cwd: getVideoLessonAssetsPath() }
        );
        
        if (stderr) {
          console.error('Python script error:', stderr);
        }
        
        return NextResponse.json({ 
          success: true, 
          message: 'Text extraction completed',
          output: stdout 
        });
      } catch (error) {
        console.error('Error extracting text:', error);
        return NextResponse.json({ error: 'Failed to extract text' }, { status: 500 });
      }
    }

    if (action === 'generate-script') {
      // Generate script using Gemma
      if (!pdfPath || !scriptPath) {
        return NextResponse.json({ error: 'PDF path and script path are required' }, { status: 400 });
      }

      console.log('=== SCRIPT GENERATION REQUEST ===');
      console.log('PDF path:', pdfPath);
      console.log('Script output path:', scriptPath);
      
      try {
        const fullPdfPath = path.join(getVideoLessonAssetsPath(), pdfPath.replace(/^\//, ''));
        const fullScriptPath = path.join(getVideoLessonAssetsPath(), scriptPath);

        const { stdout, stderr } = await execAsync(
          `python "${getVideoLessonAssetsPath('pdf_script_gemma.py')}" "${fullPdfPath}" "${fullScriptPath}"`,
          { cwd: getVideoLessonAssetsPath() }
        );
        
        if (stderr) {
          console.error('Script generation error:', stderr);
        }
        
        return NextResponse.json({ 
          success: true, 
          message: 'Script generation completed',
          output: stdout,
          scriptPath: scriptPath
        });
      } catch (error) {
        console.error('Error generating script:', error);
        return NextResponse.json({ error: 'Failed to generate script' }, { status: 500 });
      }
    }

    if (action === 'generate-video') {
      // Video generation
      if (!scriptPath || !outputPath) {
        return NextResponse.json({ error: 'Script path and output path are required' }, { status: 400 });
      }

      console.log('=== VIDEO GENERATION REQUEST ===');
      console.log('Script path requested:', scriptPath);
      console.log('Output path requested:', outputPath);
      
      try {
        // TEMPORARY FIX: Use the correct script path if lesson_script.txt is requested
        let actualScriptPath = scriptPath;
        if (scriptPath === 'scripts/lesson_script.txt') {
          actualScriptPath = 'scripts/aemr101_script.txt';
          console.log('=== TEMPORARY FIX APPLIED ===');
          console.log('Original script path:', scriptPath);
          console.log('Corrected script path:', actualScriptPath);
        }

        const fullScriptPath = path.join(getVideoLessonAssetsPath(), actualScriptPath);
        const fullOutputPath = path.join(getVideoLessonAssetsPath(), outputPath);

        const { stdout, stderr } = await execAsync(
          `python "${getVideoLessonAssetsPath('complete_video_current.py')}" "${fullScriptPath}" "${fullOutputPath}"`,
          { cwd: getVideoLessonAssetsPath() }
        );
        
        if (stderr) {
          console.error('Video generation error:', stderr);
        }
        
        return NextResponse.json({ 
          success: true, 
          message: 'Video generation completed',
          output: stdout,
          videoPath: outputPath
        });
      } catch (error) {
        console.error('Error generating video:', error);
        return NextResponse.json({ error: 'Failed to generate video' }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
