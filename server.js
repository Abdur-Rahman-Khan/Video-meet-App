const express=require('express');
const app=express();
const server=require('http').Server(app);
const io=require('socket.io')(server);
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}))
// const {v4:uuidV4}= require('uuid');



app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/',(req,res)=>{
    // res.redirect(`/${uuidV4()}`)
    res.render('home');
    // res.redirect(`/${randString()}`)

});
app.post('/',(req,res)=>{
    // res.redirect(`/${uuidV4()}`)
    res.render('home');
    // res.redirect(`/${randString()}`)

});
app.post('/room',(req,res)=>{
    // console.log(req,res);
    // console.log((req.body.RoomID));
    res.redirect(`/${req.body.RoomID}`)
});

app.post('/rand-room',(req,res)=>{
    res.redirect(`/${randString()}`)
});

app.get('/:room',(req,res)=>{
    res.render('room',{roomId: req.params.room})
});

server.listen(process.env.PORT,(e)=>{
    console.log(`listening on port 3000`);
    
});

io.on('connection',(socket)=>{
    socket.on('join-room',(roomId,userId)=>{
        // console.log(roomId,userId);
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