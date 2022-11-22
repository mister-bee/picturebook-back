var express = require('express');
require('dotenv').config()
var router = express.Router();
const { Configuration, OpenAIApi } = require('openai')

const test = require('./test123');
// How to import 'theFunction'
//const theFunction = require('dalle_2.js')

console.log("process.env.OPENAI_KEY", process.env.OPENAI_KEY)

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);


router.get('/', function (req, res, next) {
  res.send('respond with an ai resource');
});


router.post('/', function (req, res, next) {

  const { body } = req
  const { userRequest, max_tokens = 200, temperature = .5 } = body || {}

  console.log("temperature=====>>>>", temperature)
  console.log("type of ====>>>>", typeof temperature)
  console.log("++++ pare and add to DALLE userRequest++++++>>", userRequest)

  if (!userRequest) {
    res.status(400).json({
      error: "Invalid user request"
    })
  }


  const openAiRequest = {
    model: "text-davinci-002",
    prompt: userRequest,
    temperature,
    max_tokens,
    top_p: 1,
    frequency_penalty: 0.5,
    presence_penalty: 0,
    stop: ["You:"],
  }
  test.theFunction()

  openai.createCompletion(openAiRequest)

    .then((response) => {
      const parsedResponse = response.data.choices[0].text.split(/\r?\n/).join(" ")

      console.log(parsedResponse, parsedResponse);
      res.status(200).send(parsedResponse)

    }).catch(err => {
      console.log(err.message)
      res.status(400).json({
        error: err
      })
    })

});

module.exports = router;


//