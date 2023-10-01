var recognition;
let isRecording = false;
var transcript
var buttonId
var startTime;
const socket = io();
const chatID="c7b30ff3-c03b-4a86-afb1-775842bef0b0";
const brainId="ffcb399f-f222-424e-81fe-60a2fa3c2ade";
const environment = {
  supabase: {
    url: 'https://jypkclsiqvkatajjvltb.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cGtjbHNpcXZrYXRhamp2bHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAwMTQ1OTcsImV4cCI6MjAwNTU5MDU5N30.hGY8ddFue0f2gnHy-Pd8C_1dN9pyGPCZXhJ52sODrNE',
    brainId: brainId,
    chatId: chatID,
    model: 'gpt-3.5-turbo-0613',
    temperature: 0,
    max_tokens: 150,
  },
  url: {
    questionUrl: `http://localhost:5050/chat/${chatID}/question?brain_id=`,
  },
  elevenLabs: {
    modelId: '21m00Tcm4TlvDq8ikWAM',
    url: 'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM?optimize_streaming_latency=0',
    apiKey: '3c292dd7e16bbc3f07e8c1743fff55e5',
  },
};

const { createClient } = supabase;
const _supabase = createClient(
  environment.supabase.url,
  environment.supabase.key
);
_supabase.auth
  .signInWithPassword({
    email: 'abilashs003@gmail.com',
    password: 'xp258LEFbVbLNvi',
  })
  .then((x) => {
    console.log(x.data.session.access_token);
    localStorage.setItem(
      'access_token',
      x.data.session.access_token
    );
    localStorage.setItem(
      'refresh_token',
      x.data.session.refresh_token
    );
    // save the auth token in local storage
  });
socket.on('data', (e) => {
  console.log(e, 'answer');
  document.getElementById("loading").style.display = 'none'
  document.getElementById("voiceData2").innerText = e;
})

socket.on('stop', (e) => {
  // location.reload()
})

function gotToHome() {
  location.reload()
}


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
    document.getElementById("second").style.display = 'none'
    document.getElementById("main").style.display = 'flex'
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
    // sendPrompt(transcript)
    getAnswer(transcript);
    document.getElementById("load").style.display = 'none'
    document.getElementById("loading").style.display = 'block'
  };
}

function clearText() {
  recognition.stop();
  document.getElementById("voiceData").innerText = null;
  document.getElementById("voiceData2").innerText = null;
  document.getElementById("load").style.display = 'block'
  document.getElementById("loading").style.display = 'none'
  startRecording();
}

function showQuestions() {
  document.getElementById("first").style.display = 'none'
  document.getElementById("second").style.display = 'none'
  document.getElementById("back").style.display = 'block'
  document.getElementById("questions").style.display = 'flex'
}

async function getAnswer(question) {
  var access_token =
    localStorage.getItem('access_token');

  await getAnswerApi({
    access_token: access_token,
    question: question,
  });
  // socket.emit('getAnswer', );
}

async function getAnswerApi(data) {
  try {
    let updatedString = data.question.replace(/USD/g, "UST");
    let body = {
      model: environment.supabase.model,
      question: `${updatedString}, give me a short answer`,
      temparature:
        environment.supabase.temperature,
      max_tokens: environment.supabase.max_tokens,
    };

    // get access token from supabase

    let access_token = data.access_token;
    console.log(access_token);
    let headers = {
      'Content-Type': 'application/json', // Example content type header
      Authorization: `Bearer ${access_token}`, // Example authorization header
    };
    // Replace 'YOUR_API_URL' with the actual URL of the API you want to call
    const apiUrl = `${environment.url.questionUrl}${environment.supabase.brainId}`;

    const response = await axios
      .post(apiUrl, body, { headers })
      .then((res) => {
        console.log(res.data.assistant);
        socket.emit("toVoice", res.data.assistant)
      });

    // console.log('API Details:', details);
  } catch (error) {
    console.error(
      'Error fetching details from API:',
      error
    );
  }
}


function changeColor(divId) {
  const divs = document.querySelectorAll("#questions div");
  divs.forEach((div) => {
    if (div.id === divId) {
      console.log(div.id);
      var a = document.getElementById('play');
      a.src = `../public/ans/${div.id}.mp3`
      a.play()
      socket.emit("playAudio");
      a.addEventListener('ended', () => {
        socket.emit("stopAudio");
        // This function will be called when the audio playback ends
        console.log('Audio playback ended');
        const divs = document.querySelectorAll("#questions div");
        divs.forEach((div) => {
          // Reset the background color of all divs to white
          div.style.backgroundColor = "white";
          div.style.color = "black";
        });
        // You can perform additional actions here if needed
      });
      div.style.backgroundColor = "#0097ac";
      div.style.color = "white";
    } else {
      // Reset the background color of other divs to white
      div.style.backgroundColor = "white";
      div.style.color = "black";
    }
  });
}

// Add click event listeners to each div
const divs = document.querySelectorAll("#questions div");
divs.forEach((div) => {
  div.addEventListener("click", () => {
    changeColor(div.id);
  });
});

// Add click event listener to the button to reset colors
// const changeColorButton = document.getElementById("changeColorButton");
// changeColorButton.addEventListener("click", () => {
//   divs.forEach((div) => {
//     // Reset the background color of all divs to white
//     div.style.backgroundColor = "white";
//   });
// });