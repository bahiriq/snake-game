const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('status');

let playerPos = 1;
const cellSize = 35;
const boardSize = 10;

// Специальные клетки: лестницы (вверх) и змеи (вниз)
const special = { 
    3: 22, 5: 8, 11: 26, 20: 29, 36: 55, 45: 70, // Лестницы
    27: 1, 21: 9, 17: 4, 19: 7, 99: 5, 66: 30    // Змеи
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

function drawLadder(from, to) {
    ctx.strokeStyle = '#f3e5ab';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(from.x - 5, from.y); ctx.lineTo(to.x - 5, to.y);
    ctx.moveTo(from.x + 5, from.y); ctx.lineTo(to.x + 5, to.y);
    ctx.stroke();
    // Перекладины
    ctx.lineWidth = 2;
    for (let i = 0.2; i < 1; i += 0.2) {
        let lx = from.x + (to.x - from.x) * i;
        let ly = from.y + (to.y - from.y) * i;
        ctx.beginPath();
        ctx.moveTo(lx - 8, ly); ctx.lineTo(lx + 8, ly);
        ctx.stroke();
    }
}

function drawSnake(from, to) {
    ctx.strokeStyle = '#2ecc71';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    // Делаем змею извилистой
    const cp1x = from.x + 20; const cp1y = from.y + (to.y - from.y) / 3;
    const cp2x = to.x - 20; const cp2y = to.y - (to.y - from.y) / 3;
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, to.x, to.y);
    ctx.stroke();
    // Глаза змеи
    ctx.fillStyle = 'red';
    ctx.beginPath(); ctx.arc(from.x, from.y, 2, 0, Math.PI*2); ctx.fill();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. Фон (дерево)
    ctx.fillStyle = '#d2b48c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Сетка и цифры
    for (let i = 1; i <= 100; i++) {
        const {x, y} = getCoords(i);
        ctx.strokeStyle = '#8b4513';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - cellSize/2, y - cellSize/2, cellSize, cellSize);
        ctx.fillStyle = 'rgba(139, 69, 19, 0.4)';
        ctx.font = 'bold 10px Arial';
        ctx.fillText(i, x - 14, y + 14);
    }

    // 3. Рисуем лестницы и змей
    for (let start in special) {
        const from = getCoords(parseInt(start));
        const to = getCoords(special[start]);
        if (special[start] > start) drawLadder(from, to);
        else drawSnake(from, to);
    }

    // 4. Фишка Нард
    const p = getCoords(playerPos);
    // Тень
    ctx.shadowBlur = 10; ctx.shadowColor = 'black';
    // Основание фишки
    ctx.fillStyle = '#f3e5ab';
    ctx.beginPath(); ctx.arc(p.x, p.y, 14, 0, Math.PI * 2); ctx.fill();
    // Декор фишки
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(p.x, p.y, 10, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.stroke();
}

function rollDice() {
    const die = Math.floor(Math.random() * 6) + 1;
    playerPos += die;
    if (playerPos >= 100) { playerPos = 100; statusText.innerText = "ПОБЕДА! 🏆"; }
    else {
        if (special[playerPos]) {
            const up = special[playerPos] > playerPos;
            statusText.innerText = `🎲 Выпало: ${die}. ` + (up ? "ЛЕСТНИЦА! ↑" : "ЗМЕЯ! ↓");
            playerPos = special[playerPos];
        } else {
            statusText.innerText = `🎲 Выпало: ${die}. Ходишь на ${playerPos}`;
        }
    }
    draw();
}

draw();
