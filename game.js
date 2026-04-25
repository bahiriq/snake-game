const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('status');

// Прямые ссылки на качественную графику
const imgSnake = new Image(); imgSnake.src = 'https://flaticon.com';
const imgLadder = new Image(); imgLadder.src = 'https://flaticon.com';
const imgChip = new Image(); imgChip.src = 'https://flaticon.com'; // Фишка нард

let playerPos = 1;
const cellSize = 35;
const boardSize = 10;

// Оставляем только важные переходы
const special = { 
    3: 22, 11: 26, 36: 55, 45: 70, // Лестницы
    27: 1, 21: 9, 17: 4, 99: 5, 66: 30 // Змеи
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
    
    // 1. Фон (Темное дерево)
    ctx.fillStyle = '#4a2c1d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Клетки с золотистой обводкой
    for (let i = 1; i <= 100; i++) {
        const {x, y} = getCoords(i);
        ctx.strokeStyle = '#8b4513';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - cellSize/2, y - cellSize/2, cellSize, cellSize);
        
        ctx.fillStyle = '#f3e5ab';
        ctx.font = 'bold 9px serif';
        ctx.fillText(i, x - 15, y + 15);
    }

    // 3. Рисуем только иконки на клетках (без линий-каракулей)
    for (let start in special) {
        const from = getCoords(parseInt(start));
        const isUp = special[start] > start;
        const img = isUp ? imgLadder : imgSnake;
        
        if (img.complete) {
            ctx.drawImage(img, from.x - 12, from.y - 12, 25, 25);
        }
    }

    // 4. Реалистичная фишка
    const p = getCoords(playerPos);
    if (imgChip.complete) {
        ctx.shadowBlur = 10; ctx.shadowColor = 'black';
        ctx.drawImage(imgChip, p.x - 15, p.y - 15, 30, 30);
        ctx.shadowBlur = 0;
    }
}

function rollDice() {
    const die = Math.floor(Math.random() * 6) + 1;
    playerPos += die;
    if (playerPos >= 100) playerPos = 100;

    if (special[playerPos]) {
        playerPos = special[playerPos];
        statusText.innerText = `🎲 Зары: ${die}. Переход!`;
    } else {
        statusText.innerText = `🎲 Зары: ${die}. Клетка: ${playerPos}`;
    }
    draw();
}

// Авто-обновление при загрузке картинок
[imgSnake, imgLadder, imgChip].forEach(img => img.onload = draw);
draw();
