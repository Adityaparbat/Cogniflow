import os
import sys
import subprocess
import re
from PIL import Image, ImageDraw, ImageFont
import pyttsx3

# --- Configuration ---
AI_CLIPS_DIR = "ai_clips"
SLIDES_DIR = "static_slides"
AUDIO_DIR = "narration_audio"
ASSEMBLY_LIST = "concat_list.txt"

# Use fallback background if the specified one doesn't exist
BACKGROUND_IMG = r"C:\Users\anita\OneDrive\Desktop\genrate\WhatsApp Image 2025-08-05 at 12.05.43 PM.jpeg"
INTRO_VIDEO_PATH = r"C:\Users\anita\OneDrive\Desktop\genrate\WhatsApp Video 2025-08-05 at 12.05.53 PM.mp4"
INTRO_NARRATION = "Welcome to your lesson! Let's begin the adventure."
# --- 1. Parse script into blocks ---
def parse_script_to_blocks(script_path):
    with open(script_path, encoding='utf-8') as f:
        content = f.read()
    # Split by Scene: pattern to match our enhanced script format
    blocks = re.split(r'\n\s*Scene:\s*', content)
    blocks = [blk.strip() for blk in blocks if blk.strip()]
    return blocks

# --- 1a. Extract each Pet utterance on its own slide ---
def extract_pet_lines(block):
    # Supports curly and straight quotes, and multi-line content
    pet_lines = re.findall(r'Pet:\s*["\"](.*?)[\"\"]', block, re.DOTALL)
    # Clean up the extracted text
    cleaned_lines = []
    for line in pet_lines:
        # Remove extra whitespace and newlines
        cleaned = re.sub(r'\s+', ' ', line.strip())
        if cleaned:
            cleaned_lines.append(cleaned)
    return cleaned_lines

# --- 2. Generate slide with TTS narration ---
def generate_slide_video(text, img_path, audio_path, out_path, duration=15):
    # Load the background image and resize it to consistent dimensions
    try:
        # Try to use the specified background image
        if os.path.exists(BACKGROUND_IMG):
            background = Image.open(BACKGROUND_IMG).convert("RGB")
        else:
            # Create a simple gradient background
            background = Image.new("RGB", (800, 600), color="lightblue")
            draw = ImageDraw.Draw(background)
            # Create a simple gradient effect
            for y in range(600):
                color = int(255 * (1 - y / 600))
                draw.line([(0, y), (800, y)], fill=(color, color, 255))
        
        # Resize to 800x600 for consistency
        background = background.resize((800, 600), Image.Resampling.LANCZOS)
    except Exception as e:
        print(f"Background image error: {e}, using fallback")
        # Fallback to simple background if image loading fails
        background = Image.new("RGB", (800, 600), color="lightblue")
    
    img = background.copy()
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("arial.ttf", 32)
    except:
        font = ImageFont.load_default()
    
    # Word wrap text
    lines = []
    words = text.split()
    line = ""
    for word in words:
        test_line = line + word + " "
        if len(test_line) > 60:
            lines.append(line.strip())
            line = word + " "
        else:
            line = test_line
    if line:
        lines.append(line.strip())
    
    # Draw text
    y_offset = 50
    for line in lines[:10]:
        draw.text((40, y_offset), line, fill="black", font=font)
        y_offset += 50
    
    img.save(img_path)
    
    # Narration
    try:
        engine = pyttsx3.init()
        engine.setProperty('rate', 180)  # Faster speech rate
        engine.save_to_file(text, audio_path)
        engine.runAndWait()
    except Exception as e:
        print(f"TTS error: {e}, creating silent audio")
        # Create a silent audio file as fallback
        silent_cmd = [
            "ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
            "-t", str(duration), "-c:a", "aac", audio_path
        ]
        try:
            subprocess.run(silent_cmd, check=True)
        except:
            print("Failed to create silent audio")
    
    # Create video from image and audio
    cmd = [
        "ffmpeg", "-y", "-loop", "1", "-i", img_path, "-i", audio_path,
        "-c:v", "libx264", "-t", str(duration), "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-ar", "44100", "-ac", "1", "-shortest", out_path
    ]
    try:
        subprocess.run(cmd, check=True)
        print(f"Generated slide video: {out_path}")
        return True
    except FileNotFoundError:
        print("ERROR: FFmpeg not found! Please install FFmpeg and add to PATH.")
        print("Visit: https://ffmpeg.org/download.html")
        return False
    except subprocess.CalledProcessError as e:
        print(f"FFmpeg error: {e}")
        return False

