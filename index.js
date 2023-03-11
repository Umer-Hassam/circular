// function isWorking(string){
//     console.log(`Hello ${string}!`)
//     return string === "World"
// }

// module.exports = isWorking

const nod = require('./nodular')

function start(){
    console.log( "X: " + nod.a);
    //console.log( "Y: " + nod._b);
}

module.exports.start = start