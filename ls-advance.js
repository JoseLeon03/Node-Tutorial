const fs = require('node:fs/promises')
const path = require('node:path')

const folder = process.argv[2] ?? '.'

async function ls(folder){
    let files
    try{
       files = await fs.readdir(folder)
    }  catch{
        console.log('error ', folder , err)
        process.exit(1)
    }
    
    const filePromises = files.map(async file => {
        const  filePath = path.join(folder, file)
        let fileStats
        try{
             fileStats = await fs.stat(filePath) //Informacion del archivo
        }catch{
            console.log('error ', filePath, err)
            process.exit(1)
        }
        const isDirectory = fileStats.isDirectory()
        const fileType = isDirectory ? 'd' : 'f'//Si es directorio d si no f
        const fileSize = fileStats.size
        const fileModified = fileStats.mtime.toLocaleString()

        return `${fileType} ${file.padEnd(20)} ${fileSize.toString().padStart(10)} ${fileModified}`
    })
    const filesInfo = await Promise.all(filePromises)
    filesInfo.forEach(fileInfo => console.log(fileInfo))
}ls(folder)


// fs.readdir(folder)
//     .then(files => {
//         files.forEach(file => {
//          const filePath = path.join(folder, file)  
//          fs.stat(filePath)
//         })
//     })
//     .catch(err => { 
//         console.log('error ', err) 
//     })