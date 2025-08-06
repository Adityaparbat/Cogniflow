# Gemma 3n Chatbot Setup Guide

This guide will help you set up the offline Gemma 3n chatbot for your learning dashboard.

## Prerequisites

1. **Python 3.7+** installed on your system
2. **Ollama** installed and running
3. **Gemma 3n model** downloaded in Ollama

## Step 1: Install Ollama

### Windows
1. Download Ollama from [https://ollama.ai/download](https://ollama.ai/download)
2. Run the installer
3. Start Ollama from the Start menu or run `ollama serve` in a terminal

### macOS
```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama serve
```

### Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama serve
```

## Step 2: Download Gemma 3n Model

Open a new terminal/command prompt and run:

```bash
ollama pull gemma3n:e4b
```

This will download the Gemma 3n model (about 2.5GB). The download may take a few minutes depending on your internet connection.

## Step 3: Verify Installation

Test that everything is working:

```bash
ollama run gemma3n:e4b "Hello, how are you?"
```

You should see a response from the model.

## Step 4: Start the Dashboard

1. Navigate to the dashboard directory:
   ```bash
   cd dashboard/dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and go to `http://localhost:3000`

## Step 5: Using the Chatbot

1. Click on the "AI Assistant" tab in the dashboard
2. Click "Start Chatting" to open the chatbot
3. Ask any educational questions!

## Troubleshooting

### "Connection refused" error
- Make sure Ollama is running: `ollama serve`
- Check that the model is downloaded: `ollama list`

### "Model not found" error
- Download the model: `ollama pull gemma3n:e4b`

### Python not found
- Install Python 3.7+ from [python.org](https://python.org)
- Make sure Python is in your PATH

### Slow responses
- The first response may be slow as the model loads
- Subsequent responses should be faster
- Consider using a more powerful computer for better performance

## Features

- **Completely offline**: No internet required after setup
- **Educational focus**: Optimized for homework help and learning
- **Chat history**: Export your conversations
- **Friendly interface**: Easy to use chat interface

## System Requirements

- **RAM**: At least 4GB (8GB recommended)
- **Storage**: 3GB free space for the model
- **CPU**: Any modern processor
- **GPU**: Optional, but will improve performance

## Security

- All processing happens locally on your computer
- No data is sent to external servers
- Chat logs are stored locally only

## Support

If you encounter issues:
1. Check that Ollama is running
2. Verify the model is downloaded
3. Restart the dashboard application
4. Check the browser console for error messages 