import { Configuration, OpenAIApi } from "openai";
import { writeFileSync } from 'fs';
import dotenv from "dotenv"

dotenv.config()
const API_KEY = process.env.API_KEY

const configuration = new Configuration({
  apiKey: API_KEY,
})


const openai = new OpenAIApi(configuration)

const prompt = 'frenchie puppy playing with rabbit neon modern'

const result = await openai.createImage({
  prompt,
  n: 5,
  size: "1024x1024",
  user: "theBlueBoy"
})

const url = result.data.data[0].url;

console.log(url)

// Save Image ULR to Disk
const imgResult = await fetch(url)
const blob = await imgResult.blob()
const buffer = Buffer.from(await blob.arrayBuffer())
writeFileSync(`./img/${Date.now()}.png`, buffer)