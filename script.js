var board = null;
var game = new Chess();
var engine = typeof STOCKFISH === 'function' ? STOCKFISH() : null;

// 1. Translations
const i18n = {
    en: { title: "Analysis", white: "White to move", black: "Black to move", check: "Check!", checkmate: "Checkmate!", undo: "Undo", reset: "Reset" },
    vi: { title: "Phân tích", white: "Lượt Trắng", black: "Lượt Đen", check: "Chiếu!", checkmate: "Chiếu bí!", undo: "Hoàn tác", reset: "Làm mới" },
    km: { title: "ការវិភាគ", white: "វេនពណ៌ស", black: "វេនពណ៌ខ្មៅ", check: "ឆែក!", checkmate: "ស្មោះត្រង់!", undo: "មិនធ្វើវិញ", reset: "កំណត់ឡើងវិញ" },
    my: { title: "စီစစ်ချက်", white: "အဖြူရွှေ့ရန်", black: "အမည်းရွှေ့ရန်", check: "ချက်!", checkmate: "ချက်မိတ်!", undo: "နောက်ပြန်", reset: "ပြန်စတင်" },
    zh: { title: "分析", white: "白方走子", black: "黑方走子", check: "将军!", checkmate: "将死!", undo: "撤销", reset: "重置" },
    ja: { title: "解析", white: "白の番", black: "黒の番", check: "チェック!", checkmate: "チェックメイト!", undo: "待った", reset: "リセット" },
    ko: { title: "분석", white: "백 차례", black: "흑 차례", check: "체크!", checkmate: "체크메이트!", undo: "무르기", reset: "초기화" },
    es: { title: "Análisis", white: "Juegan blancas", black: "Juegan negras", check: "¡Jaque!", checkmate: "¡Jaque mate!", undo: "Deshacer", reset: "Reiniciar" },
    pt: { title: "Análise", white: "Brancas jogam", black: "Pretas jogam", check: "Xeque!", checkmate: "Xeque-mate!", undo: "Desfazer", reset: "Reiniciar" },
    fr: { title: "Analyse", white: "Aux blancs", black: "Aux noirs", check: "Échec!", checkmate: "Échec et mat!", undo: "Annuler", reset: "Réinitialiser" }
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

// 3. Engine Logic
if (engine) {
    engine.onmessage = function(event) {
        if (event.includes('score cp')) {
            const score = parseInt(event.split('score cp ')[1]);
            const percentage = 50 - (score / 100); 
            $('#eval-fill').css('height', Math.max(0, Math.min(100, percentage)) + '%');
            $('#engine-eval').text("Evaluation: " + (score/100).toFixed(1));
        }
    };
}

function updateAnalysis() {
    if (engine) {
        engine.postMessage('position fen ' + game.fen());
        engine.postMessage('go depth 12');
    }
}

// 4. Board Handlers
function onDrop(source, target) {
    var move = game.move({ from: source, to: target, promotion: 'q' });
    if (move === null) return 'snapback';

    // Play Sounds
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

function undoMove() {
    game.undo();
    board.position(game.fen());
    updateUI();
    updateAnalysis();
}

function resetGame() {
    game.reset();
    board.start();
    updateUI();
    $('#eval-fill').css('height', '50%');
}

// Language Switcher
$('#lang-select').on('change', function() {
    currentLang = $(this).val();
    updateUI();
});

// Initialization
var config = {
    draggable: true,
    position: 'start',
    onDrop: onDrop,
    onSnapEnd: () => board.position(game.fen()),
    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
};

board = ChessBoard('myBoard', config);
updateUI();
