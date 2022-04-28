const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require('socket.io');
const {
    userJoin,
    getAllUserInRoom,
    getCurrentUser,
    gameLobbyUpdate,
    whoseTurn,
    removeGameLobby,
    make_admin,
    deleteUserByid,
    isAdmin,
    next_person,
    getTurn,
    reduceTurn,
    get_admin,
} = require("./util/users");


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "Static")));

io.on('connection', socket => {

    socket.on("joining", (username, code, role) => {
        const user = userJoin(socket.id, username, code);
        socket.join(user.room);
        if (role == 1)
            make_admin(user.room, socket.id);
        io.in(user.room).emit("playerJoined", getAllUserInRoom(code));
    })
    socket.on("startGame", code => {
        gameLobbyUpdate(code.toString());
        io.in(code.toString()).emit("gameStarted");
    })
    socket.on("playing", code => {
        io.in(code.toString()).emit("Playing");
    });
    socket.on("Ready", (room) => {
        if (room) {
            room = room.toString();
            turn = whoseTurn(room);
            io.in(room).emit('play', turn);
        }
    });
    socket.on("selected", (ele, room) => {
        io.in(room.toString()).emit('compute', ele);
    })

    socket.on("gameWon", (room, id) => {
        user = getCurrentUser(id);
        io.in(room.toString()).emit("gameWon", user);
        removeGameLobby(room);
    })

    socket.on('disconnect', () => {
        let obj = deleteUserByid(socket.id);
        if (obj) {
            user = obj.user;
            turn = obj.i;

            if (isAdmin(socket.id, user.room)) {
                nextPerson = next_person(user.room);
                if (nextPerson != '') {
                    io.to(nextPerson.id).emit("make_admin");
                    make_admin(nextPerson.room, nextPerson.id)
                } else {
                    removeGameLobby(user.room);
                    //ERROR404
                }
            }

            allUser = getAllUserInRoom(user.room);

            if (allUser.length == 0) {
                removeGameLobby(user.room);
                //ERROR404
            } else {
                io.in(user.room).emit("playerJoined", allUser);
            }

            let playingTurn = getTurn(user.room);
            if (playingTurn != -1) {
                if (turn <= playingTurn) {
                    reduceTurn(user.room);
                }
            }
        }
    })

})

app.get("/won/:user", (req, res) => {

    res.render("won.pug");
})

//Port intialize
const PORT = process.env.PORT || 3000;

//port start
server.listen(PORT, () => {});