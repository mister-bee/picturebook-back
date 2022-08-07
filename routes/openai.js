var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.send('respond with an ai resource');
});

router.post('/', function (req, res, next) {
  console.log("req.body: ", req.body)

  const body = req
  console.log(body)

  // const { question } = userInput

  // openai.createCompletion({
  //   model: "text-davinci-002",
  //   prompt: question,
  //   temperature: 0.5,
  //   max_tokens: 1000,
  //   top_p: 1,
  //   frequency_penalty: 0.5,
  //   presence_penalty: 0,
  //   stop: ["You:"],
  // })
  //   .then((response) => {

  //     const parsedResponse = response.data.choices[0].text.split(/\r?\n/).join(" ")

  //     console.log(parsedResponse, parsedResponse);

  //     setResponseAI({
  //       heading: "AI Product Description Here.. add this to a google sheet /PDF",
  //       newResponse: parsedResponse
  //     })
  //   })


  res.send('respond with POST ai resource');
});



module.exports = router;
