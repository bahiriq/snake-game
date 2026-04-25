const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('status');

let playerPos = 1;
const cellSize = 30; // Размер клетки
const boardSize = 10; // Поле 10x10

// Список ловушек (змеи) и бонусов (лестницы)
const special = { 
    3: 22, 5: 8, 11: 26, 20: 29, // Лестницы (вверх)
    27: 1, 21: 9, 17: 4, 19: 7   // Змеи (вниз)
};

// Функция расчета координат клетки
function getCoords(pos) {
    let row = Math.floor((pos - 1) / boardSize);
    let col = (pos - 1) % boardSize;
    if (row % 2 !== 0) col = (boardSize - 1) - col; // Зигзаг
    return {
        x: col * cellSize + cellSize / 2,
        y: canvas.height - (row * cellSize) - cellSize / 2
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем сетку
    for (let i = 1; i <= 100; i++) {
        const {x, y} = getCoords(i);
        ctx.strokeStyle = "#ccc";
        ctx.strokeRect(x - cellSize/2, y - cellSize/2, cellSize, cellSize);
    }

    // Рисуем игрока (красный шарик)
    const p = getCoords(playerPos);
    ctx.fillStyle = "#ff4757";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function rollDice() {
    const die = Math.floor(Math.random() * 6) + 1;
    playerPos += die;

    if (playerPos >= 100) {
        playerPos = 100;
        statusText.innerText = "ФИНИШ! Вы победили! 🎉";
    } else {
        if (special[playerPos]) {
            const isUp = special[playerPos] > playerPos;
            statusText.innerText = `Выпало: ${die}. ` + (isUp ? "ЛЕСТНИЦА! ↑" : "ЗМЕЯ! ↓");
            playerPos = special[playerPos];
        } else {
            statusText.innerText = `Выпало: ${die}. Текущая клетка: ${playerPos}`;
        }
    }
    draw();
}

draw();
