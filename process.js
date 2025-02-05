//Process proporciona informacion y control sobre el proceso actual de ejecucion

//argumentos de antrada
// console.log(process.argv)

//Controlar el proceso y su salida
// process.exit(0) //Todo bien
// process.exit(1) // Error

//Controlar eventos del proceso
process.on('exit', () =>{
    //limpiar los recursos
})

//Current working directory
console.log(process.cwd())
