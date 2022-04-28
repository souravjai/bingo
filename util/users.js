const gameLobby = new Map();
const roomAdmin = new Map();
users = [];


function userJoin(id, username, room) {
    room = room.toString();
    const user = { id, username, room };
    users.push(user);
    return user;
}

function gameLobbyUpdate(room) {
    gameLobby.set(room, 0);

}

function removeAllUser(room) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].room == room) {
            users.splice(i, 1);
        }
    }
}

function removeGameLobby(room) {
    room = room.toString();
    gameLobby.delete(room);
    roomAdmin.delete(room);
    removeAllUser(room);
}

function whoseTurn(room) {
    room = room.toString();
    turn = gameLobby.get(room);
    let gusers = getUser(room);

    gameLobby.set(room, (turn + 1) % gusers.length);

    if (gusers[turn])
        return [turn, gusers[turn].id];

}

function getUser(room) {
    room = room.toString();
    return users.filter(user => user.room === room);
}

function getAllUserInRoom(room) {
    return getUser(room).map(user => user.username);
}

function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

function deleteUserByid(id) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            user = users[i];
            users.splice(i, 1);
            return { user, i };
        }
    }
}

function get_admin(room) {
    // console.log(roomAdmin);
    // console.log(roomAdmin.get(room));
    return roomAdmin.get(room);
}

function make_admin(room, id) {
    roomAdmin.set(room, id);
    // console.log(roomAdmin);
}

function isAdmin(id, room) {
    return roomAdmin.get(room) == id;
}

function next_person(room) {
    for (user of users) {
        if (user.room == room) {
            return user;
        }
    }
    return '';
}

function getTurn(room) {
    if (gameLobby.has(room))
        return gameLobby.get(room);
    else
        return -1;
}

function reduceTurn(room) {
    turn = gameLobby.get(room);
    if (turn != 0)
        gameLobby.set(room, turn - 1);
}

module.exports = {
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

};