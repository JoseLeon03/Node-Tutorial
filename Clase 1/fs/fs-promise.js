const fs = require('node:fs/promises')
const { promisify } = require('node:util') // Permite crear versiones de promises

const readFilePromise = promisify(fs.readFile)

fs.readFile('./fs/archivo.txt', 'utf-8')
  .then(text => {
    console.log(text)
  })

console.log('hola2')
