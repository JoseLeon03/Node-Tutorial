const fs = require('node:fs')

const text = fs.readFileSync('./fs/archivo.txt', 'utf-8')
console.log(text)

console.log('hola2')
