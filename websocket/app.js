
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.io = require("socket.io")();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//방 변수들
let pairmamber = 2;
let roomId = 1;
let order = 1;

//새 웹 소켓 접속시
app.io.on("connection", (socket) => {
    console.log("새로 접속.");
    
    //방만들기
    console.log(roomId);
    socket.join(roomId);
    socket.emit("roomIdPass",roomId);
    // roomID -> socket.id로해도될듯

    if(order % pairmamber == 0){
        roomId++;
    }
    order++;
    

    socket.on("disconnect", () => {
        console.log("접속 끊어짐.");
    });

    
    socket.on("update", (data) => {
        console.log(data.event, data.delta, data.roomId);
        
        socket.to(data.roomId).emit("update", data);
    })
})

module.exports = app;
