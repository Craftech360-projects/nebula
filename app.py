from flask import Flask, request, jsonify
import pyttsx3

app = Flask(__name__)

@app.route('/generate_speech', methods=['POST'])
def generate_speech():
    data = request.get_json()
    message = data.get('message', '')

    # Initialize the speech engine
    engine = pyttsx3.init()

    # Specify the ID of the selected female voice
    desired_voice_id = 'HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Speech\\Voices\\Tokens\\TTS_MS_EN-US_ZIRA_11.0'
    
    engine.setProperty('voice', desired_voice_id)

    # Generate speech from the received message
    engine.say(message)
    engine.runAndWait()

    # Return a response indicating successful speech generation
    response = {'speech_result': 'Speech generated successfully'}
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
