const game = new Chess();

const sounds = {
  move: new Audio("sounds/move.mp3"),
  capture: new Audio("sounds/capture.mp3"),
  check: new Audio("sounds/check.mp3"),
  checkmate: new Audio("sounds/checkmate.mp3")
};

function playSound(type) {
  if (sounds[type]) {
    sounds[type].currentTime = 0;
    sounds[type].play();
  }
}

const board = Chessboard('board', {
  draggable: true,
  position: 'start',

  onDrop: function (source, target) {
    const move = game.move({
      from: source,
      to: target,
      promotion: 'q'
    });

    if (move === null) return 'snapback';

    if (move.captured) {
      playSound("capture");
    } else {
      playSound("move");
    }

    if (game.in_checkmate()) {
      playSound("checkmate");
      alert("CHECKMATE!");
    } else if (game.in_check()) {
      playSound("check");
    }
  }
});
