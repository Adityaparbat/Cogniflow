import requests
import re
import datetime
import random

# === CONFIGURATION ===
MODEL_NAME = "gemma3n:e4b"
OLLAMA_URL = "http://localhost:11434/api/generate"

# === Friendly small-talk keywords ===
GREETINGS = [
    "hi", "hello", "hey", "good morning", "good afternoon", "good evening",
    "how are you", "how's it going", "what's up", "yo"
]

SMALL_TALK_RESPONSES = [
    "Hello! How can I help you with your studies today?",
    "Hi there! I'm ready to help you learn.",
    "Hey! Ask me anything related to your subjects or homework.",
    "I'm doing great! Ready to assist you with any educational or GK questions.",
    "Nice to see you! What topic are you curious about today?"
]

# === Educational keywords for detection (not strictly used now, but kept for future)
EDU_KEYWORDS = [
    "math", "science", "history", "geography", "physics", "chemistry", "biology",
    "algebra", "geometry", "calculus", "literature", "grammar", "education", "school",
    "university", "college", "exam", "test", "homework", "assignment", "project",
    "study", "learn", "teacher", "student", "class", "course", "syllabus", "curriculum",
    "capital", "formula", "law", "theorem", "explain", "define", "who", "what", "when", "where", "how",
    "india", "gandhi", "nehru", "shivaji", "independence", "partition", "french revolution",
    "world war", "democracy", "climate change", "global warming", "solar system", "human body",
    "water cycle", "photosynthesis", "panda", "virat", "kohli", "cleanest city", "largest city"
]

# === Helper: Check if user said greeting
def is_greeting(query):
    query_lower = query.lower()
    return any(greet in query_lower for greet in GREETINGS)

# === Send prompt to Ollama (Gemma 3n)
def generate_response(prompt):
    data = {
        "model": MODEL_NAME,
        "prompt": f"You are a helpful and friendly AI tutor for students. Answer this clearly:\n\n{prompt}",
        "stream": False
    }
    response = requests.post(OLLAMA_URL, json=data)
    response.raise_for_status()
    return response.json()["response"]

# === Log Q&A to file
def log_interaction(question, answer):
    with open("chat_log.txt", "a", encoding="utf-8") as f:
        f.write(f"\n[{datetime.datetime.now()}]\nUser: {question}\nBot: {answer}\n")

# === Main chat loop
def main():
    print("\nWelcome to the Offline Educational & GK Chatbot (Gemma3n via Ollama)")
    print("Ask me anything related to studies or general knowledge.")
    print("Type 'exit' or 'quit' to leave.")

    while True:
        user_input = input("\nYou: ").strip()
        if user_input.lower() in ["exit", "quit"]:
            print("Goodbye! Stay curious.")
            break

        try:
            if is_greeting(user_input):
                response = random.choice(SMALL_TALK_RESPONSES)
            else:
                print("🤔 Thinking...")
                response = generate_response(user_input)

                if not response.strip():
                    response = "Hmm, I couldn't find a clear answer. Can you rephrase or ask another question?"

            print(f"Bot: {response}")
            log_interaction(user_input, response)

        except Exception as e:
            print(f"Bot: Oops! Something went wrong: {e}")

if __name__ == "__main__":
    main()
