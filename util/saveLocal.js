//import { writeFileSync } from 'fs';
const { writeFileSync } = require('fs')



//const url = result.data.data[0].url;

const saveLocal = async (url) => {
  console.log("url", url)

  const imgResult = await fetch(url)
  const blob = await imgResult.blob()
  const buffer = Buffer.from(await blob.arrayBuffer())

  const fileName = `./img_2/${Date.now()}.png`

  writeFileSync(`./img_2/${Date.now()}.png`, buffer)

  return fileName

}

module.exports = saveLocal
