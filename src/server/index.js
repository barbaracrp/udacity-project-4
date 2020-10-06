const https = require('follow-redirects').https;
const assert = require('assert')
const path = require('path')
const express = require('express')
const mockAPIResponse = require('./mockAPI.js')
const dotenv = require('dotenv');
dotenv.config();

//assert(process.env.API_ID, 'API_ID should be set')
assert(process.env.API_KEY, 'API_KEY should be set')

const app = express()

const bodyParser = require('body-parser')
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false })); // para entender urls que trazem parametros
app.use(bodyParser.json()); // para entender requisicóes json

// Cors for cross origin allowance
const cors = require('cors'); // package q permite browser e server conversar um com o outro
app.use(cors());              // sem secutity interrupcoes

app.use(express.static('dist'))

console.log(__dirname)

app.get('/', function (req, res) {
    // res.sendFile('dist/index.html')
    res.sendFile(path.resolve('src/client/views/index.html'))
})

// designates what port the app will listen to for incoming requests
app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
})

app.post('/sentiment', function (req, res) {
  const options = {
    'method': 'POST',
    'hostname': 'api.meaningcloud.com',
    'path': `/sentiment-2.1?key=${process.env.API_KEY}&lang=en&txt=${encodeURI(req.body.text)}&model=general`,
    'headers': {
    },
    'maxRedirects': 20
  };

  const req2 = https.request(options, function (res2) {
    const chunks = [];

    res2.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res2.on("end", function (chunk) {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
      const obj = JSON.parse(body.toString())
      res.send({irony: obj.irony});
    });

    res2.on("error", function (error) {
      console.error(error);
      res.status(500).send(error);
    });
  });

  req2.end();
})

app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
})
