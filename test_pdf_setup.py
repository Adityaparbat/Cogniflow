#!/usr/bin/env python3
"""
Test script to verify PDF processing setup
"""

import os
import sys
import json
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch

def create_test_pdf():
    """Create a test PDF with educational content"""
    test_content = """
    Chapter 1: Introduction to Mathematics
    
    Mathematics is the study of numbers, quantities, shapes, and patterns. It is a fundamental subject that helps us understand the world around us.
    
    Key Concepts:
    1. Numbers: Natural numbers, whole numbers, integers, fractions, and decimals
    2. Operations: Addition, subtraction, multiplication, and division
    3. Shapes: Basic geometric shapes like circles, squares, triangles, and rectangles
    4. Patterns: Sequences and relationships between numbers
    
    Learning Objectives:
    - Understand basic mathematical concepts
    - Learn to perform simple calculations
    - Recognize geometric shapes
    - Identify patterns in numbers
    
    Examples:
    - Addition: 5 + 3 = 8
    - Subtraction: 10 - 4 = 6
    - Multiplication: 6 × 7 = 42
    - Division: 20 ÷ 4 = 5
    
    Geometric Shapes:
    - Circle: A round shape with no corners
    - Square: A shape with four equal sides and four right angles
    - Triangle: A shape with three sides and three angles
    - Rectangle: A shape with four sides and four right angles
    
    This chapter provides the foundation for more advanced mathematical concepts.
    """
    
    # Create test PDF
    pdf_path = "test_mathematics_chapter1.pdf"
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter
    
    # Add content to PDF
    y_position = height - 50
    lines = test_content.split('\n')
    
    for line in lines:
        if line.strip():
            c.drawString(50, y_position, line.strip())
            y_position -= 20
        else:
            y_position -= 10
    
    c.save()
    print(f"✅ Test PDF created: {pdf_path}")
    return pdf_path

def test_pdf_processing():
    """Test the PDF processing functionality"""
    try:
        # Import the PDF processor
        sys.path.append('src/lib')
        from pdfProcessor import process_pdf_for_subject_chapter, extract_text_from_pdf
        
        # Create test PDF
        pdf_path = create_test_pdf()
        
        # Test text extraction
        print("🔄 Testing text extraction...")
        extracted_text = extract_text_from_pdf(pdf_path)
        if extracted_text and len(extracted_text) > 100:
            print("✅ Text extraction successful")
        else:
            print("❌ Text extraction failed")
            return False
        
        # Test content generation (this will require Ollama to be running)
        print("🔄 Testing content generation...")
        try:
            result = process_pdf_for_subject_chapter("Mathematics", "Chapter 1")
            if result and result.get('flashcards') and result.get('quizzes'):
                print("✅ Content generation successful")
                print(f"📊 Generated {len(result['flashcards'])} flashcards and {len(result['quizzes'])} quizzes")
                
                # Save test result
                with open('test_result.json', 'w') as f:
                    json.dump(result, f, indent=2)
                print("✅ Test result saved to test_result.json")
                return True
            else:
                print("❌ Content generation failed - no content generated")
                return False
        except Exception as e:
            print(f"❌ Content generation failed: {e}")
            print("💡 Make sure Ollama is running and gemma3n model is available")
            return False
            
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("💡 Make sure all dependencies are installed")
        return False
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

def check_dependencies():
    """Check if all required dependencies are installed"""
    print("🔍 Checking dependencies...")
    
    required_packages = [
        'fitz',  # PyMuPDF
        'pdfplumber',
        'ollama',
        'reportlab'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            if package == 'fitz':
                import fitz
            elif package == 'pdfplumber':
                import pdfplumber
            elif package == 'ollama':
                import ollama
            elif package == 'reportlab':
                import reportlab
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package} - not installed")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n💡 Install missing packages: pip install {' '.join(missing_packages)}")
        return False
    
    print("✅ All dependencies are installed")
    return True

def check_ollama():
    """Check if Ollama is running and gemma3n is available"""
    print("🔍 Checking Ollama...")
    
    try:
        import ollama
        models = ollama.list()
        gemma3n_available = any('gemma3n' in model['name'] for model in models['models'])
        
        if gemma3n_available:
            print("✅ Gemma3n model is available")
            return True
        else:
            print("❌ Gemma3n model not found")
            print("💡 Run: ollama pull gemma3n")
            return False
    except Exception as e:
        print(f"❌ Ollama check failed: {e}")
        print("💡 Make sure Ollama is running: ollama serve")
        return False

def main():
    """Main test function"""
    print("🧪 PDF Processing System Test")
    print("=" * 40)
    
    # Check dependencies
    if not check_dependencies():
        print("\n❌ Dependencies check failed")
        return
    
    # Check Ollama
    if not check_ollama():
        print("\n❌ Ollama check failed")
        return
    
    # Test PDF processing
    print("\n🔄 Running PDF processing test...")
    if test_pdf_processing():
        print("\n🎉 All tests passed! The PDF processing system is working correctly.")
    else:
        print("\n❌ PDF processing test failed")
    
    # Cleanup
    if os.path.exists("test_mathematics_chapter1.pdf"):
        os.remove("test_mathematics_chapter1.pdf")
        print("🧹 Cleaned up test files")

if __name__ == "__main__":
    main() 