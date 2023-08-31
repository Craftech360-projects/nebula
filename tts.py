# myscript.py

import pyttsx3
import sys

def generate_speech(message):
 message = message.strip()

 engine = pyttsx3.init()

 desired_voice_id = 'HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Speech\Voices\Tokens\TTS_MS_EN-US_ZIRA_11.0'
 engine.setProperty('voice', desired_voice_id)

 rate = engine.getProperty('rate')
 engine.setProperty('rate', rate - 50) 

 engine.say(message)
 engine.runAndWait()

if __name__ == '__main__':
 if len(sys.argv) != 2:
  print("Usage: python myscript.py 'Your message goes here'")
 else:
  message = sys.argv[1]
  generate_speech(message)