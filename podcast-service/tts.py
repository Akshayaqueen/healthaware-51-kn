#!/usr/bin/env python3
"""
Text-to-Speech conversion for AI-generated podcast scripts
Converts output_script.txt to daily_podcast.mp3 using gTTS
"""

import os
import sys
from pathlib import Path
from gtts import gTTS
import tempfile
import shutil

def convert_script_to_audio():
    """Convert the generated script to audio using gTTS"""
    
    # File paths
    script_dir = Path(__file__).parent
    script_file = script_dir / 'output_script.txt'
    output_dir = script_dir.parent / 'public' / 'audio'
    output_file = output_dir / 'daily_podcast.mp3'
    
    print("🎵 Starting text-to-speech conversion...")
    
    # Check if script file exists
    if not script_file.exists():
        print(f"❌ Script file not found: {script_file}")
        print("💡 Run 'node podcast-service/generate_script.js' first")
        sys.exit(1)
    
    # Read the script
    try:
        with open(script_file, 'r', encoding='utf-8') as f:
            script_text = f.read().strip()
        
        if not script_text:
            print("❌ Script file is empty")
            sys.exit(1)
            
        print(f"📝 Script loaded: {len(script_text)} characters")
        
    except Exception as e:
        print(f"❌ Error reading script file: {e}")
        sys.exit(1)
    
    # Create output directory if it doesn't exist
    output_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        # Create gTTS object
        print("🗣️  Converting text to speech...")
        tts = gTTS(
            text=script_text,
            lang='en',
            slow=False,
            tld='com'  # Use .com for more natural voice
        )
        
        # Save to temporary file first
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_file:
            temp_path = temp_file.name
            
        print("💾 Generating audio file...")
        tts.save(temp_path)
        
        # Move to final location
        shutil.move(temp_path, output_file)
        
        print("✅ Audio conversion completed!")
        print(f"🎧 Saved to: {output_file}")
        print(f"📁 File size: {output_file.stat().st_size / 1024:.1f} KB")
        
        # Cleanup script file (optional)
        # script_file.unlink()  # Uncomment to delete script after conversion
        
        return str(output_file)
        
    except Exception as e:
        print(f"❌ Error during TTS conversion: {e}")
        print("💡 Make sure you have internet connection for gTTS")
        
        # Cleanup temp file if it exists
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.unlink(temp_path)
        
        sys.exit(1)

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import gtts
        print("✅ gTTS library found")
        return True
    except ImportError:
        print("❌ gTTS library not found")
        print("💡 Install with: pip install gtts")
        return False

def main():
    """Main execution function"""
    print("🎙️  HealthAware Podcast TTS Converter")
    print("=" * 40)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Convert script to audio
    try:
        audio_file = convert_script_to_audio()
        print("\n🎉 Podcast generation completed!")
        print(f"🎵 Your podcast is ready: {Path(audio_file).name}")
        print("🌐 Refresh your web app to listen to the new episode")
        
    except KeyboardInterrupt:
        print("\n⏹️  Conversion cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
