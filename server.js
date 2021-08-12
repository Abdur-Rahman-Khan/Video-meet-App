const express=require('express');
const app=express();
const server=require('http').Server(app);
const io=require('socket.io')(server);
// const {v4:uuidV4}= require('uuid');



app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/',(req,res)=>{
    // res.redirect(`/${uuidV4()}`)
    res.redirect(`/${randString()}`)

});

app.get('/:room',(req,res)=>{
    res.render('room',{roomId: req.params.room})
});

server.listen(3000,(e)=>{
    console.log(`listening on port 3000`);
    
});

io.on('connection',(socket)=>{
    socket.on('join-room',(roomId,userId)=>{
        console.log(roomId,userId);
        socket.join(roomId);
        socket.to(roomId).emit('user-connected',userId);
        socket.on('disconnect',()=>{
            socket.to(roomId).emit('user-disconnect',userId);
        })
    })
});


/*****************************Functions-Utility ***********************/

//Function to get random ID for room
function randString(){
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    length=11;
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        if(i==3||i==7){
            result+='-';
            continue;
        }
      result += characters.charAt(Math.floor(Math.random() * (charactersLength)));
   }
   return result;
}