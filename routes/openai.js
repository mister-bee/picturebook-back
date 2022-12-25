const express = require('express');
require('dotenv').config()
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai')
const dalle2 = require('./dalle2');
const admin = require("firebase-admin");
var serviceAccount = require("../config/serviceAccountKey.json");
const { getStorage, ref, getDownloadUrl } = require('firebase-admin/storage');


const configuration = new Configuration({ apiKey: process.env.OPENAI_KEY });
const openai = new OpenAIApi(configuration);


const bucketName = process.env.BUCKET_ID
const saveBackupImages = true

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: bucketName
});

//const storage = getStorage();
const bucket = getStorage().bucket();

router.get('/', function (req, res, next) {
  res.send('respond with an ai resource');
});


router.post('/', function (req, res, next) {

  const { body } = req
  const { userRequest, max_tokens, temperature, userId, storyIdTitle } = body || {}

  console.log("🦁 max_tokens =====>>>>", max_tokens)
  console.log("🦁🦁 temperature =====>>>>", temperature)
  console.log("🦁🦁🦁 userRequest ====>>>>", userRequest)
  console.log("🌼🌼🌼🌼🌼 userId ====>>>>", userId)

  if (!userRequest) { res.status(400).json({ error: "Invalid user request" }) }

  const languageFlagSpanish = "In Spanish, "
  const languageFlag = "In English, "
  const storyPrefix_ELL = "Write a story for children who are learning English, using simple descriptive words, about  "
  const storyPrefix_5 = " write a children's story for 5 years olds about "
  const storyPrefix = " write a children's story for 8 years olds about "
  const storyPrefix_12 = "Write a children's story for 12 year old using rich and detailed language about "
  const dialogueFlag = " Be sure to have the characters using interesting dialogue."
  const dallePrefix = "A detailed children's book illustration of  "
  const dalleSuffix = ". At the end, give the story a title and right after TITLE:"

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

  const openAIText = openai.createCompletion(openAiRequestObj)
    .then((response) => {
      const parsedResponse = response.data.choices[0].text.split(/\r?\n/).join(" ")
      console.log("parsedResponse ===>", parsedResponse);
      textResponse = parsedResponse
    })
    .then(() => {
      return textResponse
    })
    .catch(err => {
      console.log(" 👺👺👺 =====>", err.message)
      res.status(400).json({
        error: err
      })
    })


  let imageUrl;

  const promise00 = Promise.resolve(3); // REMOVE
  const urlAndLocalFilename01 = dalle2.theFunction({ userPrompt: dallePrefix + userRequest, userId })

  const promise02 = openAIText;


  // and the errors?
  Promise.all([promise00, urlAndLocalFilename01, promise02])

    .then((allValues) => {
      res.status(200).send([null, allValues[1].url, allValues[2]])
      return allValues[1].localFileName
    })

    .then((localFileName) => {
      const bucketPrefix = "images/USERSET_A_" + userId + "/"
      const bucketSuffix = "_picturebook_DEC2022.png"
      const options = { destination: bucketPrefix + storyIdTitle + bucketSuffix };

      const googleCloudResponse = bucket.upload("img/" + localFileName, options)
      console.log(`#1 - options ${options}`);
      console.log(`#1 ${localFileName} uploaded to ${bucketName}`);

      // return googleCloudResponse
      return localFileName

    })

    // SAVE TO BACKUP BUCKET
    .then((localFileName) => {
      const bucketPrefix = "images/USERSET_A_" + userId + "/"
      const bucketSuffix = "_picturebook_DEC2022.png"
      const options = { destination: bucketPrefix + storyIdTitle + bucketSuffix };

      const googleCloudResponse2 = bucket.upload("img/" + localFileName, options)
      console.log(`#2 - options ${options}`);
      console.log(`#2 ${localFileName} uploaded to ${bucketName}`);
      // return googleCloudResponse
      return localFileName

    })

    //  ADD HERE
    // #1 saveBackupImages -- check flag saveBackupImages
    // #2 DELETE LOCAL FILE -- localFileName

    .then((localFileName) => {
      console.log("🍁🍁🍁🍁 TODO: DELETE LOCAL FILE 🍁🍁🍁🍁", localFileName)
    })

    .catch(err => {
      console.log("🙊 Server Error. Check node version.", err.message)
      res.status(500).json({ error: err })
    });

})

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



// const { getFirestore, collection, getDocs } = require('firebase-admin/firestore');
// const {
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   listAll,
//   list,
//   getStorage
// } = require('firebase-admin/storage')

// const storage = getStorage(app);
// //const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
// const imageRef = ref(storage, `images/${"NODETEST" + v4()}`);
// uploadBytes(imageRef, imageUpload).then((snapshot) => {
//   getDownloadURL(snapshot.ref).then((url) => {
//     //setImageUrls((prev) => [...prev, url]);
//     console.log("====🌼🌼🌼🌼🌼===>>>>", url)
//   });
// });


    // Optional:
          // Set a generation-match precondition to avoid potential race conditions
          // and data corruptions. The request to upload is aborted if the object's
          // generation number does not match your precondition. For a destination
          // object that does not yet exist, set the ifGenerationMatch precondition to 0
          // If the destination object already exists in your bucket, set instead a
          // generation-match precondition using its generation number.
          //preconditionOpts: { ifGenerationMatch: 0 },