const path = require ('node:path')

//Barra separadora de carpetas segun SO
// console.log(path.sep)

//unir rutas con path.join
const filePath = path.join('content', 'subfolder', 'text.txt')
console.log(filePath)

//Nombre de archivos
const base = path.basename('/tmp/base/password.txt')
console.log(base)
//Sin extension
const filename = path.basename('/tmp/base/password.txt', '.txt')
console.log(filename)

//Para conocer la extension
const extension = path.extname('image.jpg')
console.log(extension)

