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
  const dalleSuffix = ". The format of the response should be a JSON object with 'title' and 'story' as keys."

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

  const getStoryText = openai.createCompletion(openAiRequestObj)
    .then((response) => {
      const parsedResponse = response.data.choices[0].text.split(/\r?\n/).join(" ")

      textResponse = parsedResponse
    })
    .then(() => { return textResponse })
    .catch(err => {
      console.log(" 👺👺👺 =====>", err.message)
      res.status(400).json({ error: err })
    })

  const promise00 = Promise.resolve(3); // REMOVE
  const getImage = dalle2.getImage({ userPrompt: dallePrefix + userRequest, userId, localFileName: localFileName2 })

  // const promise02 = getStoryText;


  // and the errors?
  // 
  Promise.all([promise00, getImage, getStoryText])
    .then((allValues) => {
      res.status(200).send([null, allValues[1].url, allValues[2]])
    })

    .then(Promise.all([promise00, promise00, promise00]))

    .then(() => {
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

    .catch(err => {
      console.log("🙊 Server Error. Check node version.", err.message)
      res.status(500).json({ error: err })
    });

})

module.exports = router;

