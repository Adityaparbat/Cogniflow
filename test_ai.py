import os
import sys
import locale

# Set UTF-8 encoding for Windows compatibility
if sys.platform.startswith('win'):
    os.environ['PYTHONIOENCODING'] = 'utf-8'
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

from ollama import chat
import json

def test_ai_generation():
    """Test AI model with a simple prompt"""
    test_content = "Photosynthesis is the process by which plants make their own food using sunlight, water, and carbon dioxide. Plants have green leaves that contain chlorophyll, which helps them capture sunlight."
    
    prompt = """
You are an expert children's educator. Create educational content from this text.

IMPORTANT: Respond with ONLY valid JSON, no other text.

Create:
1. 2 Flashcards with fields: "front", "back", "subject", "category", "difficulty"
2. 2 Quiz questions with fields: "question", "options", "answer", "hint", "subject", "difficulty", "points"

RESPOND WITH ONLY THIS JSON:
{
  "flashcards": [
    {
      "front": "What is photosynthesis?",
      "back": "The process by which plants make their own food using sunlight, water, and carbon dioxide.",
      "subject": "Science",
      "category": "Biology",
      "difficulty": "medium"
    }
  ],
  "quizzes": [
    {
      "question": "Which part of the plant performs photosynthesis?",
      "options": ["Root", "Leaf", "Stem", "Flower"],
      "answer": 1,
      "hint": "It's usually green and flat.",
      "subject": "Science",
      "difficulty": "easy",
      "points": 10
    }
  ]
}

Text: """ + test_content + """

Respond with ONLY the JSON object.
"""
    
    try:
        print("[INFO] Testing AI model...")
        response = chat(model="gemma3n", messages=[
            {"role": "user", "content": prompt}
        ])
        result = response['message']['content']
        print(f"[INFO] AI Response: {result[:200]}...")
        
        # Try to parse JSON
        try:
            data = json.loads(result)
            print(f"[SUCCESS] JSON parsed successfully!")
            print(f"[INFO] Flashcards: {len(data.get('flashcards', []))}")
            print(f"[INFO] Quizzes: {len(data.get('quizzes', []))}")
            return True
        except json.JSONDecodeError as e:
            print(f"[ERROR] JSON parsing failed: {e}")
            print(f"[DEBUG] Full response: {result}")
            return False
            
    except Exception as e:
        print(f"[ERROR] AI test failed: {e}")
        return False

if __name__ == "__main__":
    test_ai_generation() 