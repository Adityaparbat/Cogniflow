import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Create a temporary Python script that can be called with arguments
    const tempScript = `
import sys
import requests
import datetime
import random
import os

# Set UTF-8 encoding for stdout
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

MODEL_NAME = "gemma3n:e4b"
OLLAMA_URL = "http://localhost:11434/api/generate"

def generate_response(prompt):
    try:
        data = {
            "model": MODEL_NAME,
            "prompt": f"You are a helpful and knowledgeable AI assistant. Answer the following question clearly and concisely:\\n\\n{prompt}",
            "stream": False
        }
        response = requests.post(OLLAMA_URL, json=data, timeout=60)
        response.raise_for_status()
        return response.json()["response"]
    except requests.exceptions.RequestException as e:
        return f"Sorry, I'm having trouble connecting to my brain right now. Please make sure Ollama is running with the Gemma 3n model. Error: {str(e)}"
    except Exception as e:
        return f"An error occurred: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) > 1:
        user_input = sys.argv[1]
        try:
            response = generate_response(user_input)
            if not response.strip():
                response = "Hmm, I couldn't find a clear answer. Can you rephrase or ask another question?"
            print(response)
        except Exception as e:
            print(f"Error: {str(e)}")
    else:
        print("No input provided")
`;

    // Write the temporary script to a file
    const fs = await import('fs');
    const tempScriptPath = path.join(process.cwd(), 'temp_gemma_script.py');
    fs.default.writeFileSync(tempScriptPath, tempScript);

    // Execute the Python script
    return new Promise<NextResponse>((resolve) => {
      const pythonProcess = spawn('python', [tempScriptPath, message], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
      });
      
      let output = '';
      let errorOutput = '';
      
      pythonProcess.stdout.on('data', (data) => {
        output += data.toString('utf-8');
      });
      
      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString('utf-8');
      });
      
      pythonProcess.on('close', (code) => {
        // Clean up the temporary file
        try {
          fs.default.unlinkSync(tempScriptPath);
        } catch (e) {
          console.error('Failed to delete temporary script:', e);
        }
        
        if (code === 0 && output.trim()) {
          resolve(NextResponse.json({ 
            response: output.trim(),
            success: true 
          }));
        } else {
          console.error('Python script error:', errorOutput || 'No output');
          resolve(NextResponse.json({ 
            response: "Sorry, I'm having trouble processing your request. Please make sure Ollama is running with the Gemma 3n model.",
            success: false,
            error: errorOutput || 'No output'
          }));
        }
      });
      
      pythonProcess.on('error', (error) => {
        // Clean up the temporary file
        try {
          fs.default.unlinkSync(tempScriptPath);
        } catch (e) {
          console.error('Failed to delete temporary script:', e);
        }
        
        console.error('Failed to start Python process:', error);
        resolve(NextResponse.json({ 
          response: "Sorry, I'm having trouble starting my brain. Please make sure Python is installed and Ollama is running.",
          success: false,
          error: error.message
        }));
      });
      
      // Set a timeout
      setTimeout(() => {
        pythonProcess.kill();
        resolve(NextResponse.json({ 
          response: "Sorry, I'm taking too long to respond. Please try again.",
          success: false,
          error: 'Timeout'
        }));
      }, 60000); // 60 second timeout
    });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { 
        response: "Sorry, something went wrong on my end. Please try again.",
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 