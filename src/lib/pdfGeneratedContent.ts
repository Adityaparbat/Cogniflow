import { QuizQuestion, Flashcard } from './quizData';

export interface GeneratedContent {
  subject: string;
  chapter: string;
  flashcards: Flashcard[];
  quizzes: QuizQuestion[];
  total_flashcards: number;
  total_quizzes: number;
}

export const mergeGeneratedContent = (generatedContent: GeneratedContent) => {
  // This function will be used to merge generated content with existing quiz data
  return {
    flashcards: generatedContent.flashcards,
    quizzes: generatedContent.quizzes,
    subject: generatedContent.subject,
    chapter: generatedContent.chapter
  };
};

// Import generated content from TypeScript files
export const getGeneratedContent = async (subject: string, chapter: string): Promise<GeneratedContent | null> => {
  try {
    // Try to dynamically import the generated TypeScript file
    const module = await import(`./scripts/${subject}_${chapter}_content.ts`);
    return {
      subject,
      chapter,
      flashcards: module.generatedFlashcards || [],
      quizzes: module.generatedQuizzes || [],
      total_flashcards: module.generatedFlashcards?.length || 0,
      total_quizzes: module.generatedQuizzes?.length || 0
    };
  } catch (error) {
    console.error('Error loading generated content:', error);
    return null;
  }
};

// Functions needed by components
export const hasPDFContent = async (subject: string, chapter: string): Promise<boolean> => {
  try {
    const module = await import(`./scripts/${subject}_${chapter}_content.ts`);
    return (module.generatedFlashcards?.length || 0) > 0 || (module.generatedQuizzes?.length || 0) > 0;
  } catch (error) {
    return false;
  }
};

export const getPDFFlashcards = async (subject: string, chapter: string): Promise<Flashcard[]> => {
  try {
    const module = await import(`./scripts/${subject}_${chapter}_content.ts`);
    return module.generatedFlashcards || [];
  } catch (error) {
    return [];
  }
};

export const getPDFQuizzes = async (subject: string, chapter: string): Promise<QuizQuestion[]> => {
  try {
    const module = await import(`./scripts/${subject}_${chapter}_content.ts`);
    return module.generatedQuizzes || [];
  } catch (error) {
    return [];
  }
}; 