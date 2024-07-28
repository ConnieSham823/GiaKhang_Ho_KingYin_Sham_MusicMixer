console.log("JavaScript is connected");

// Variables

const dropZones = document.querySelectorAll(".drop-zone");
const resetButton = document.getElementById("resetBut");
const pandaPiecesDivs = document.querySelectorAll("#panda > div");
const spotlights = document.querySelectorAll(".spotlight");
const performerTexts = document.querySelectorAll(".performer-text");
const likeSound = new Audio("sounds/like.mp3");
const dislikeSound = new Audio("sounds/dislike.mp3");

// Event Listeners
pandaPiecesDivs.forEach(piece => {
    piece.addEventListener("dragstart", handleStartDrag);
    piece.setAttribute("draggable", "true");
    console.log(`Added draggable attribute and event listener to ${piece.id}`);
});

dropZones.forEach(zone => {
    zone.addEventListener("dragover", handleOver);
    zone.addEventListener("drop", handleDrop);
});

// Event listeners for like and dislike buttons
document.getElementById("like").addEventListener("click", function() {
    likeSound.currentTime = 0; // Rewind to start
    likeSound.play();
});

document.getElementById("dislike").addEventListener("click", function() {
    dislikeSound.currentTime = 0; // Rewind to start
    dislikeSound.play();
});


resetButton.addEventListener("click", resetPandaPieces);