won = 0;

function check() {
    won = 0;
    bingo = document.querySelector(".bingoArea").children;
    auxilary = [];


    for (var i = 1; i < 26; i += 5) {
        auxilary = [];
        auxilary.push(bingo[i], bingo[i + 1], bingo[i + 2], bingo[i + 3], bingo[i + 4]);
        found(auxilary);
    }
    for (var i = 1; i < 6; i++) {
        auxilary = [];
        auxilary.push(bingo[i], bingo[i + 5], bingo[i + 10], bingo[i + 15], bingo[i + 20]);
        found(auxilary);
    }

    auxilary = [];
    auxilary.push(bingo[1], bingo[7], bingo[13], bingo[19], bingo[25]);
    found(auxilary);

    auxilary = [];
    auxilary.push(bingo[5], bingo[9], bingo[13], bingo[17], bingo[21]);
    found(auxilary);

    updater();

    if (won > 4) {
        socket.emit("gameWon", code, socket.id);
    }
}



function found(aux) {
    for (item of aux) {
        if (!item.classList.contains('selected'))
            return;
    }
    won++;
    for (item of aux) {
        item.classList.add("won");
    }
}

function updater() {
    HeaderChildren = document.querySelector("header").children;

    for (var i = 0; i < 5 && i < won; i++) {
        HeaderChildren[i].style.color = "#05d138";
    }
}