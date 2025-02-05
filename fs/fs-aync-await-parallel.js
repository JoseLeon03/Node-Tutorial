//En paralelo hace el proceso mas rapido
const fs = require('node:fs/promises')


    Promise.all([
        fs.readFile('./archivo.txt', 'utf-8'),
        fs.readFile('./archivo2.txt', 'utf-8')

    ]).then(([text, secondText]) => {
        console.log(text)
        console.log(secondText)
    })





console.log("hola2")

