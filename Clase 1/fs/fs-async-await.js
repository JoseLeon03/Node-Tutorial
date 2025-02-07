// Una vez se tienen las promesas, ya se pueden usar async await.
const fs = require('node:fs/promises')

    ; (
  async () => { // Funcion autoInvocada IIFE
    const text = await fs.readFile('./archivo.txt', 'utf-8')
    console.log(text)
  }
)()

async function init () {
  const text = await fs.readFile('./archivo.txt', 'utf-8')
  console.log(text)
} init()

console.log('hola2')
