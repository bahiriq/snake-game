const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('status');

// Загружаем твою картинку (убедись, что файл на GitHub называется board.jpg)
const boardImg = new Image();
boardImg.src = 'board.jpg'; 

let playerPos = 1;
const boardSize = 10;
const cellSize = canvas.width / 10;

// Настройка переходов точно по твоей картинке
const special = { 
    2: 38, 7: 14, 8: 31, 15: 26, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 78: 98, 87: 94, // Лестницы
    16: 6, 46: 25, 49: 11, 62: 19, 64: 60, 74: 53, 89: 68, 92: 88, 95: 75, 99: 80 // Змеи
};

function getCoords(pos) {
    let row = Math.floor((pos - 1) / boardSize);
    let col = (pos - 1) % boardSize;
    if (row % 2 !== 0) col = (boardSize - 1) - col;
    return {
        x: col * cellSize + cellSize / 2,
        y: canvas.height - (row * cellSize) - cellSize / 2
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем твою картинку фоном
    if (boardImg.complete) {
        ctx.drawImage(boardImg, 0, 0, canvas.width, canvas.height);
    }

    // Рисуем фишку (яркую и заметную)
    const p = getCoords(playerPos);
    ctx.shadowBlur = 10;
    ctx.shadowColor = "black";
    ctx.fillStyle = "white"; 
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
}

function rollDice() {
    const die = Math.floor(Math.random() * 6) + 1;
    playerPos += die;
    if (playerPos >= 100) playerPos = 100;

    statusText.innerText = `🎲 Выпало: ${die}`;

    setTimeout(() => {
        if (special[playerPos]) {
            playerPos = special[playerPos];
            statusText.innerText = `🎲 Выпало: ${die}. Переход!`;
        }
        draw();
    }, 400);
    draw();
}

boardImg.onload = draw;
draw();
