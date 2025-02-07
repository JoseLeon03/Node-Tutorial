// Modulos nativos

// Da informacion del sistema operativo.
const os = require('node:os')

console.log(os.cpus()) // <------- Escalar procesos en Node
console.log(os.freemem() / 1024 / 1024)
console.log(os.totalmem() / 1024 / 1024)
