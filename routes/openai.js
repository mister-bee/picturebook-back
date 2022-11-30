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


  const openAiRequestObj = {
    model: "text-davinci-003",
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


  const openAiCreation = openai.createCompletion(openAiRequestObj)
    .then((response) => {
      const parsedResponse = response.data.choices[0].text.split(/\r?\n/).join(" ")
      console.log("🎃🎃🎃 parsedResponse===>", parsedResponse);
      textResponse = parsedResponse
    })
    .then(() => {
      return textResponse
    })
    .catch(err => {
      console.log(err.message)
      res.status(400).json({
        error: err
      })
    })


  // MONDAY EVENING --- get image and text in same return


  const promise0 = Promise.resolve(3);
  const promise1 = test.theFunction(dallePrefix + userRequest)
  const promise2 = openAiCreation;
  const promise3 = new Promise((resolve, reject) => {
    setTimeout(resolve, 5000, 'foo');
  });

  // and thee errors?
  Promise.all([promise0, promise1, promise2, promise3]).then((allValues) => {

    console.log("👻👻👻👻 FINAL VALUES===>>>>>", allValues);

    res.status(200).send(allValues)
  });



});

module.exports = router;


//


    // openai.createCompletion(openAiRequestObj)
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