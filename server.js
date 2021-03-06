import express from "express";
import http from "http";
import { Server } from "socket.io";
import fs from 'fs'
import variables from './variables.js'
import Cell from './class.js';

let app = express();
let server = http.createServer(app);
let io = new Server(server);
let matrix =variables.matrix
let allArr = variables.allArr
let matLen = 30
let cellCol = 450

app.use(express.static("."));
app.get('/', function (req, res) {
    res.redirect('index.html');
});
server.listen(3000);
console.log('Port: 3000');

function findObj(matrix) {
    let value = 0;
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] == 1) {
                value = 1;
            }
            else if(matrix[y][x] == 0){
                value = 0;
            }
            let name = new Cell(x, y,value);
            allArr.push(name);
        }
    }
}

function generateMatrix(matLen, cellCol) {
    for (let i = 0; i < matLen; i++) {
        matrix[i] = [];
        for (let j = 0; j < matLen; j++) {
            matrix[i][j] = 0;
        }
    }
    for (let i = 0; i < cellCol; i++) {
        let x = Math.floor(Math.random() * matLen);
        let y = Math.floor(Math.random() * matLen);
        if (matrix[x][y] == 0) {
            matrix[x][y] = 1;
        }
    }
    return matrix;
}

function play() {
    for (let i in matrix) { console.log(`${matrix[i]}`) }
    console.log('\n');

    for (let i in allArr) {
        allArr[i].live()            
    }
    for (let i in allArr) {
        allArr[i].findIndex()            
    }
    io.sockets.emit("send matrix", matrix);
}


function restart(inputData){
    allArr = []
    matLen = inputData.matLen
    cellCol = inputData.cellCol
    generateMatrix(matLen, cellCol);
    findObj(matrix);
    io.sockets.emit("send matrix", matrix);
}

generateMatrix(matLen,cellCol)
findObj(matrix)
io.on('connection', (socket) => {
    io.sockets.emit("send matrix", matrix);
    socket.on("button pressed",(inputData) =>{
        restart(inputData)
    })
}) 
setInterval(play,500)
