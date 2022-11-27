const express = require('express');
require('dotenv').config()
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai')

const test = require('./dalleTest');
// How to import 'theFunction'
//const theFunction = require('dalle_2.js')


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

  // console.log("temperature=====>>>>", temper ature)
  // console.log("type of ====>>>>", typeof temperature)
  console.log("+++++++++ parse and add to DALLE userRequest++++++>>", userRequest)

  if (!userRequest) {
    res.status(400).json({
      error: "Invalid user request"
    })
  }

  const storyPrefix = "Write a children's story about "
  const dallePrefix = "A children's book illustration of  "

  test.theFunction(dallePrefix + userRequest)

  const openAiRequest = {
    model: "text-davinci-002",
    prompt: storyPrefix + userRequest,
    temperature,
    max_tokens,
    top_p: 1,
    frequency_penalty: 0.5,
    presence_penalty: 0,
    stop: ["You:"],
  }


  let textResponse;
  let imageUrl;


  openai.createCompletion(openAiRequest)

    .then((response) => {
      const parsedResponse = response.data.choices[0].text.split(/\r?\n/).join(" ")

      console.log(parsedResponse, parsedResponse);

      textResponse = parsedResponse

    })


    // openai.createCompletion(openAiRequest)
    //   .then((response) => {
    //     const parsedResponse = response.data.choices[0].text.split(/\r?\n/).join(" ")

    //     console.log(parsedResponse, parsedResponse);

    //     textResponse = parsedResponse

    //     //res.status(200).send(parsedResponse)
    //   })

    // .then(() => {
    //   // image
    //   return openai.createImage({
    //     prompt: newPrompt,
    //     n: 5,
    //     size: "1024x1024",
    //     user: "theBlueBoy"
    //   })
    // })

    // .then((result) => {
    //   const url = result.data.data[0].url;
    //   imageUrl = url
    //   console.log("===== imageUrl", imageUrl)
    //   return url
    // })

    // .then((url) => {
    //   console.log("===== url", url)
    //   return fetch(url)

    // }).then((imgResult) => {
    //   return imgResult.blob()

    // }).then((blob) => {
    //   return blob.arrayBuffer()

    // }).then((buffer) => {
    //   return Buffer.from(buffer)

    // })
    // .then((finalBufferToWrite) => {
    //   writeFileSync(`./img/${Date.now()}.png`, finalBufferToWrite)
    // })


    .then(() => {
      res.status(200).send(textResponse)
    })
    .catch(err => {
      console.log(err.message)
      res.status(400).json({
        error: err
      })
    })


  // SUNDAY EVENING --- get image link and text in same call
  const promise1 = Promise.resolve(3);
  const promise2 = openai.createCompletion(openAiRequest);
  const promise3 = new Promise((resolve, reject) => {
    setTimeout(resolve, 5000, 'foo');
  });

  Promise.all([promise1, promise2, promise3]).then((values) => {
    console.log("👻👻👻👻 values===>>>>>", values);
  });



});

module.exports = router;


//