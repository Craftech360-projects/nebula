var recognition;
let isRecording = false;
var transcript
var buttonId
var startTime;
const socket = io();

socket.on('data', (e) => {
  console.log(e,'answer');
  document.getElementById("container").style.display = 'none'
  document.getElementById("voiceData2").innerText = e;
})

socket.on('stop', (e) => {
  location.reload()
})


const sendPrompt = async (prompt) => {
  let data = {
    prompt: prompt
  }
  fetch('/get-data', {
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
  document.getElementById("voiceData").value = '';
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