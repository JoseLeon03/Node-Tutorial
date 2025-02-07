const fs = require('node:fs')

const stats = fs.statSync('./fs/archivo.txt')// tiene la informacion del archivo

const text = fs.readFileSync('./fs/archivo.txt', 'utf-8')// lee le contenido del archivo

fs.readFile('./fs/archivo.txt', 'utf-8', (err, text) => {
    console.log(text)
})// lee le contenido del archivo de forma asincrona Callback

console.log('hola2')
