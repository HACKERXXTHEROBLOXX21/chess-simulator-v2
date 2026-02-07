const game = new Chess();

/* 🔊 Sounds */
const sounds = {
  move: new Audio("sounds/move.mp3"),
  capture: new Audio("sounds/capture.mp3"),
  castling: new Audio("sounds/castling.mp3"),
  check: new Audio("sounds/check.mp3"),
  checkmate: new Audio("sounds/checkmate.mp3")
};

function playSound(type) {
  const sound = sounds[type];
  if (!sound) return;
  sound.currentTime = 0;
  sound.play();
}

/* ♟️ Board */
const board = Chessboard("board", {
  position: "start",
  draggable: true,

  onDragStart: function (source, piece) {
    // Stop moving after game over
    if (game.game_over()) return false;

    // Only move current player's pieces
    if (
      (game.turn() === "w" && piece.startsWith("b")) ||
      (game.turn() === "b" && piece.startsWith("w"))
    ) {
      return false;
    }
  },

  onDrop: function (source, target) {
    const move = game.move({
      from: source,
      to: target,
      promotion: "q"
    });

    if (move === null) return "snapback";

    /* 🎵 Sound priority */
    if (move.flags.includes("k") || move.flags.includes("q")) {
      playSound("castling");
    } else if (move.captured) {
      playSound("capture");
    } else {
      playSound("move");
    }

    if (game.in_checkmate()) {
      playSound("checkmate");
      setTimeout(() => alert("♚ Checkmate!"), 100);
    } else if (game.in_check()) {
      playSound("check");
    }
  }
});
