const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const PORT = 3001;
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const say = require('say');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json({ extended: true, limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/public", express.static(path.join(__dirname, "public")));

server.listen(PORT, () => {
  console.log(`server started on ${PORT} `);
});

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

const { exec } = require('child_process');

function runPythonScript(message) {
  // Replace 'python' with 'python3' or the path to your Python executable if needed
  // 'myscript.py' is the name of your Python file
  exec(`python tts.py "${message}"`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error executing Python script:', error);
      return;
    }
    console.log('Python script executed successfully');
    console.log('Output from Python:', stdout);
  });
}
app.get("/", function (req, res) {
  res.render("main.ejs");
});

app.get("/show", function (req, res) {
  res.render("show.ejs");
});

io.on("connection", function (socket) {
  console.log("connceted");

  socket.on('toVoice',(e)=>{
    generateSpeech(e)
    io.emit("data", e);
    io.emit("play");
  })
});

app.post("/get-data", async (req, res) => {
  console.log(req.body.prompt);
  try {
    const { messages } = {
      messages: [
        { role: "system", content: "Provide a short answer." },
        { role: "user", content: `${req.body.prompt}` },
      ],
    };

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      // max_tokens: 50,
      temperature: 0.2,
    });

    const response = completion.data.choices[0].message;
    console.log(response.content);
    var result = response.content;
    console.log("Speech generated successfully.");
    // socket.emit("play", num);
    io.emit("data", result);
    io.emit("play");
    generateSpeech(result);
    // say.speak(result);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const axios = require('axios');

function generateSpeech(message) {
  const apiUrl = 'http://192.168.1.168:5000/generate_speech';

  // Make the POST request to the API
  axios
    .post(apiUrl, { message })
    .then((response) => {
      console.log('Response from Flask API:', response.data);
      io.emit('stop')
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Call the function with your message
const message = "Hi sac, how are you doing today!";
generateSpeech(message);