# --- 3. Generate intro slide with TTS and same parameters as slides ---
def generate_intro_slide(narration_text, img_path, audio_path, out_path, duration=15):
    return generate_slide_video(narration_text, img_path, audio_path, out_path, duration)

# --- 4. Main orchestration ---
def main():
    # Check command line arguments
    if len(sys.argv) != 3:
        print("[ERROR] Usage: python complete_video_current.py <input_script_path> <output_video_path>")
        sys.exit(1)
    
    script_file = sys.argv[1]
    final_video = sys.argv[2]
    
    # Check if input script exists
    if not os.path.exists(script_file):
        print(f"[ERROR] Script file not found: {script_file}")
        sys.exit(1)
    
    # Create output directory if it doesn't exist
    os.makedirs(os.path.dirname(final_video), exist_ok=True)
    
    # Create working directories
    for d in [AI_CLIPS_DIR, SLIDES_DIR, AUDIO_DIR]:
        os.makedirs(d, exist_ok=True)

    print(f"[INFO] Processing script: {script_file}")
    blocks = parse_script_to_blocks(script_file)
    all_pet_lines = []
    for block in blocks:
        pet_lines = extract_pet_lines(block)
        all_pet_lines.extend(pet_lines)

    print(f"[INFO] Found {len(all_pet_lines)} Pet lines to process")

    # Generate intro slide (replace/modify narration as needed)
    intro_slide = os.path.join(SLIDES_DIR, "slide_intro.png")
    intro_audio = os.path.join(AUDIO_DIR, "narration_intro.wav")
    intro_vid = os.path.join(SLIDES_DIR, "slidevid_intro.mp4")
    
    print("[INFO] Generating intro slide...")
    generate_intro_slide(INTRO_NARRATION, intro_slide, intro_audio, intro_vid, duration=8)

    video_segments = [intro_vid]
    for i, pet_line in enumerate(all_pet_lines, 1):
        print(f"\n[Slide+TTS] Pet line {i}: {pet_line[:50]}...")
        slide_path = os.path.join(SLIDES_DIR, f"slide_{i:03d}.png")
        audio_path = os.path.join(AUDIO_DIR, f"narration_{i:03d}.wav")
        out_vid = os.path.join(SLIDES_DIR, f"slidevid_{i:03d}.mp4")
        if generate_slide_video(pet_line, slide_path, audio_path, out_vid, duration=30):
            video_segments.append(out_vid)
        else:
            print(f"[WARNING] Failed to generate video for line {i}")

    print(f"[INFO] Generated {len(video_segments)} video segments")
    
    if len(video_segments) <= 1:
        print("[WARNING] Only intro video generated. Check script content and FFmpeg installation.")
        # Still create the final video with just intro
        pass

    # Create concatenation list
    with open(ASSEMBLY_LIST, "w") as f:
        for path in video_segments:
            if os.path.exists(path):
                f.write(f"file '{os.path.abspath(path)}'\n")
            else:
                print(f"[WARNING] Video segment not found: {path}")

    # Improved concatenation with consistent parameters
    concat_cmd = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", ASSEMBLY_LIST, 
        "-c:v", "copy",  # Copy video stream without re-encoding
        "-c:a", "copy",  # Copy audio stream without re-encoding
        "-avoid_negative_ts", "make_zero",
        final_video
    ]
    try:
        subprocess.run(concat_cmd, check=True)
        print(f"\n[SUCCESS] Final video created: {final_video}")
        print(f"[INFO] Duration: ~{len(video_segments) * 30 // 60} minutes")
    except FileNotFoundError:
        print("ERROR: FFmpeg not found for final concatenation!")
    except subprocess.CalledProcessError as e:
        print(f"Concatenation error: {e}")

if __name__ == "__main__":
    main()