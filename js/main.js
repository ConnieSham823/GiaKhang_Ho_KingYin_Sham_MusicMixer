console.log("JavaScript is connected");

// Variables

const dropZones = document.querySelectorAll(".drop-zone");
const resetButton = document.getElementById("resetBut");
const pandaPiecesDivs = document.querySelectorAll("#panda > div");
const spotlights = document.querySelectorAll(".spotlight");
const performerTexts = document.querySelectorAll(".performer-text");
const likeSound = new Audio("sounds/like.mp3");
const dislikeSound = new Audio("sounds/dislike.mp3");

const soundElements = {
    drum: new Audio("sounds/drum.mp3"),
    piano: new Audio("sounds/piano.mp3"),
    saxophone: new Audio("sounds/saxophone.mp3"),
    trumpet: new Audio("sounds/trumpet.mp3"),
    ukulele: new Audio("sounds/ukulele.mp3"),
    violin: new Audio("sounds/violin.mp3")
};

// Set looping for each sound element
Object.values(soundElements).forEach(sound => {
    sound.loop = true;
});
likeSound.loop = true;
dislikeSound.loop = true;

let draggedPiece = null;
let isPlaying = false; // To keep track of play/pause status
let isMuted = false; // To keep track of mute status
const volumeStep = 0.1; // Volume adjustment step
const defaultVolume = 0.5; // Initial volume level

// Store original parent containers and styles
const originalPositions = {};
const originalStyles = {};

pandaPiecesDivs.forEach(piece => {
    const parentId = piece.parentNode.id; // Assuming parent containers have IDs
    if (!originalPositions[parentId]) {
        originalPositions[parentId] = [];
    }
    originalPositions[parentId].push(piece);
    
    // Save original styles
    originalStyles[piece.id] = {
        width: piece.style.width,
        height: piece.style.height,
        top: piece.style.top,
        left: piece.style.left,
        transform: piece.style.transform,
        position: piece.style.position
    };
});

// Set initial volume for all sounds
function setInitialVolume() {
    Object.values(soundElements).forEach(sound => {
        sound.volume = defaultVolume;
    });
    likeSound.volume = defaultVolume;
    dislikeSound.volume = defaultVolume;
}

// Functions
function playPandaSound(pandaElement) {
    const soundType = pandaElement.dataset.sound; // Get the sound type from data-sound attribute
    const sound = soundElements[soundType]; // Get the corresponding audio element

    if (sound) {
        sound.currentTime = 0; // Rewind to start
        sound.play();
    } else {
        console.error("No sound element found for:", soundType);
    }
}

function pauseAllSounds() {
    Object.values(soundElements).forEach(sound => {
        sound.pause();
        sound.currentTime = 0; // Rewind to start
    });
    likeSound.pause();
    likeSound.currentTime = 0;
    dislikeSound.pause();
    dislikeSound.currentTime = 0;
}

function stopAllSounds() {
    // Stop all sounds
    pauseAllSounds();
    // Disable looping
    Object.values(soundElements).forEach(sound => {
        sound.loop = false;
    });
    likeSound.loop = false;
    dislikeSound.loop = false;
}

function handleStartDrag(event) {
    console.log(`Started dragging ${this.id}`);
    draggedPiece = event.target.closest('div'); // Ensure the draggable div is selected
    console.log(`draggedPiece set to:`, draggedPiece);
}

function handleOver(event) {
    event.preventDefault();
    console.log("Dragged Over");
}

function handleDrop(event) {
    event.preventDefault();
    console.log("Dropped");

    // Ensure drop zone is not occupied
    if (this.children.length > 0) {
        console.log("Drop zone already occupied");
        return;
    }

    console.log(`draggedPiece in handleDrop:`, draggedPiece);

    // Ensure draggedPiece is a Node
    if (draggedPiece && draggedPiece.nodeType === Node.ELEMENT_NODE) {
        this.appendChild(draggedPiece);

        // Show the spotlight and performer text associated with this drop zone
        const spotlight = this.parentNode.querySelector(".spotlight");
        if (spotlight) {
            spotlight.style.display = "block";
        }
        const performerText = this.parentNode.querySelector(".performer-text");
        if (performerText) {
            performerText.style.display = "block";
        }

        // Play the sound associated with the dropped panda
        if (isPlaying) {
            playPandaSound(draggedPiece.querySelector("img")); // Pass the img element to play sound
        }
    } else {
        console.error("draggedPiece is not a Node or is null", draggedPiece);
    }

    // Reset draggedPiece to null after dropping
    draggedPiece = null;
}

