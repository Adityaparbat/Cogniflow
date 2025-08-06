'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  BookOpen, 
  Lightbulb, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  FolderOpen,
  Search,
  Plus,
  Trash2,
  Download,
  Eye,
  Play,
  Star,
  ArrowRight
} from 'lucide-react';

interface PDFGeneratedContent {
  subject: string;
  chapter: string;
  total_quizzes: number;
  total_flashcards: number;
  file_path: string;
  userChoice?: 'quiz' | 'flashcards';
}

interface PDFBrowserProps {
  onClose: () => void;
  onContentGenerated?: (content: PDFGeneratedContent) => void;
}

export default function PDFBrowser({ onClose, onContentGenerated }: PDFBrowserProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<string>('');
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [availableChapters, setAvailableChapters] = useState<string[]>([]);
  const [contentStats, setContentStats] = useState<any>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadSubject, setUploadSubject] = useState('');
  const [uploadChapter, setUploadChapter] = useState('');
  const [availableContent, setAvailableContent] = useState<PDFGeneratedContent[]>([]);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<PDFGeneratedContent | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAvailableContent();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      const loadChapters = async () => {
        try {
          const response = await fetch(`/api/pdf-process?action=chapters&subject=${encodeURIComponent(selectedSubject)}`);
          const data = await response.json();
          setAvailableChapters(data.chapters || []);
          setSelectedChapter('');
        } catch (error) {
          console.error('Error loading chapters:', error);
          setAvailableChapters([]);
        }
      };
      loadChapters();
    }
  }, [selectedSubject]);

  const loadAvailableContent = async () => {
    try {
      // Get available subjects from API
      const subjectsResponse = await fetch('/api/pdf-process?action=subjects');
      const subjectsData = await subjectsResponse.json();
      setAvailableSubjects(subjectsData.subjects || []);

      // Get content statistics
      const allContent: PDFGeneratedContent[] = [];
      for (const subject of subjectsData.subjects || []) {
        const contentResponse = await fetch(`/api/pdf-process?action=content&subject=${encodeURIComponent(subject)}`);
        const contentData = await contentResponse.json();
        allContent.push(...(contentData.content || []));
      }

      setAvailableContent(allContent);

      const stats = {
        total_subjects: subjectsData.subjects?.length || 0,
        total_chapters: allContent.length,
        total_flashcards: allContent.reduce((sum, c) => sum + (c.total_flashcards || 0), 0),
        total_quizzes: allContent.reduce((sum, c) => sum + (c.total_quizzes || 0), 0),
        subjects: subjectsData.subjects || [],
        recent_content: allContent.slice(0, 5)
      };
      setContentStats(stats);
    } catch (error) {
      console.error('Error loading available content:', error);
      setAvailableSubjects([]);
      setAvailableContent([]);
    }
  };

  const handleGenerateContent = async () => {
    if (!selectedSubject || !selectedChapter) {
      alert('Please select both subject and chapter');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress('Initializing PDF processing...');

    try {
      // Check if content already exists
      const existingContent = availableContent.find(c => c.subject === selectedSubject && c.chapter === selectedChapter);
      
      if (existingContent) {
        const overwrite = confirm('Content already exists for this subject/chapter. Do you want to regenerate?');
        if (!overwrite) {
          setIsGenerating(false);
          setGenerationProgress('');
          return;
        }
      }

      setGenerationProgress('Processing PDF with Gemma3n...');
      
      // Call the API to process the PDF (without file upload)
      const formData = new FormData();
      formData.append('subject', selectedSubject);
      formData.append('chapter', selectedChapter);
      formData.append('action', 'generate'); // Indicate this is for existing PDF
      
      const response = await fetch('/api/pdf-process', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        const newContent = {
          subject: selectedSubject,
          chapter: selectedChapter,
          total_quizzes: result.total_quizzes || 0,
          total_flashcards: result.total_flashcards || 0,
          file_path: `${selectedSubject}_${selectedChapter}_content.ts`
        };

        setGenerationProgress('Content generated successfully!');
        
        // Add to available content
        setAvailableContent(prev => {
          const filtered = prev.filter(c => !(c.subject === selectedSubject && c.chapter === selectedChapter));
          return [...filtered, newContent];
        });

        if (onContentGenerated) {
          onContentGenerated(newContent);
        }

        setTimeout(() => {
          setIsGenerating(false);
          setGenerationProgress('');
        }, 1000);
      } else {
        throw new Error(result.error || 'Failed to generate content');
      }

    } catch (error) {
      console.error('Error generating content:', error);
      setGenerationProgress('Error generating content. Please try again.');
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress('');
      }, 3000);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile || !uploadSubject || !uploadChapter) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setShowUploadModal(false);
      
      // Show processing modal
      setIsGenerating(true);
      setGenerationProgress('Uploading PDF...');

      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('subject', uploadSubject);
      formData.append('chapter', uploadChapter);

      const response = await fetch('/api/pdf-process', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload and process PDF');
      }

      const result = await response.json();
      
      if (result.success) {
        setGenerationProgress('PDF processed successfully!');
        
        // Reload content to show updated results
        await loadAvailableContent();

        // Automatically select the processed content for generation
        setSelectedSubject(uploadSubject);
        setSelectedChapter(uploadChapter);

        if (onContentGenerated && result.content) {
          onContentGenerated(result.content);
        }

        // Reset form
        setUploadedFile(null);
        setUploadSubject('');
        setUploadChapter('');
        
        // Clear upload progress and show success
        setTimeout(() => {
          setIsGenerating(false);
          setGenerationProgress('');
        }, 1500);
      } else {
        throw new Error(result.error || 'Failed to process PDF');
      }

    } catch (error) {
      console.error('Error uploading PDF:', error);
      setGenerationProgress('Error uploading PDF. Please try again.');
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress('');
      }, 3000);
    }
  };

  const handleUseContent = (content: PDFGeneratedContent) => {
    setSelectedContent(content);
    setShowChoiceModal(true);
  };

  const handleChoice = (choice: 'quiz' | 'flashcards') => {
    if (selectedContent && onContentGenerated) {
      const contentWithChoice = {
        ...selectedContent,
        userChoice: choice
      };
      onContentGenerated(contentWithChoice);
    }
    setShowChoiceModal(false);
    setSelectedContent(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">PDF Content Browser</h2>
                <p className="text-blue-100">Browse and generate quizzes from your PDFs</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Content Statistics */}
          {contentStats && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Content Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{contentStats.total_subjects}</div>
                  <div className="text-sm text-blue-700">Subjects</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{contentStats.total_chapters}</div>
                  <div className="text-sm text-green-700">Chapters</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{contentStats.total_flashcards}</div>
                  <div className="text-sm text-purple-700">Flashcards</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{contentStats.total_quizzes}</div>
                  <div className="text-sm text-orange-700">Quizzes</div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Upload New PDF</h3>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Upload PDF</span>
              </button>
            </div>
          </div>

          {/* Subject and Chapter Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Generate Content</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Subject</option>
                  {availableSubjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chapter</label>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!selectedSubject}
                >
                  <option value="">Select Chapter</option>
                  {availableChapters.map((chapter) => (
                    <option key={chapter} value={chapter}>{chapter}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateContent}
              disabled={!selectedSubject || !selectedChapter || isGenerating}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Lightbulb className="w-5 h-5" />
                  <span>Generate Quizzes & Flashcards</span>
                </>
              )}
            </button>

            {generationProgress && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm text-blue-700">{generationProgress}</span>
                </div>
              </div>
            )}
          </div>

          {/* Available Content */}
          {availableContent.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Content</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableContent.map((content, index) => (
                  <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">{content.subject}</h4>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">PDF Generated</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Chapter: {content.chapter}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center space-x-1">
                          <FileText className="w-4 h-4 text-green-600" />
                          <span className="text-green-700">{content.total_flashcards} flashcards</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Play className="w-4 h-4 text-purple-600" />
                          <span className="text-purple-700">{content.total_quizzes} quizzes</span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleUseContent(content)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Use This Content</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {availableContent.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No PDF Content Available</h3>
              <p className="text-gray-600 mb-4">Upload a PDF and generate quizzes and flashcards to get started!</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Upload Your First PDF
              </button>
            </div>
          )}
        </div>

        {/* Choice Modal */}
        {showChoiceModal && selectedContent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Choose Learning Mode</h3>
                <p className="text-gray-600">
                  {selectedContent.subject} - {selectedContent.chapter}
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => handleChoice('quiz')}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <Play className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-semibold">Quiz Mode</div>
                      <div className="text-sm opacity-90">{selectedContent.total_quizzes} questions</div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => handleChoice('flashcards')}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-semibold">Flashcard Mode</div>
                      <div className="text-sm opacity-90">{selectedContent.total_flashcards} cards</div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              
              <button
                onClick={() => setShowChoiceModal(false)}
                className="w-full mt-4 p-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Upload PDF</h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PDF File</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      value={uploadSubject}
                      onChange={(e) => setUploadSubject(e.target.value)}
                      placeholder="e.g., Mathematics"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chapter</label>
                    <input
                      type="text"
                      value={uploadChapter}
                      onChange={(e) => setUploadChapter(e.target.value)}
                      placeholder="e.g., Chapter 1: Introduction"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 