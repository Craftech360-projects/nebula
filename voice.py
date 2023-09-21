import pyttsx3

engine = pyttsx3.init()

voices = engine.getProperty('voices')
for i, voice in enumerate(voices):
    print(f"Voice {i+1}: {voice.name} - ID: {voice.id}")
