var recognition;
let isRecording = false;
var transcript
var buttonId
var audio
var startTime;
const socket = io();


function playVid() {
  
}

var audio = document.getElementById("myAudio");
socket.on('play', (e) => {
  document.getElementById("default").style.display = 'none'
  document.getElementById("bg").style.display = 'block'
  document.getElementById("third").style.display = 'none'
  document.getElementById("four").style.display = 'block'
  document.getElementById("voiceData").value = '';
  audio.src = ''
  audio.src = `../public/videos/${e}.mp3`
  audio.play();
})

audio.onended = () => {
  // Handle the "end" event here
  // console.log("Audio playback ended");
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
  fetch('https://starfish-app-qvwae.ondigitalocean.app/get-data', {
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
  console.log(startTime);

  let isListeningRoboTriggered = false;

  const startListeningRobo = () => {
    document.getElementById("default").style.display = 'none'
    document.getElementById("bg").style.display = 'block'
    document.getElementById("first").style.display = 'none'
    document.getElementById("second").style.display = 'block'
    isRecording = true;
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      transcript = result[0].transcript;

      document.getElementById("voiceData").value = transcript;
      console.log('Speech Recognition Result:', transcript);
      // Additional logic or processing for the recognized speech can be added here.
    };

    // recognition.onend = () => {
    //   console.log('Speech Recognition Ended');
    //   isRecording = false;
    //   sendPrompt(transcript)
    // };

    recognition.start();
    
    console.log('Speech Recognition Started');
  };

  const triggerListeningRobo = () => {
    if (!isListeningRoboTriggered) {
      isListeningRoboTriggered = true;
      console.log('Listening Robo Triggered');
      startListeningRobo();
      
      // Additional actions or animations can be performed here to indicate that the robot is listening.
    }
  };

  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1];
    transcript = result[0].transcript;
    console.log(transcript);

    if (transcript.toLowerCase().includes('nebula')) {
      triggerListeningRobo();
      transcript = ''
    }
  };

  // recognition.onend = () => {
  //   console.log('Speech Recognition Ended');
  //   isRecording = false;
  //   // sendPrompt(transcript)
  // };

  recognition.start();
  isRecording = true;
  console.log('Speech Recognition Started');
};


// Stop Recording
const stopRecording = () => {
  console.log('stop');
  if (recognition && isRecording) {
    recognition.stop();
    isRecording = false;
    console.log('ended');
    sendPrompt(transcript)
    document.getElementById("default").style.display = 'block'
    document.getElementById("bg").style.display = 'none'
    document.getElementById("second").style.display = 'none'
    document.getElementById("third").style.display = 'block'
  };
}

// document.getElementById('startButton').addEventListener('click', startRecording);
// document.getElementById('stopButton').addEventListener('click', stopRecording);







// const startRecording = () => {
//   audio.src = ''
//   document.getElementById("voiceData").value = ''
//   startTime = Date.now();
//   console.log(startTime);
//   // textToSpeech("Hello, this is a test.");
//   recognition = new webkitSpeechRecognition();
//   recognition.continuous = true;
//   recognition.interimResults = true;
  
//   recognition.onresult = (event) => {
//     const result = event.results[event.results.length - 1];
//     transcript = result[0].transcript
//     document.getElementById("voiceData").value = transcript

//     console.log('Speech Recognition Result:', transcript);
//   };

//   recognition.onend = () => {
//     console.log('Speech Recognition Ended');
//     isRecording = false;
//     // sendPrompt(transcript)
//   };

//   recognition.start();
//   isRecording = true;
//   console.log('Speech Recognition Started');
// };