// import { Configuration, OpenAIApi } from "openai";
const { Configuration, OpenAIApi } = require('openai')


// import { writeFileSync } from 'fs';
const { writeFileSync } = require('fs')


//import dotenv from "dotenv"
// dotenv.config()
require('dotenv').config()


const DALLE_API_KEY = process.env.DALLE_API_KEY

const configuration = new Configuration({
  apiKey: DALLE_API_KEY,
})


const openai = new OpenAIApi(configuration)

// const newPrompt = 'frenchie puppy playing with rabbit neon modern'

async function openAiGo(prompt) {

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

  writeFileSync(`./img/${Date.now()}.png`, buffer)

  return url
}

const theFunction = (newPrompt) => {
  console.log("🌼🌼🌼🌼🌼🌼🌼====PROMPT==>>> ", newPrompt)
  openAiGo(newPrompt)
}
// export default theFunction

module.exports = { theFunction }
