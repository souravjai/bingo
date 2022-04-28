createButton = document.getElementById("create");
joinButton = document.getElementById("join");
roomInfo = document.getElementById("RoomInfo");



function createGame() {
    joinButton.style.display = "none";
    roomInfo.style.display = "block";
    document.getElementById("code").style.display = "none";
    document.getElementById("name").focus();

}

function joinGame() {
    createButton.style.display = "none";
    roomInfo.style.display = "block";
    document.getElementById("name").focus();

}