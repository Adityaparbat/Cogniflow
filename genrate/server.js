const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(express.json());
app.use(express.static('dist'));
app.use('/books', express.static('books'));

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// API Routes
app.get('/api/chapters/:subject', async (req, res) => {
  try {
    const { subject } = req.params;
    const subjectPath = path.join(__dirname, 'books', `class1_${subject}[1]`);
    
    const files = await fs.readdir(subjectPath);
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
    
    const chapters = pdfFiles.map((file, index) => ({
      id: index + 1,
      name: `Chapter ${index + 1}`,
      filename: file,
      path: `/books/class1_${subject}[1]/${file}`
    }));
    
    res.json({ chapters });
  } catch (error) {
    console.error('Error reading chapters:', error);
    res.status(500).json({ error: 'Failed to read chapters' });
  }
});

app.post('/api/extract-text', async (req, res) => {
  try {
    const { pdfPath } = req.body;
    const fullPath = path.join(__dirname, pdfPath.replace(/^\//, ''));
    
    console.log('Extracting text from:', fullPath);
    console.log('Using Python script: pdf_script_enhanced.py');
    
    // Call Python script for text extraction
    const { stdout, stderr } = await execAsync(`python pdf_script_enhanced.py "${fullPath}"`);
    
    if (stderr) {
      console.error('Python script error:', stderr);
    }
    
    res.json({ 
      success: true, 
      message: 'Text extraction completed',
      output: stdout 
    });
  } catch (error) {
    console.error('Error extracting text:', error);
    res.status(500).json({ error: 'Failed to extract text' });
  }
});

app.post('/api/generate-video', async (req, res) => {
  try {
    const { scriptPath, outputPath } = req.body;
    
    console.log('=== VIDEO GENERATION REQUEST ===');
    console.log('Script path requested:', scriptPath);
    console.log('Output path requested:', outputPath);
    console.log('Full request body:', JSON.stringify(req.body, null, 2));
    console.log('Using Python script: complete_video_current.py');
    console.log('=== BROWSER CACHE DEBUG ===');
    console.log('User-Agent:', req.get('User-Agent'));
    console.log('Cache-Control:', req.get('Cache-Control'));
    console.log('If-None-Match:', req.get('If-None-Match'));
    
    // Call Python script for video generation
    // TEMPORARY FIX: Use the correct script path if lesson_script.txt is requested
    let actualScriptPath = scriptPath;
    if (scriptPath === 'scripts/lesson_script.txt') {
      actualScriptPath = 'scripts/aemr101_script.txt';
      console.log('=== TEMPORARY FIX APPLIED ===');
      console.log('Original script path:', scriptPath);
      console.log('Corrected script path:', actualScriptPath);
    }
    
    const { stdout, stderr } = await execAsync(`python complete_video_current.py "${actualScriptPath}" "${outputPath}"`);
    
    if (stderr) {
      console.error('Video generation error:', stderr);
    }
    
    res.json({ 
      success: true, 
      message: 'Video generation completed',
      output: stdout,
      videoPath: outputPath
    });
  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({ error: 'Failed to generate video' });
  }
});

app.get('/api/video/:filename', (req, res) => {
  const { filename } = req.params;
  const videoPath = path.join(__dirname, 'generated_videos', filename);
  
  if (fsSync.existsSync(videoPath)) {
    res.sendFile(videoPath);
  } else {
    res.status(404).json({ error: 'Video not found' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Handle all other routes - serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`App available at: http://localhost:${PORT}`);
}); 