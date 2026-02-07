var board = null;
var game = new Chess();

// Connecting your GitHub sounds
const moveSound = new Audio('sounds/move.mp3');
const captureSound = new Audio('sounds/capture.mp3');
const checkSound = new Audio('sounds/check.mp3');

function onDrop(source, target) {
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' 
    });

    if (move === null) return 'snapback';

    // Play your specific sounds
    if (move.captured) {
        captureSound.play();
    } else {
        moveSound.play();
    }
}

var config = {
    draggable: true,
    position: 'start',
    onDrop: onDrop
};
board = ChessBoard('myBoard', config);