function resetPandaPieces() {
    // Clear all drop zones
    dropZones.forEach(zone => {
        while (zone.firstChild) {
            zone.removeChild(zone.firstChild);
        }
    });

    // Restore original panda pieces to their original parent containers
    Object.keys(originalPositions).forEach(parentId => {
        const parentContainer = document.getElementById(parentId);
        if (parentContainer) {
            originalPositions[parentId].forEach(piece => {
                parentContainer.appendChild(piece);
                // Restore original styles
                piece.style.width = originalStyles[piece.id].width;
                piece.style.height = originalStyles[piece.id].height;
                piece.style.top = originalStyles[piece.id].top;
                piece.style.left = originalStyles[piece.id].left;
                piece.style.transform = originalStyles[piece.id].transform;
                piece.style.position = originalStyles[piece.id].position;
            });
        }
    });

    // Ensure all panda pieces are visible again
    pandaPiecesDivs.forEach(piece => {
        piece.style.display = "block";
    });

    // Hide all spotlights and performer texts again
    spotlights.forEach(light => {
        light.style.display = "none";
    });

    performerTexts.forEach(text => {
        text.style.display = "none";
    });

    // Stop all sounds
    stopAllSounds();
}

function adjustVolume(increase) {
    const volumeAdjustment = increase ? volumeStep : -volumeStep;

    Object.values(soundElements).forEach(sound => {
        if (!sound.muted) { // Only adjust volume if not muted
            sound.volume = Math.min(Math.max(sound.volume + volumeAdjustment, 0), 1);
            console.log(`Adjusted ${sound.src} volume to: ${sound.volume}`); // Log volume for debugging
        }
    });
    if (!likeSound.muted) {
        likeSound.volume = Math.min(Math.max(likeSound.volume + volumeAdjustment, 0), 1);
        console.log(`Adjusted likeSound volume to: ${likeSound.volume}`); // Log volume for debugging
    }
    if (!dislikeSound.muted) {
        dislikeSound.volume = Math.min(Math.max(dislikeSound.volume + volumeAdjustment, 0), 1);
        console.log(`Adjusted dislikeSound volume to: ${dislikeSound.volume}`); // Log volume for debugging
    }
}

function toggleMute() {
    isMuted = !isMuted;
    Object.values(soundElements).forEach(sound => {
        sound.muted = isMuted;
    });
    likeSound.muted = isMuted;
    dislikeSound.muted = isMuted;
}

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


// Event listeners for play, pause, stop, plus, deduce, and sound buttons
document.getElementById("play").addEventListener("click", function() {
    isPlaying = true;
    // Start playing sounds for pandas currently in drop zones
    dropZones.forEach(zone => {
        if (zone.children.length > 0) {
            const pandaImg = zone.children[0].querySelector("img");
            playPandaSound(pandaImg); // Play sound of pandas in the drop zones
        }
    });
});

document.getElementById("pause").addEventListener("click", pauseAllSounds);

document.getElementById("stop").addEventListener("click", stopAllSounds);

resetButton.addEventListener("click", resetPandaPieces);

document.getElementById("plus").addEventListener("click", function() {
    adjustVolume(true); // Increase volume
});

document.getElementById("deduce").addEventListener("click", function() {
    adjustVolume(false); // Decrease volume
});

document.getElementById("sound").addEventListener("click", toggleMute);

resetButton.addEventListener("click", resetPandaPieces);

// Initialize volume when the script loads
setInitialVolume();