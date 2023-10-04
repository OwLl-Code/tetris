const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const levelElem = document.getElementById("level");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const gameOver = document.getElementById("game-over");

const row = 20;  //столбцы
const col = 10; //колонки
const squareSize = 20; //размер квадрата
const probel = "black"; // цвет пустого квадрата

const nextcanvas = document.getElementById("nextcanvas");
const cn = nextcanvas.getContext("2d");


//var nextpiece = "T";



// создание квадрата
function draw(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x*squareSize,y*squareSize,squareSize,squareSize);

    ctx.strokeRect(x*squareSize,y*squareSize,squareSize,squareSize);
}

//создание поля
let board = [];
for( r = 0; r <row; r++){
    board[r] = [];
    for(c = 0; c < col; c++){
        board[r][c] = probel;
    }
}

// отрисовка поля через canvas
function drawBoard(){
    for( r = 0; r <row; r++){
        for(c = 0; c < col; c++){
            draw(c,r,board[r][c]); //рисуем квадрат
        }
    }
}
drawBoard();

//
const possibleFigures = [
    [Z,"red"],
    [S,"green"],
    [T,"yellow"],
    [O,"blue"],
    [L,"purple"],
    [I,"cyan"],
    [J,"orange"],
    [D,"#ff00f2"],
    [Q,"#e16e01"],
    [W,"#09b5f1"],
    [E,"#000bf9"],
    [R,"#00bbff"],
    [P,"#a603f3"],
    [U,"#71f901"],
    [A,"#ff009c"],
    [F,"#fbfbfb"],
    [G,"#e9fb72"],
    [H,"#787bf4"],
];

// рандом фигур
function rand(){

    let r = randomN = Math.floor(Math.random() * possibleFigures.length)
    return new Piece( possibleFigures[r][0],possibleFigures[r][1]);
}
let p = rand();

// объекты фигур
function Piece(tetromino,color){
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0; //  начинаем с первой
    this.activeTetromino = this.tetromino[this.tetrominoN];

    // расположение фигуры
    this.x = 3;
    this.y = -2;
}

// заполнение
Piece.prototype.fill = function(color){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            //  рисуем только занятые (цветные) квадраты
            if( this.activeTetromino[r][c]){
                draw(this.x + c,this.y + r, color);
            }
        }
    }
}

// отрисовка фигуры на доске
Piece.prototype.draw = function(){
    this.fill(this.color);
}

//
Piece.prototype.unDraw = function(){
    this.fill(probel);
}

// падение вниз
Piece.prototype.moveDown = function moveTetroDown(){
    if(!this.collision(0,1,this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.draw(); //новое положение фигуры отрисовка
    }else{
        // фиксация и генерация новой фигуры
        this.lock();
        p = rand();

    }

}


// перемещение фигуры вправо
Piece.prototype.moveRight = function(){
    if(!this.collision(1,0,this.activeTetromino)){
        this.unDraw();
        this.x++;
        this.draw();
    }
}

//перемещение фигуры влево
Piece.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetromino)){
        this.unDraw();
        this.x--;
        this.draw();
    }
}

// поворот фигуры
Piece.prototype.rotate = function(){
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
    let kick = 0;

    if(this.collision(0,0,nextPattern)){
        if(this.x > col/2){
            kick = -1;
        }else{
            kick = 1;
        }
    }

    if(!this.collision(kick,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}


let score=0;
let currentLevel = 1;
let possibleLevels = {
    1: {
        score: 5,
        speed: 700,
        nextLevelScore: 1000,
    },
    2: {
        score: 15,
        speed: 300,
        nextLevelScore: 1500,
    },
    3: {
        score: 20,
        speed: 200,
        nextLevelScore: 2500,
    },
    4: {
        score: 30,
        speed: 100,
        nextLevelScore: 5000,
    },
    5: {
        score: 50,
        speed: 50,
        nextLevelScore: Infinity,
    }
};

Piece.prototype.lock = function() {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            // пропуск свободных квадратов
            if (!this.activeTetromino[r][c]) {
                continue;
            }
            // game over
            if (this.y + r < 0) {
                gameOver.style.display = "block";
                // остановка анимации
                gameOver = true;
                break;
            }
            // фиксация фигуры
            board[this.y + r][this.x + c] = this.color;
        }
    }
    // удаление заполненных строк
    for (r = 0; r < row; r++) {
        let isRowFull = true;
        for (c = 0; c < col; c++) { //перебор столбцов
            isRowFull = isRowFull && (board[r][c] != probel);
        }

        if (isRowFull) {
            // если строка заполнена
            // мы переносим все строки над ней вниз
            for (y = r; y > 1; y--) {
                for (c = 0; c < col; c++) {
                    board[y][c] = board[y - 1][c];
                }
            }

//счет, очки в зависимости сколько ушло строк
            switch (board) {
                case 1:
                    score += possibleLevels[currentLevel].score;
                    break;
                case 2:
                    score += possibleLevels[currentLevel].score * 5;
                    break;
                case 3:
                    score += possibleLevels[currentLevel].score * 10;
                    break;
                case 4:
                    score += possibleLevels[currentLevel].score * 20;
                    break;
            }

            scoreElement.innerHTML = score;
            if (score >= possibleLevels[currentLevel].nextLevelScore) {
                currentLevel++;
                levelElem.innerHTML = currentLevel;
            }
        }
        // увеличение счет
        score += 1;
    }
    // обновление доски
    drawBoard();
}










// столкновение c краями поля
Piece.prototype.collision = function(x,y,piece){
    for( r = 0; r < piece.length; r++){
        for(c = 0; c < piece.length; c++){
            // является ли квадрат свободным
            if(!piece[r][c]){
                continue;
            }
            // кординаты фигур после движения
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            // условия
            if(newX < 0 || newX >= col || newY >= row){
                return true;
            }
            if(newY < 0){
                continue;
            }
            // если ли зафиксированная фигура на доске
            if( board[newY][newX] != probel){
                return true;
            }
        }
    }
    return false;
}

// кнопки передвижения
document.addEventListener("keydown",controlB);
function controlB(e) {
    if (!isPaused) {
        if (e.keyCode == 37) {//стрелка влево
            p.moveLeft();
            dropStart = Date.now();
        } else if (e.keyCode == 38) {//стрелка вверх
            p.rotate();
            dropStart = Date.now();
        } else if (e.keyCode == 39) { //стрелка вправо
            p.moveRight();
            dropStart = Date.now();
        } else if (e.keyCode == 40) {//стрелка вниз
            p.moveDown();
        }
    }
}

// старт \ пауза
function drop() {
    pauseBtn.addEventListener("click", (e) => {
        if (e.target.innerHTML === "Pause") {
            e.target.innerHTML = "Play";
            clearTimeout(gameTimerID);
        } else {
            e.target.innerHTML = "Pause";
            gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed);
        }
        isPaused = !isPaused;
    });

    startBtn.addEventListener("click", (e) => {
        e.target.innerHTML = "Start";
        isPaused = false;
        gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed);
        gameOver.style.display = "none";
    });
}
drop();

function startGame() {
    if (!isPaused) {
        p.moveDown();
        gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed);
    }
}