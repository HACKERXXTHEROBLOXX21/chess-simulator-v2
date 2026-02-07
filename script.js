var board = null;
var game = new Chess();
var engine = typeof STOCKFISH === 'function' ? STOCKFISH() : null;

// 1. Translations
const i18n = {
    en: { title: "Analysis", white: "White to move", black: "Black to move", check: "Check!", checkmate: "Checkmate!", undo: "Undo", reset: "Reset" },
    vi: { title: "Phân tích", white: "Lượt Trắng", black: "Lượt Đen", check: "Chiếu!", checkmate: "Chiếu bí!", undo: "Hoàn tác", reset: "Làm mới" },
    km: { title: "ការវិភាគ", white: "វេនពណ៌ស", black: "វេនពណ៌ខ្មៅ", check: "ឆែក!", checkmate: "ស្មោះត្រង់!", undo: "មិនធ្វើវិញ", reset: "កំណត់ឡើងវិញ" },
    // Add others here...
};

let currentLang = 'en';

// 2. Sounds
const sounds = {
    move: new Audio('sounds/move.mp3'),
    capture: new Audio('sounds/capture.mp3'),
    check: new Audio('sounds/check.mp3'),
    checkmate: new Audio('sounds/checkmate.mp3'),
    castling: new Audio('sounds/castling.mp3')
};

// 3. Engine Analysis
if (engine) {
    engine.onmessage = function(event) {
        if (event.includes('score cp')) {
            const score = parseInt(event.split('score cp ')[1]);
            const percentage = 50 - (score / 100); 
            $('#eval-fill').css('height', Math.max(0, Math.min(100, percentage)) + '%');
            $('#engine-status').text("Eval: " + (score/100).toFixed(1));
        }
    };
}

function updateAnalysis() {
    if (engine) {
        engine.postMessage('position fen ' + game.fen());
        engine.postMessage('go depth 15');
    }
}

function onDrop(source, target) {
    var move = game.move({ from: source, to: target, promotion: 'q' });
    if (move === null) return 'snapback';

    // Sound Logic
    if (game.in_checkmate()) sounds.checkmate.play();
    else if (game.in_check()) sounds.check.play();
    else if (move.flags.includes('k') || move.flags.includes('q')) sounds.castling.play();
    else if (move.flags.includes('c') || move.flags.includes('e')) sounds.capture.play();
    else sounds.move.play();

    updateUI();
    updateAnalysis();
}

function updateUI() {
    const t = i18n[currentLang];
    const turn = game.turn() === 'w' ? t.white : t.black;
    $('#ui-title').text(t.title);
    $('#ui-undo').text(t.undo);
    $('#ui-reset').text(t.reset);
    
    let statusText = turn;
    if (game.in_checkmate()) statusText = t.checkmate;
    else if (game.in_check()) statusText += " - " + t.check;
    $('#status').text(statusText);
}

// Language Switcher
$('#lang-select').on('change', function() {
    currentLang = $(this).val();
    updateUI();
});

function undoMove() {
    game.undo();
    board.position(game.fen());
    updateUI();
}

var config = {
    draggable: true,
    position: 'start',
    onDrop: onDrop,
    onSnapEnd: () => board.position(game.fen())
};
board = ChessBoard('myBoard', config);
updateUI();
