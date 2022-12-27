// import { Configuration, OpenAIApi } from "openai";
const { Configuration, OpenAIApi } = require('openai')


// import { writeFileSync } from 'fs';
const { writeFileSync } = require('fs')


//import dotenv from "dotenv"
// dotenv.config()
// back
require('dotenv').config()


const DALLE_API_KEY = process.env.DALLE_API_KEY

const configuration = new Configuration({
  apiKey: DALLE_API_KEY,
})


const openai = new OpenAIApi(configuration)

async function getImageAI({ userPrompt, localFileName, userId }) {

  const result = await openai.createImage({
    prompt: userPrompt,
    n: 5,
    size: "1024x1024",
    user: userId
  })

  const url = result.data.data[0].url;
  const imgResult = await fetch(url)
  const blob = await imgResult.blob()
  const buffer = Buffer.from(await blob.arrayBuffer())

  // const localFileName = `${Date.now()}_picturebook_DEC2022.png`

  writeFileSync("./img/" + localFileName, buffer)
  console.log("WRITTEN -- localFileName", localFileName)

  return { url }
}

const theFunction = async ({ userPrompt, userId, localFileName }) => {
  console.log("🌼🌼🌼🌼🌼🌼🌼====PROMPT==>>> ", userPrompt)
  console.log("🌼🌼🌼🌼🌼🌼🌼==== localFileName ==>>> ", localFileName)

  const { url } = await getImageAI({ userPrompt, localFileName, userId })

  console.log("👽👽👽👽url===>>>", url)

  return { url }
}


// export default theFunction
module.exports = { theFunction }
