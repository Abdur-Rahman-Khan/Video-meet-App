
const videoGrid=document.getElementById('video-grid');
const myVid=document.createElement('video');
myVid.muted=true;
const socket = io('/');
let users={}
const myPeerId=new Peer(undefined,{
    host: '/',
    port: '3001'
})

navigator.mediaDevices.getUserMedia({
    video:true,
    audio: true
}).then(stream=>{
    addVideoStream(myVid,stream);
    
    myPeerId.on('call',call=>{
        call.answer(stream);
        const video=document.createElement('video');
        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream)
        })
    })
    socket.on('user-connected',userId=>{
        connectToUser(userId,stream)
    }) 

})
socket.on('user-disconnect',userId=>{
    if(users[userId])
    users[userId].close()
})

myPeerId.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id)
})

// socket.on('user-connected',userid=>{
//     console.log(userid);
// });

/****Function-Utility **************/

function addVideoStream(vid,stream){
    vid.srcObject=stream;
    vid.addEventListener('loadedmetadata',()=>{
        vid.play()
    })
    videoGrid.append(vid)
}

function connectToUser(userId,stream){
    const call=myPeerId.call(userId,stream);
    const video=document.createElement('video');
    call.on('stream',userVideoStream=>{
        addVideoStream(video,userVideoStream);
    })
    call.on('close',()=>{
        video.remove();
    })
    users[userId]=call;
}