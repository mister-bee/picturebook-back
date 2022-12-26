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

async function getImageAI(prompt) {

  const result = await openai.createImage({
    prompt,
    n: 5,
    size: "1024x1024",
    user: "theBlueBoy"
  })

  const url = result.data.data[0].url;
  const imgResult = await fetch(url)
  const blob = await imgResult.blob()
  const buffer = Buffer.from(await blob.arrayBuffer())

  const localFileName = `${Date.now()}_picturebook_DEC2022.png`

  writeFileSync("./img/" + localFileName, buffer)
  //writeFileSync(`./img/${Date.now()}.png`, buffer)
  console.log("localFileName", localFileName)

  return { url, localFileName }
}

const theFunction = async ({ userPrompt, userId }) => {
  console.log("🌼🌼🌼🌼🌼🌼🌼====PROMPT==>>> ", userPrompt)
  console.log("🌼🌼🌼🌼🌼🌼🌼==== userId ==>>> ", userId)

  const { url, localFileName } = await getImageAI(userPrompt)
  console.log("👽👽👽👽url===>>>", url)

  return { url, localFileName }
}


// export default theFunction
module.exports = { theFunction }
