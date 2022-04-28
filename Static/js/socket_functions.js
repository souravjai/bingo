//Sending Joining req to server
socket.emit("joining", username, code, role);

socket.on("playerJoined", users => {
    addPlayer(users);
})

function send_selected(id) {
    currentPlayer = "";
    socket.emit("selected", document.getElementById(id).innerText, code);
}

function startGame() {
    socket.emit("startGame", code);
}

socket.on('compute', ele => {
    clearInterval(timeOut);
    circle.style.animation = "none";
    motion.innerText = "5";

    document.getElementById(ele).classList.add("selected");
    message.innerText = `${ele} was selected`;

    if (role == 1) {
        setTimeout(replay, 1500);
    }

    check();
})

function replay() {
    socket.emit("Ready", code);
}

socket.on("gameWon", user => {
    // console.log(user);
    window.location = `won/${user.username}`;
});
socket.on("gameStarted", () => {
    room.style.display = "none";
    gamePage.style.display = "block";
    message.innerText = `Fill the bingo Cell`;
    circle.style.animation = "circleAnimation 15s linear";
    gameStarted = 1;
    timeOut = setInterval(deplete, 1000);
})

socket.on("Playing", () => {
    circle.style.animation = "none";
    fillBox();
    document.getElementById("reset").style.display = "none";
    gameStarted = 2;
    if (role == 1)
        socket.emit("Ready", code);
});

socket.on("play", turn => {
    // console.log(turn);
    // console.log(socket.id);

    currentPlayer = turn[1];
    for (item of list.children) {
        item.classList.remove('selected');
    }
    current_player = list.children[turn[0]];
    current_player.classList.add('selected');
    message.innerText = `${current_player.innerText}'s Turn`;

    circle.style.animation = "circleAnimation 5s linear 1";
    motion.innerText = 5;

    timeOut = setInterval(timer, 1000);

})

socket.on('make_admin', () => {
    role = 1;
    if (gameStarted == 0) {
        gameStart.style.display = "flex";
    }
});

socket.on('sendRandomSelect', () => {
    if (role == 1) {
        randomSelection();
    }
})