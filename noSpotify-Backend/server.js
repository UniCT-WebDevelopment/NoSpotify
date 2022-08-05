require('rootpath')();
// const express = require('express');
// const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
const jwtValid = require('jsonwebtoken');
const config = require('config.json');
var path = require('path');

const secret = config.secret;

var uuid = require('uuid');




const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
// const io = new Server(server);

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
        allowEIO3: true
    }
});
const allowed = [
    '.js',
    '.css',
    '.png',
    '.jpg'
  ];
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('dist/noSpotify-Frontend'));

// app.use(jwt());

app.use('/users', require('./users/users.controller'));
app.use('/youtube', require('./youtube/youtube.controller'));


// app.get('*', function(req,res) {
//     res.sendFile(path.resolve('dist/angular-registration-login-example/index.html'));
// });

app.get('*', (req, res) => {
    if (allowed.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
       res.sendFile(path.resolve(`dist/noSpotify-frontend/${req.url}`));
    } else {
       res.sendFile(path.join(__dirname, 'dist/noSpotify-frontend/index.html'));
    }
 });


app.use(errorHandler);


roomsObjList = {};
usersObjList = {};




io.on('connection', (socket) => {
    let newRoomId = uuid.v4();
    roomsObjList[newRoomId] = { owner: socket.id, users: [], banned: [] };
    usersObjList[socket.id] = newRoomId;
    socket.join(newRoomId);

    socket.on('disconnect', () => {
        try {


            if (roomsObjList[usersObjList[socket.id]] && usersObjList[socket.id]) {


            

                const clients = io.sockets.adapter.rooms.get(usersObjList[socket.id]);

                //to get the number of clients in this room
                const numClients = clients ? clients.size : 0;
                
                //to just emit the same event to all members of a room
                io.to(usersObjList[socket.id]).emit('error', "L' host si è disconnesso");
                

                if(clients)
                for (const clientId of clients ) {
                
                     //this is the socket of each client in the room.
                     const clientSocket = io.sockets.sockets.get(clientId);
                
                     //you can do whatever you need with this
                   

                     let newRoomId = uuid.v4();
                     Array.from(clientSocket.rooms).forEach((roomId) => {
                        clientSocket.leave(roomId);
                   });                     clientSocket.join(newRoomId);
                     clientSocket.emit("roomInfo",null);

                
                }




                    delete roomsObjList[usersObjList[socket.id]];
                    delete usersObjList[socket.id];
                // });

            }



        } catch (e) {
            console.log(e);
        }


      let roomId =   removeUserFromRoom(socket.id);

      if(roomId)
      {
          let objToSend = JSON.parse(JSON.stringify(roomsObjList[roomId]));
          objToSend["roomId"]=roomId
          socket.server.in(roomId).emit("roomInfo",JSON.stringify(objToSend));
      }

        console.log('user disconnected');

    }

    );



    socket.on('disconnectFromRoom', () => {
        try {

            if (roomsObjList[usersObjList[socket.id]] && usersObjList[socket.id]) {


            

                const clients = io.sockets.adapter.rooms.get(usersObjList[socket.id]);

                //to get the number of clients in this room
                const numClients = clients ? clients.size : 0;
                
                //to just emit the same event to all members of a room
                io.to(usersObjList[socket.id]).emit('error', "L' host si è disconnesso");
                
                for (const clientId of clients ) {
                
                     //this is the socket of each client in the room.
                     const clientSocket = io.sockets.sockets.get(clientId);
                
                     //you can do whatever you need with this
                   

                     let newRoomId = uuid.v4();
                     Array.from(clientSocket.rooms).forEach((roomId) => {
                        clientSocket.leave(roomId);
                   });
                     clientSocket.join(newRoomId);
 
                     clientSocket.emit("roomInfo",null);
                
                }




                    delete roomsObjList[usersObjList[socket.id]];
                    delete usersObjList[socket.id];
                // });

            }


            let roomId =   removeUserFromRoom(socket.id);


            let newRoomId = uuid.v4();

            Array.from(socket.rooms).forEach((roomId) => {
                socket.leave(roomId);
           });


            socket.join(newRoomId);
            socket.emit("roomInfo", null)

            if(roomId)
            {
                let objToSend = JSON.parse(JSON.stringify(roomsObjList[roomId]));
                objToSend["roomId"]=roomId
                socket.server.in(roomId).emit("roomInfo",JSON.stringify(objToSend));
            }

      





        } catch (e) {
            console.log(e);
        }

        console.log('user disconnected');

    }

    );

    //TODO IMPLEMENT USER EXIT NON HOST FROM CURRENT ROOM


    socket.on('joinToOtherRoom', (obj) => {
        roomId = null;
        userData = null;

        try {
            let objJson = JSON.parse(obj)
            if (objJson.roomId && objJson.userData) {
                roomId = objJson.roomId;
                userData = objJson.userData;
            } else {
                socket.emit('error', "Errore di comunicazione");
            }
            payload = jwtValid.verify(userData.token, secret);

        } catch (e) {
            socket.emit('error', "Errore di comunicazione");
        }


        if (roomsObjList[roomId]) {
            Array.from(socket.rooms).forEach((roomId) => {
                socket.leave(roomId);
           });
            socket.join(roomId);
            delete userData.token;
            roomsObjList[roomId].users.push({ socketId: socket.id, user: userData });
            try {
                delete roomsObjList[usersObjList[socket.id]];
                delete usersObjList[socket.id];
            } catch (e) {
                console.log(e);
            }

            let objToSend = JSON.parse(JSON.stringify(roomsObjList[roomId]));
            objToSend["roomId"]=roomId
            // socket.emit("roomInfo", JSON.stringify(objToSend))

            socket.server.in(roomId).emit("roomInfo",JSON.stringify(objToSend));
            socket.server.in(roomId).emit("roomJoined",true);


        } else {
            socket.emit('error', "La stanza non è disponibile");
        }
    });


    socket.on('sendPlayerState', (obj) => {

        userData = null;
        let objJson = JSON.parse(obj)

        try {
            if (objJson && objJson.userData && objJson.playerState) {
                userData = objJson.userData;
            } else {
                socket.emit('error', "Errore di comunicazione");
                return;
            }
            payload = jwtValid.verify(userData.token, secret);

        } catch (e) {
            socket.emit('error', "Errore di comunicazione");
            return;
        }


        try {
            if(usersObjList[socket.id]){

                if(roomsObjList[usersObjList[socket.id]] && roomsObjList[usersObjList[socket.id]].owner == socket.id){
                    // socket.server.in(usersObjList[socket.id]).emit("playerState",JSON.stringify(objJson.playerState));

   
                    socket.broadcast.to(usersObjList[socket.id]).emit("playerState",JSON.stringify(objJson.playerState));
                    
                }
            }
        } catch (e) {
            console.log(e)
        }

        return;
    });


    socket.on('initRoom', (obj) => {

        userData = null;
        try {
            let objJson = JSON.parse(obj)
            if (objJson && objJson.userData) {
                userData = objJson.userData;
            } else {
                socket.emit('error', "Errore di comunicazione");
                return;
            }
            payload = jwtValid.verify(userData.token, secret);

        } catch (e) {
            socket.emit('error', "Errore di comunicazione");
            return;
        }


        try {
            delete roomsObjList[usersObjList[socket.id]];
            delete usersObjList[socket.id];
        } catch (e) {
            console.log(e);
        }

        let newRoomId = uuid.v4();
        roomsObjList[newRoomId] = { owner: socket.id, users: [], banned: [] };
        usersObjList[socket.id] = newRoomId;
        Array.from(socket.rooms).forEach((roomId) => {
            socket.leave(roomId);
       });
        socket.join(newRoomId);

        try {
            socket.emit("roomInfo", JSON.stringify({ owner: socket.id,roomId: newRoomId, banned: [], users: [] }))

        } catch (e) {
            console.log(e)
        }

        return;
    });


});




server.listen(4000, () => {
    console.log('listening on *:4000');
});



function removeUserFromRoom(socketId) {
    let found = false;let i = 0;let k = 0;

    if (!roomsObjList) return;
    

    for ( i = 0;i< Object.keys(roomsObjList).length;i++){
       k = 0;
        for(let user of roomsObjList[Object.keys(roomsObjList)[i]].users){
            if(user.socketId == socketId){
                found = true;break;
            }
            k++;
        }
        if(found== true) break;

    }


      //  console.log(roomsObjList[Object.keys(roomsObjList)[i]],i)
      if(found)
      roomsObjList[Object.keys(roomsObjList)[i]].users.splice(k,1)

      return Object.keys(roomsObjList)[i];
}