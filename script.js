const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
const menu = document.getElementById('menu');
const playerVsPlayerButton = document.getElementById('player-vs-player');
const playerVsAiButton = document.getElementById('player-vs-ai');
const messageElement = document.getElementById('message');
let isCircleTurn = false;
let isPlayerVsAI = false;
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const handleClick = (e) => {
    const cell = e.target;
    const currentClass = isCircleTurn ? 'circle' : 'x';
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        if (isPlayerVsAI && !isCircleTurn) {
            setTimeout(aiMove, 500); // AI makes a move after a short delay
        }
    }
};

const placeMark = (cell, currentClass) => {
    cell.classList.add(currentClass);
};

const swapTurns = () => {
    isCircleTurn = !isCircleTurn;
};

const checkWin = (currentClass) => {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
};

const isDraw = () => {
    return [...cells].every(cell => {
        return cell.classList.contains('x') || cell.classList.contains('circle');
    });
};

const endGame = (draw) => {
    if (draw) {
        messageElement.textContent = 'It\'s a Draw!';
    } else {
        messageElement.textContent = `${isCircleTurn ? "O's" : "X's"} Wins! Congratulations!`;
    }
    messageElement.classList.remove('hidden');
    resetButton.classList.remove('hidden');
};

const resetGame = () => {
    cells.forEach(cell => {
        cell.classList.remove('x');
        cell.classList.remove('circle');
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    isCircleTurn = false;
    messageElement.classList.add('hidden');
    if (isPlayerVsAI) {
        setTimeout(aiMove, 500); // AI makes the first move after a short delay
    }
};

const aiMove = () => {
    const availableCells = [...cells].filter(cell => !cell.classList.contains('x') && !cell.classList.contains('circle'));
    if (availableCells.length === 0) return;
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    placeMark(randomCell, 'x');
    if (checkWin('x')) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
    }
};

playerVsPlayerButton.addEventListener('click', () => {
    isPlayerVsAI = false;
    menu.classList.add('hidden');
    board.classList.remove('hidden');
    resetButton.classList.remove('hidden');
    resetGame();
});

playerVsAiButton.addEventListener('click', () => {
    isPlayerVsAI = true;
    menu.classList.add('hidden');
    board.classList.remove('hidden');
    resetButton.classList.remove('hidden');
    resetGame();
});

resetButton.addEventListener('click', resetGame);

cells.forEach(cell => {
    cell.addEventListener('click', handleClick, { once: true });
});

// AI makes the first move when the game starts
setTimeout(aiMove, 500);
