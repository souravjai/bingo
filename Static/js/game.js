const gamePage = document.getElementById("gamePage");
const motion = document.querySelector('.motion>span');
const head = document.querySelector('.head');
const gameStart = document.querySelector('.gameStart');
const players = document.querySelector('.players');
const list = document.querySelector('.list');
const room = document.getElementById("room");
const message = document.querySelector('.message>p');
const circle = document.querySelector('.circle');

const socket = io();

const url = new URL(window.location.href);
const username = url.searchParams.get("name");
var code = url.searchParams.get("code");
var role = code ? 0 : 1; //1:admin, 0:normal;
if (!code) code = Math.round(Math.random() * 10000);

var timeOut;

currentPlayer = "";
counter = 1;
gameStarted = 0;


/*
1. Fill all not filled boxes
*/

function fillBox() {
    document.querySelectorAll('.bingoArea>div').forEach(cur => {
        if (cur.innerText.length == 0) {
            cur.innerText = counter++;
            cur.classList.add('bingoSelected');
        }

        cur.id = cur.innerText;
    })
}

//Timer Working
function deplete() {
    if (motion.innerHTML == 0) {
        clearInterval(timeOut);
        if (role == 1)
            socket.emit("playing", code);
    } else {
        motion.innerText--;
    }
}

function timer() {
    if (motion.innerText == 0) {
        if (role == 1)
            randomSelection();
    } else {
        motion.innerText--;
    }
}

function randomSelection() {
    send_selected(document.querySelector(".bingo:not(.selected)").id);
}

/* 
1. Delete all player from the list.
2. Adds all player with newest player in the list
*/
function addPlayer(users) {

    while (players.hasChildNodes()) {
        players.removeChild(players.firstChild);
        list.removeChild(list.firstChild);
    }

    for (current of users) {
        div = document.createElement("div");
        div.classList.add("player");
        div.innerText = current;
        players.appendChild(div);

        list_div = document.createElement("div");
        list_div.classList.add("list_player");
        list_div.innerText = current;
        list.appendChild(list_div);

    }
}

function fillingBingo(id) {
    element = document.getElementById(id);
    if (element.innerText.length != 0)
        showOverlay("already selected");
    else {
        element.innerText = counter++;
        element.classList.add('bingoSelected');
    }
}

function clicked(id) {
    if (gameStarted == 1) {
        fillingBingo(id);
    }
    if (gameStarted == 2) {
        if (currentPlayer != socket.id)
            showOverlay("Wait For Your Turn!");
        else {
            if (document.getElementById(id).classList.contains("selected"))
                showOverlay(`${id} is already selected`);
            send_selected(id);
        }
    }
}

function reset() {
    counter = 1;
    document.querySelectorAll(".bingo").forEach(x => {
        x.classList.remove('bingoSelected');
        x.innerText = ""
    });
}



//Making header with code
head.innerText = `Players in this Room (Room Code: ${code})`;

//Admin will only have start button
if (role == 0) {
    gameStart.style.display = "none";
}

function hideOverlay() {
    document.querySelector(".overlay").style.display = "none";
}

function showOverlay(msg) {
    document.querySelector(".errorMessage").innerText = msg;
    document.querySelector(".overlay").style.display = "flex";
}