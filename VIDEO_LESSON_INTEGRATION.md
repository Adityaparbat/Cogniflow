# Video Lesson Integration

The video lesson functionality from the `genrate` folder has been successfully integrated into the main dashboard server. Now you can access all video lesson features through the same Next.js server without needing to run separate servers.

## How It Works

Instead of running two separate servers:
- Dashboard: `npm run dev` (port 3000)
- Video Lesson: `node server.js` (port 3003)

You now only need to run:
- Dashboard: `npm run dev` (port 3000)

## New API Endpoints

All video lesson functionality is now available through the `/api/video_lesson` endpoint:

### GET Endpoints

1. **Health Check**
   ```
   GET /api/video_lesson?action=health
   ```

2. **Get Chapters for Subject**
   ```
   GET /api/video_lesson?action=chapters&subject=english
   GET /api/video_lesson?action=chapters&subject=hindi
   GET /api/video_lesson?action=chapters&subject=math
   ```

3. **Serve Video Files**
   ```
   GET /api/video_lesson?action=video&filename=english_chapter1.mp4
   ```

4. **Serve Book Files**
   ```
   GET /api/video_lesson?action=book&filename=aemr101.pdf&subject=english
   ```

5. **Serve Static Assets**
   ```
   GET /video_lesson_assets/static_slides/slide_001.png
   GET /video_lesson_assets/narration_audio/narration_001.wav
   ```

### POST Endpoints

1. **Extract Text from PDF**
   ```json
   POST /api/video_lesson
   {
     "action": "extract-text",
     "pdfPath": "books/class1_english[1]/aemr101.pdf"
   }
   ```

2. **Generate Script with Gemma AI**
   ```json
   POST /api/video_lesson
   {
     "action": "generate-script",
     "pdfPath": "books/class1_english[1]/aemr101.pdf",
     "scriptPath": "scripts/aemr101_script.txt"
   }
   ```

3. **Generate Video**
   ```json
   POST /api/video_lesson
   {
     "action": "generate-video",
     "scriptPath": "scripts/aemr101_script.txt",
     "outputPath": "generated_videos/test_video.mp4"
   }
   ```

## File Structure

The following assets have been copied from the `genrate` folder to `video_lesson_assets/`:

```
video_lesson_assets/
├── books/                    # PDF textbooks
│   ├── class1_english[1]/
│   ├── class1_hindi[1]/
│   └── class1_math[1]/
├── scripts/                  # Generated scripts
├── generated_videos/         # Output videos
├── static_slides/           # Slide images and videos
├── narration_audio/         # Audio files
├── ai_clips/               # AI-generated clips
├── pdf_script_enhanced.py  # PDF text extraction script
└── complete_video_current.py # Video generation script
```

## Python Dependencies

Make sure you have the following Python packages installed:

```bash
pip install PyPDF2==3.0.1 pdfplumber==0.10.3 ollama==0.1.7 Pillow==10.1.0 pyttsx3==2.90 opencv-python-headless==4.8.1.78 numpy==1.26.4 requests==2.31.0
```

## Gemma AI Integration

The video lesson system now uses **Gemma 3n** for intelligent script generation:

1. **Ollama Setup**: Make sure Ollama is running with the Gemma 3n model
   ```bash
   ollama pull gemma3n:e4b
   ollama serve
   ```

2. **Script Generation Process**:
   - Extracts text from PDF using `pdf_script_enhanced.py`
   - Generates educational scripts using `pdf_script_gemma.py` with Gemma AI
   - Creates engaging, child-friendly content with proper scene structure
   - Produces videos with AI-generated narration and visual slides

## Usage Examples

### Frontend Integration

You can now make requests to the video lesson API from your frontend components:

```typescript
// Get chapters for a subject
const response = await fetch('/api/video_lesson?action=chapters&subject=english');
const { chapters } = await response.json();

// Generate a video
const videoResponse = await fetch('/api/video_lesson', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'generate-video',
    scriptPath: 'scripts/aemr101_script.txt',
    outputPath: 'generated_videos/my_video.mp4'
  })
});

// Serve a video
const videoUrl = '/api/video_lesson?action=video&filename=my_video.mp4';
```

### React Components

The complete video lesson interface has been integrated as a Next.js page:

1. **Video Lesson Page** (`/video-lessons`)
   - Complete video lesson interface (recreated from the original genrate app)
   - Subject selection (English, Hindi, Mathematics)
   - Chapter browsing and selection
   - Video generation with progress tracking
   - Video playback

2. **Component Structure**:
   - `VideoLessonHome` - Subject selection page
   - `ChapterView` - Chapter browsing for selected subject
   - `VideoGenerator` - Video generation process with progress indicators
   - `VideoPlayer` - Video playback interface

### Accessing Video Lessons

From your dashboard, click the "Open Video Generator" button to automatically redirect to `/video-lessons`.

The video lesson page provides the exact same functionality as the original genrate app, but now integrated into your main dashboard server.

## Migration Notes

- The original `genrate/server.js` functionality is now integrated into Next.js API routes
- All static assets are served through Next.js rewrites
- Python scripts are executed from the `video_lesson_assets` directory
- The same Python dependencies and scripts are used, just from a different location

## Benefits

1. **Single Server**: No need to manage multiple servers
2. **Unified Development**: All functionality accessible through one development server
3. **Better Integration**: Video lesson features can be easily integrated into the dashboard UI
4. **Simplified Deployment**: Only one server to deploy and manage
