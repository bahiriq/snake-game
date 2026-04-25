const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('status');

let playerPos = 1;
const cellSize = 30;
const boardSize = 10;

// Оформление в стиле нард
const colors = {
    board: '#d2b48c', // Цвет дерева
    border: '#8b4513',
    player: '#e74c3c'
};

const special = { 
    3: 22, 5: 8, 11: 26, 20: 29, // Лестницы
    27: 1, 21: 9, 17: 4, 19: 7   // Змеи
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

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем "деревянное" основание
    ctx.fillStyle = colors.board;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 1; i <= 100; i++) {
        const {x, y} = getCoords(i);
        
        // Клетки как на доске
        ctx.strokeStyle = colors.border;
        ctx.strokeRect(x - cellSize/2, y - cellSize/2, cellSize, cellSize);
        
        // Номера клеток (как в нард)
        ctx.fillStyle = "rgba(139, 69, 19, 0.3)";
        ctx.font = "10px Arial";
        ctx.fillText(i, x - 12, y + 12);
    }

    // Рисуем Змей и Лестницы линиями
    for (let start in special) {
        const from = getCoords(parseInt(start));
        const to = getCoords(special[start]);
        
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.lineWidth = 3;
        ctx.strokeStyle = special[start] > start ? "#2ecc71" : "#e74c3c";
        ctx.stroke();
        ctx.lineWidth = 1;
    }

    // Игрок (фишка)
    const p = getCoords(playerPos);
    ctx.fillStyle = colors.player;
    ctx.shadowBlur = 5;
    ctx.shadowColor = "black";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function rollDice() {
    const die = Math.floor(Math.random() * 6) + 1;
    
    // Эффект броска (простая задержка)
    statusText.innerText = "Кубики крутятся...";
    
    setTimeout(() => {
        playerPos += die;
        if (playerPos >= 100) playerPos = 100;

        if (special[playerPos]) {
            playerPos = special[playerPos];
            statusText.innerText = `🎲 Выпало: ${die}. Переход!`;
        } else {
            statusText.innerText = `🎲 Выпало: ${die}. Клетка: ${playerPos}`;
        }
        drawBoard();
    }, 300);
}

drawBoard();
