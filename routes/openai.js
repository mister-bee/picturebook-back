var express = require('express');
var router = express.Router();
const { Configuration, OpenAIApi } = require('openai')
const config = require("config");

// const OPENAI_KEY = config.get("OPENAI_KEY") // change to kansha_openai
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_KEY,
// });
// const openai = new OpenAIApi(configuration);


router.get('/', function (req, res, next) {
  res.send('respond with an ai resource');
});


router.post('/', function (req, res, next) {

  const { body } = req
  const { userRequest, max_tokens = 200 } = body || {}

  if (!userRequest) {
    res.status(400).json({
      error: "Invalid user request"
    })
  }


  const openAiRequest = {
    model: "text-davinci-002",
    prompt: userRequest,
    temperature: 0.5,
    max_tokens,
    top_p: 1,
    frequency_penalty: 0.5,
    presence_penalty: 0,
    stop: ["You:"],
  }

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