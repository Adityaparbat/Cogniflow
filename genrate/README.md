# Genrate - Offline Learning App

A complete offline-capable React TypeScript application that transforms PDF textbooks into engaging educational videos using AI-powered content generation.

## 🚀 Features

- **Offline-First Design**: Works completely offline with service worker caching
- **PDF Text Extraction**: Extracts text from PDF chapters using Python scripts
- **AI Script Generation**: Generates educational scripts using Ollama/Gemma
- **Video Generation**: Creates videos with TTS narration and visual content
- **PWA Support**: Installable as a Progressive Web App
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 📁 Project Structure

```
genrate/
├── books/                          # PDF textbooks organized by subject
│   ├── class1_english[1]/          # English chapters (aemr101.pdf - aemr109.pdf)
│   ├── class1_hindi[1]/            # Hindi chapters (ahsr101.pdf - ahsr119.pdf)
│   └── class1_math[1]/             # Math chapters (aejm101.pdf - aejm113.pdf)
├── src/                            # React TypeScript source code
│   ├── components/                 # React components
│   ├── hooks/                      # Custom React hooks
│   └── ...
├── public/                         # Static assets and service worker
├── pdf_script.py                   # Python script for text extraction and script generation
├── complete_video_current.py       # Python script for video generation
├── server.js                       # Express server for API endpoints
└── webpack.config.js               # Webpack configuration with service worker
```

## 🛠️ Setup Instructions

### Prerequisites

1. **Node.js** (v16 or higher)
2. **Python** (v3.8 or higher)
3. **FFmpeg** (for video generation)
4. **Ollama** (for AI script generation)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Install Python dependencies:**
   ```bash
   pip install PyMuPDF pdfplumber ollama pyttsx3 Pillow
   ```

3. **Install FFmpeg:**
   - **Windows**: Download from https://ffmpeg.org/download.html
   - **macOS**: `brew install ffmpeg`
   - **Linux**: `sudo apt install ffmpeg`

4. **Install and start Ollama:**
   ```bash
   # Install Ollama
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Pull the Gemma model
   ollama pull gemma3n
   ```

### Development

1. **Start the development server:**
   ```bash
   npm start
   ```

2. **In another terminal, start the Express server:**
   ```bash
   npm run serve
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 🔄 App Flow

### 1. PDF Path Tracing
When a user clicks on a chapter, the app follows this path:

```
User clicks Chapter 1 → 
/api/chapters/english → 
Returns: /books/class1_english[1]/aemr101.pdf → 
/api/extract-text → 
Calls: python pdf_script.py "/books/class1_english[1]/aemr101.pdf"
```

### 2. Script Generation Path
After text extraction:

```
Extracted text → 
Ollama/Gemma API → 
Generates educational script → 
Saves to: scripts/lesson_script.txt
```

### 3. Video Generation Path
Script to video conversion:

```
scripts/lesson_script.txt → 
/api/generate-video → 
Calls: python complete_video_current.py "scripts/lesson_script.txt" "generated_videos/english_chapter1.mp4" → 
Creates video with TTS and visual content
```

### 4. Video Display Path
Generated video display:

```
generated_videos/english_chapter1.mp4 → 
/api/video/english_chapter1.mp4 → 
VideoPlayer component displays the video
```

## 📱 Offline Functionality

The app uses a service worker (`sw.js`) to provide offline capabilities:

- **Static Caching**: PDFs, HTML, CSS, JS files cached on first visit
- **Dynamic Caching**: API responses cached for offline access
- **Cache-First Strategy**: PDFs served from cache when offline
- **Network-First Strategy**: API calls try network first, fallback to cache

## 🎯 Usage

1. **Select Subject**: Choose from English, Hindi, or Mathematics
2. **Choose Chapter**: Click on any chapter to start video generation
3. **Wait for Processing**: The app will extract text, generate script, and create video
4. **Watch Video**: Generated video will be displayed with controls
5. **Download**: Videos can be downloaded for offline viewing

## 🔧 Configuration

### PDF Paths
Update the PDF paths in `pdf_script.py`:
```python
pdf_path = r"C:\Users\anita\OneDrive\Desktop\genrate\books\class1_english[1]\aemr101.pdf"
```

### Video Assets
Update background image and intro video paths in `complete_video_current.py`:
```python
BACKGROUND_IMG = r"C:\Users\anita\OneDrive\Desktop\genrate\WhatsApp Image 2025-08-05 at 12.05.43 PM.jpeg"
INTRO_VIDEO_PATH = r"C:\Users\anita\OneDrive\Desktop\genrate\WhatsApp Video 2025-08-05 at 12.05.53 PM.mp4"
```

## 🚀 Deployment

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm run serve
   ```

3. **Access the app:**
   - Open http://localhost:3000
   - Install as PWA for offline access

## 📋 API Endpoints

- `GET /api/chapters/:subject` - Get chapters for a subject
- `POST /api/extract-text` - Extract text from PDF
- `POST /api/generate-video` - Generate video from script
- `GET /api/video/:filename` - Serve generated video
- `GET /api/health` - Health check

## 🔍 Troubleshooting

### Common Issues

1. **FFmpeg not found**: Install FFmpeg and add to PATH
2. **Ollama connection error**: Ensure Ollama is running and Gemma model is installed
3. **PDF extraction fails**: Check PDF file paths and permissions
4. **Service worker not registering**: Check browser console for errors

### Debug Mode

Enable debug logging in the service worker by uncommenting console.log statements in `public/sw.js`.

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note**: This app requires the Python scripts (`pdf_script.py` and `complete_video_current.py`) to be properly configured with the correct file paths for your system. 