const express = require('express');
require('dotenv').config()
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai')
const dalle2 = require('./dalle2');
const admin = require("firebase-admin");
var serviceAccount = require("../config/serviceAccountKey.json");
const { getStorage, ref, getDownloadUrl } = require('firebase-admin/storage');
const { v4 } = require('uuid');

const { unlink } = require('node:fs/promises');
const configuration = new Configuration({ apiKey: process.env.OPENAI_KEY });
const openai = new OpenAIApi(configuration);


const bucketName = process.env.BUCKET_ID
const saveBackupImages = true

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: bucketName
});


const bucket = getStorage().bucket();

router.get('/', function (req, res, next) {
  res.send('respond with an ai resource');
});


router.post('/', function (req, res, next) {

  const { body } = req
  const { userRequest, max_tokens, temperature, userId, storyIdTitle } = body || {}

  //const localFileName2 = `${Date.now()}_picturebook_DEC2022.png`
  const localFileName2 = `${v4()}_picturebook_DEC2022.png`

  // console.log("🦁 max_tokens =====>>>>", max_tokens)
  // console.log("🦁🦁 temperature =====>>>>", temperature)
  // console.log("🦁🦁🦁 userRequest ====>>>>", userRequest)
  // console.log("🌼🌼🌼🌼🌼 userId ====>>>>", userId)

  if (!userRequest) { res.status(400).json({ error: "Invalid user request" }) }

  const languageFlagSpanish = "In Spanish, "
  const languageFlag = "In English, "
  const storyPrefix_ELL = "Write a story for children who are learning English, using simple descriptive words, about  "
  const storyPrefix_5 = " write a children's story for 5 years olds about "
  const storyPrefix = " write a children's story for 8 years olds about "
  const storyPrefix_12 = "Write a children's story for 12 year old using rich and detailed language about "


  const dialogueFlag = " Be sure to have the characters using interesting dialogue."
  const dallePrefix = "A detailed children's book illustration of  "
  // const dalleSuffix = ". At the end, give the story a title and right after TITLE:"
  // const dalleSuffix = ". The format of the response should be a JSON object with 'title' and 'story' as keys."


  // ---- TEXT ---- //
  const openAiStoryRequestObject = {
    model: "text-davinci-003",
    prompt: languageFlag + storyPrefix + userRequest + dialogueFlag, // + dalleSuffix,
    temperature: 1,
    max_tokens: 2000,
    top_p: 1,
    frequency_penalty: 0.5,
    presence_penalty: 0
    // stop: ["You:"]
  }

  let textOfStory;

  const getStoryText = openai.createCompletion(openAiStoryRequestObject)
    .then((response) => {
      const parsedResponse = response.data.choices[0].text.split(/\r?\n/).join(" ")
      textOfStory = parsedResponse
    })
    .then(() => { return textOfStory }) // necessary:?
    .catch(err => {
      console.log("👺👺👺 getStoryText =====>", err.message)
      res.status(400).json({ error: err })
    })


  // ---- TITLE ---- //
  // const openAiTitleRequest = {
  //   model: "text-davinci-003",
  //   prompt: "Write an interesting title to the following children's story: " + tempText,
  //   temperature: 1,
  //   max_tokens: 500,
  //   top_p: 1,
  //   frequency_penalty: 0.5,
  //   presence_penalty: 0
  //   //stop: ["You:"]
  // }

  // let titleOfStory;

  // const getStoryTitle = openai.createCompletion(openAiTitleRequest)

  //   .then((response) => {
  //     console.log("openAiTitleRequest====>>", openAiTitleRequest)
  //     const parsedResponse = response.data.choices[0].text.split(/\r?\n/).join(" ")
  //     titleOfStory = parsedResponse

  //   })
  //   .then(() => { return titleOfStory }) // add other story and image too?
  //   .catch(err => {
  //     console.log(" 👺👺👺 getStoryTitle =====>", err.message)
  //     res.status(400).json({ error: err })
  //   })

  const promise00 = Promise.resolve(3); // REMOVE
  const getImage = dalle2.getImage({ userPrompt: dallePrefix + userRequest, userId, localFileName: localFileName2 })


  // #1 GET IMAGE and TEXT
  Promise.all([promise00, getImage, getStoryText])
    .then((allValues) => {

      const newStoryText = allValues[2]
      const openAiTitleRequest = {
        model: "text-davinci-003",
        prompt: "Write an interesting title to the following children's story: " + newStoryText,
        temperature: 1,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0
      }

      // Promise.all([getStoryTitle])
      openai.createCompletion(openAiTitleRequest)
        .then((response) => {
          console.log("openAiTitleRequest====>>", openAiTitleRequest)
          const parsedResponse = response.data.choices[0].text.split(/\r?\n/).join(" ")
          const titleOfStory = parsedResponse
          return { titleOfStory, allValues }
        })
        .then(({ allValues, titleOfStory }) => {
          console.log("!!!!!!titleOfStory=======>>>>>>>", titleOfStory)
          res.status(200).send([null, allValues[1].url, allValues[2]])
          return allValues
        })

        // saved IMAGE to bucket
        .then((allValues) => {

          console.log("🏖🏖🏖 allValues[0]====>", allValues)


          const bucketPrefix = "images/USERSET_A_" + userId + "/"
          const bucketSuffix = "_picturebook_DEC2022.png"
          const options = { destination: bucketPrefix + storyIdTitle + bucketSuffix };
          bucket.upload("img/" + localFileName2, options)

            .then(() => {
              const bucketBackupPrefix = "images_backup/USERSET_A_" + userId + "/"
              const bucketSuffix = "_picturebook_DEC2022.png"
              const options = { destination: bucketBackupPrefix + storyIdTitle + bucketSuffix };
              bucket.upload("img/" + localFileName2, options)

                .then(() => unlink("img/" + localFileName2))
            })
        })

        // .then(() => { return { titleOfStory } })
        .catch(err => {
          console.log(" 👺👺👺 getStoryTitle =====>", err.message)
          res.status(400).json({ error: err })
        })
    })



    .catch(err => {
      console.log("🙊 Server Error. Check node version.", err.message)
      res.status(500).json({ error: err })
    });

})

module.exports = router;

