var recognition;
let isRecording = false;
var transcript
var buttonId
var audio
var startTime;
const socket = io();

var audio = document.getElementById("myAudio");
socket.on('play', (e) => {
  // document.getElementById("voiceData").value = '';
  audio.src = ''
  audio.src = `../public/videos/${e}.mp3`
  audio.play();

})

socket.on('data', (e) => {
  console.log(e);
  document.getElementById("container").style.display = 'none'
  // document.getElementById("voiceData").value = '';
  document.getElementById("voiceData2").innerText = e;
})

socket.on('stop', (e) => {
  location.reload()
})
audio.onended = () => {
  location.reload()
};

// API endpoint
// AZnzlk1XvdvUeBnXmlld  Domi  
// 21m00Tcm4TlvDq8ikWAM Rachel
// EXAVITQu4vr4xnSDxMaL Bells
// MF3mGyEYCl7XYWbV9V6O Elli

const sendPrompt = async (prompt) => {
  let data = {
    prompt: prompt
  }
  fetch('http://localhost:4000/get-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data.result);
    })
    .catch(error => {
    });
};

// Start Recording 
const startRecording = () => {
  audio.src = '';
  document.getElementById("voiceData").value = '';
  startTime = Date.now();
  let isListeningRoboTriggered = false;

  const startListeningRobo = () => {
    console.log('started');
    document.getElementById("first").style.display = 'none'
    document.getElementById("listen").style.display = 'block'
    document.getElementById("stop").style.display = 'block'
    isRecording = true;
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      transcript = result[0].transcript;
      document.getElementById("voiceData").innerText = transcript;
      console.log('Speech Recognition Result:', transcript);
    };

    recognition.start();
    console.log('Speech Recognition Started');
  };
  startListeningRobo()
  isRecording = true;
};

// Stop Recording
const stopRecording = () => {
  console.log('stop');
  if (recognition && isRecording) {
    recognition.stop();
    isRecording = false;
    console.log('ended');
    sendPrompt(transcript)
    document.getElementById("listen").style.display = 'none'
    document.getElementById("stop").style.display = 'none'
    document.getElementById("container").style.display = 'block'
  };
}