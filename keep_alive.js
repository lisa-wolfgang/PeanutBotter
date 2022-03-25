const express = require('express');
const server = express();

server.all('/', (req, res)=>{
    res.send('A wild PEANUTBOTTER appeared!')
})

function keepAlive(){
    server.listen(3000, ()=>{console.log("A wild PEANUTBOTTER appeared!")});
}

module.exports = keepAlive;