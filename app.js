const express = require("express");
const app = express();
// const server = require("http").createServer(app);
const server = require("http").Server(app);
const io = require("socket.io")(server);
const PORT = 4000;
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const voice = require("elevenlabs-node");
const fs = require("fs");
const labApiKey = '3c292dd7e16bbc3f07e8c1743fff55e5'// Your API key from Eleven Labs
const voiceID = "21m00Tcm4TlvDq8ikWAM"; // The ID of the voice you want to get

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

app.get("/", function (req, res) {
  res.render("main.ejs");
});

io.on("connection", function (socket) {
  console.log("connceted");
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
    let result = response.content;
    voice
      .textToSpeechStream(labApiKey, voiceID, result, 0.2, 0.7)
      .then((res) => {
        // ... Your existing code for writing the speech to a file
        var fileName = ''
        var num = ''
        num = Date.now()
        fileName = `./public/videos/${num}.mp3`
        const writeStream = fs.createWriteStream(fileName);
        res.pipe(writeStream);
        writeStream.on('finish', () => {
          console.log('Speech generated successfully.');
          io.emit('play', num)
          return
        });
      })
      .catch((error) => {
        console.error('Error during textToSpeechStream:', error);
        if (error.response) {
          console.error("API Error Response:", error.response.data);
        } else if (error.request) {
          console.error("No API Response:", error.request);
        } else {
          console.error("Error:", error.message);
        }
      });

    // voice.textToSpeechStream(labApiKey, voiceID, result, 0.2, 0.7).then(res => {
      // var fileName = ''
      // var num = ''
      // num = Date.now()
      // fileName = `./public/videos/${num}.mp3`
      // const writeStream = fs.createWriteStream(fileName);
      // res.pipe(writeStream);
      // writeStream.on('finish', () => {
      //   console.log('Speech generated successfully.');
      //   io.emit('play', num)
      //   return
      // });
    // });
    // res.json({ result });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});
