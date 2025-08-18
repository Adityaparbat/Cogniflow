# 📚 CogniFlow - Interactive Learning Dashboard

A modern, AI-powered educational dashboard that transforms PDF content into interactive quizzes and flashcards. Built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

### 🎯 Core Learning Tools
- **Interactive Quizzes**: AI-generated questions from PDF content
- **Smart Flashcards**: Auto-generated flashcards with flip animations
- **PDF Content Processing**: Upload PDFs and generate learning materials
- **Progress Tracking**: Monitor your learning progress and achievements
- **Study Analytics**: Detailed insights into your study patterns

### 🎮 Educational Games
- **Math Puzzles**: Interactive mathematical challenges
- **Pictionary**: Visual learning through drawing
- **Hangman**: Word-based learning games
- **Spelling Bee**: Improve spelling and vocabulary
- **Word Scramble**: Enhance word recognition
- **Memory Match**: Concentration and matching games
- **Word Association**: Build vocabulary connections

### 📊 Dashboard Features
- **Real-time Progress**: Visual progress bars and statistics
- **Achievement System**: Earn XP, coins, and badges
- **Streak Tracking**: Daily study streak monitoring
- **Study Timer**: Pomodoro-style study sessions
- **Learning Goals**: Set and track educational objectives
- **Activity Feed**: Recent learning activities and achievements

### 🤖 AI Integration
- **Gemma3n AI Model**: Powered by Ollama for content generation
- **PDF Processing**: Extract and structure content from PDFs
- **Smart Content Generation**: Create quizzes and flashcards automatically
- **Natural Language Processing**: Understand and process educational content

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **Ollama** (for AI model)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dashboard
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Install and setup Ollama**
   ```bash
   # Download Ollama from https://ollama.ai
   # Install the Gemma3n model
   ollama pull gemma3n
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```
7. **To open video generator**
   ```bash
   cd genrate
   npm install
   npm start
   ```
8. **Open your browser**
   ```
   https://localhost:3003
   ```
   
## 📋 Available Commands

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

### Python Scripts
```bash
# Test PDF integration
python test_pdf_integration.py

# Test AI model
python test_ai.py

# Test PDF components
python test_pdf_components.py

# Test PDF setup
python test_pdf_setup.py
```

### Ollama Commands
```bash
# Start Ollama server
ollama serve

# Pull AI model
ollama pull gemma3n

# List available models
ollama list

# Run model directly
ollama run gemma3n
```

## 🏗️ Project Structure

```
dashboard/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── login/            # Authentication pages
│   │   └── signup/           # Registration pages
│   ├── components/           # React components
│   │   ├── games/           # Educational games
│   │   ├── learning/        # Learning tools
│   │   └── ui/              # UI components
│   └── lib/                 # Utility libraries
│       ├── scripts/         # Generated content
│       └── books/           # PDF storage
├── public/                  # Static assets
├── requirements.txt         # Python dependencies
└── package.json            # Node.js dependencies
```

## 📖 Usage Guide

### 1. Getting Started
1. Open the dashboard at `http://localhost:3000`
2. Create an account or log in
3. Explore the different learning tools

### 2. PDF Content Processing
1. **Upload PDF**: Go to PDF Browser → Upload PDF
2. **Select Subject & Chapter**: Choose appropriate categories
3. **Generate Content**: AI will create quizzes and flashcards
4. **Start Learning**: Choose between quiz or flashcard mode

### 3. Learning Tools
- **Quizzes**: Multiple choice questions with instant feedback
- **Flashcards**: Interactive cards with flip animations
- **Games**: Educational games for different subjects
- **Study Timer**: Timed study sessions with breaks

### 4. Progress Tracking
- **Dashboard Overview**: View your learning statistics
- **Achievements**: Track XP, coins, and badges
- **Streaks**: Monitor daily study consistency
- **Analytics**: Detailed learning insights

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
# Next.js configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI Model configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=gemma3n

# Database configuration (if using)
DATABASE_URL=your_database_url
```

### Tailwind CSS Configuration
The project uses Tailwind CSS v4 with custom configurations:
- Custom color schemes
- Responsive design utilities
- Animation classes
- Custom components

## 🎯 Learning Features

### Quiz System
- **Multiple Choice Questions**: AI-generated from PDF content
- **Instant Feedback**: Immediate scoring and explanations
- **Progress Tracking**: Save scores and track improvement
- **Difficulty Levels**: Easy, medium, and hard questions

### Flashcard System
- **Interactive Cards**: Click to flip between question and answer
- **Progress Tracking**: Mark cards as known/unknown
- **Shuffle Mode**: Randomize card order
- **Study Statistics**: Track learning progress

### Game System
- **Multiple Games**: 7 different educational games
- **Subject Integration**: Games adapt to selected subjects
- **Scoring System**: Earn points and track high scores
- **Difficulty Progression**: Games get harder as you improve

## 🤖 AI Integration

### PDF Processing Pipeline
1. **Upload**: PDF file uploaded to server
2. **Extraction**: Python scripts extract text content
3. **Processing**: AI model analyzes and structures content
4. **Generation**: Creates quizzes and flashcards
5. **Storage**: Saves as TypeScript files for frontend use

### AI Model (Gemma3n)
- **Content Analysis**: Understands educational content
- **Question Generation**: Creates relevant quiz questions
- **Flashcard Creation**: Generates question-answer pairs
- **Natural Language**: Processes complex educational text

## 📱 Responsive Design

The dashboard is fully responsive and works on:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized touch interface
- **Mobile**: Streamlined mobile experience

## 🛠️ Development

### Adding New Features
1. **Components**: Add to `src/components/`
2. **Pages**: Add to `src/app/`
3. **API Routes**: Add to `src/app/api/`
4. **Styles**: Use Tailwind CSS classes

### Testing
```bash
# Run all tests
npm test

# Test specific components
npm run test:components

# Test API endpoints
npm run test:api
```

## 🚀 Deployment

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add OLLAMA_HOST
vercel env add OLLAMA_MODEL
```

### Docker Deployment
```dockerfile
# Build image
docker build -t cogniflow .

# Run container
docker run -p 3000:3000 cogniflow
```

## 📊 Performance

### Optimization Features
- **Next.js 15**: Latest framework with optimizations
- **Image Optimization**: Automatic image compression
- **Code Splitting**: Lazy loading of components
- **Caching**: Intelligent caching strategies
- **Bundle Analysis**: Optimized JavaScript bundles

### Monitoring
- **Performance Metrics**: Core Web Vitals tracking
- **Error Monitoring**: Automatic error reporting
- **Analytics**: User behavior tracking
- **Health Checks**: System status monitoring

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature-name`
3. **Make changes**: Follow coding standards
4. **Test thoroughly**: Ensure all features work
5. **Submit pull request**: Detailed description of changes

### Coding Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Conventional Commits**: Standard commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues
1. **Ollama not running**: Start with `ollama serve`
2. **PDF processing fails**: Check Python dependencies
3. **Build errors**: Clear cache with `npm run clean`
4. **Port conflicts**: Change port in `package.json`

### Getting Help
- **Documentation**: Check this README
- **Issues**: Create GitHub issue
- **Discussions**: Use GitHub discussions
- **Email**: Contact maintainers

## 🎉 Acknowledgments

- **Next.js Team**: Amazing React framework
- **Tailwind CSS**: Beautiful utility-first CSS
- **Ollama Team**: Local AI model hosting
- **Gemma Team**: Open-source AI models
- **Community**: All contributors and users

---

**Made with ❤️ for better education**
