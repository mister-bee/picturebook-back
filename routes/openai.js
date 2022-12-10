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
  const { userRequest, max_tokens, temperature } = body || {}

  console.log("🦁 max_tokens =====>>>>", max_tokens)
  console.log("🦁🦁 temperature =====>>>>", temperature)
  //console.log("typeof ====>>>>", typeof temperature)
  console.log("🦁🦁🦁 userRequest ====>>>>", userRequest)


  if (!userRequest) {
    res.status(400).json({
      error: "Invalid user request"
    })
  }


  const languageFlag = "In Spanish, "

  const storyPrefix_ELL = "Write a story for children who are learning English, using simple descriptive words, about  "
  const storyPrefix_5 = " write a children's story for 5 years olds about "
  const storyPrefix = " write a children's story for 8 years olds about "
  const storyPrefix_12 = "Write a children's story for 12 year old using rich and detailed language about "

  const dialogueFlag = " Be sure to have the characters using interesting dialogue."


  const dallePrefix = "A children's book illustration of  "
  const dalleSuffix = " At the end, give the story a title and write after TITLE:"




  const openAiRequestObj = {
    model: "text-davinci-003",
    prompt: languageFlag + storyPrefix + userRequest + dialogueFlag + dalleSuffix,
    temperature: 1,
    max_tokens: 2000,
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
      console.log(" 👺👺👺=========>", err.message)
      res.status(400).json({
        error: err
      })
    })


  // MONDAY EVENING --- get image and text in same return


  const promise0 = Promise.resolve(3);
  const promise1 = test.theFunction(dallePrefix + userRequest)
  const promise2 = openAiCreation;
  // const promise3 = new Promise((resolve, reject) => {
  //   setTimeout(resolve, 5000, 'foo');
  // });

  // and thee errors?
  Promise.all([promise0, promise1, promise2]).then((allValues) => {

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