const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 400;

const PLAYERS_WIDTH = 10;
const PLAYERS_HEIGHT = 60;
const FINAL_SCORE = 5;
let BALL_SPEED = 4;
let PLAYER_SPEED = 4;
let GAME_OVER = false;
let PAUSE = false;
let TIME = 0.02;

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 4,
    speed: 1,
    dx: BALL_SPEED,
    dy: BALL_SPEED
}

const players = [
    {
        x: 0,
        y: canvas.height / 2 - PLAYERS_HEIGHT / 2,
        width: PLAYERS_WIDTH,
        height: PLAYERS_HEIGHT,
        score: 0,
        upPressed: false,
        downPressed: false
    },
    {
        x: canvas.width - PLAYERS_WIDTH,
        //y: canvas.height / 2 - PLAYERS_HEIGHT / 2,
        y: 300,
        width: PLAYERS_WIDTH,
        height: PLAYERS_HEIGHT,
        score: 0,
        upPressed: false,
        downPressed: false
    }
]

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}

function drawPlayers(){
    players.forEach(player => {
        ctx.fillStyle = 'white';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    });
}

function ballMovement(){
    // rebote en la parte de arriba
    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
        ball.dy *= -1;
    }

    // el 1 jugador pierde
    else if(ball.x - ball.radius < 0 - 10){
        players[1].score++;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = BALL_SPEED;
        ball.dy = BALL_SPEED;
        showPlayerPoint(1);
    }

    // el 2 jugador pierde
    else if(ball.x + ball.radius > canvas.width + 10){
        players[0].score++;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = BALL_SPEED;
        ball.dy = BALL_SPEED;
        showPlayerPoint(0);
    }

    ball.x += ball.dx;
    ball.y += ball.dy;
}

function collisionDetection(){
    players.forEach(player => {
        if(ball.x > player.x && ball.x < player.x + player.width){
            if(ball.y > player.y && ball.y < player.y + player.height){
                ball.dx *= -1;
            }
        }
    });
}

function playersMovement(){
    players.forEach(player => {
        if(player.upPressed){
            player.y -= PLAYER_SPEED;
        } else if(player.downPressed){
            player.y += PLAYER_SPEED;
        }

        if(player.y < 0){
            player.y = 0;
        } else if(player.y + player.height > canvas.height){
            player.y = canvas.height - player.height;
        }
    });
}

function initEvents(){
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    function keyDownHandler(event) {
        if(event.key === 'Up' || event.key === 'ArrowUp'){
            players[1].upPressed = true;
        } else if(event.key === 'Down' || event.key === 'ArrowDown'){
            players[1].downPressed = true;
        }

        if(event.key === 'w'){
            players[0].upPressed = true;
        } else if(event.key === 's'){
            players[0].downPressed = true;
        }

       if((event.key === 'Enter' || event.key === 'p' || event.code === 'Space')){
            PAUSE = !PAUSE;
            if(!PAUSE){
                draw();
            }
        }

        if(event.key === 'r'){
            document.location.reload();
        }

    }

    function keyUpHandler(event) {
        if(event.key === 'Up' || event.key === 'ArrowUp'){
            players[1].upPressed = false;
        } else if(event.key === 'Down' || event.key === 'ArrowDown'){
            players[1].downPressed = false;
        }

        if(event.key === 'w'){
            players[0].upPressed = false;
        } else if(event.key === 's'){
            players[0].downPressed = false;
        }
    }
}

function drawTime(){
    ctx.fillStyle = TIME <= 0.05 ? 'red' : 'white';
    if(TIME <= 0){
        ctx.font = '30px Arial';
        ctx.fillText("TIEMPO SÚBITO", canvas.width / 2 - 110, 50);
    }
    else {
        ctx.font = '40px Arial';
        ctx.fillText(TIME.toFixed(2).replace('.',':'), canvas.width / 2 - 40, 50);
    }
}

function drawScores(){
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText("P1 " + players[0].score + "/" + FINAL_SCORE, 0 , 50);
    ctx.fillText(players[1].score + "/" + FINAL_SCORE + " P2", canvas.width - 60, 50);
}

function checkScore(){
    players.forEach(player => {
        if(player.score === FINAL_SCORE){
            clearCanvas();
            drawScores();
            GAME_OVER = true;
            ctx.font = '40px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText('GAME OVER', canvas.width / 2 - 120, canvas.height / 2);
            ctx.font = '20px Arial';
            ctx.fillText('Ganador jugador ' + (player === players[0] ? '1' : '2'), canvas.width / 2 - 80, canvas.height / 2 + 30);
            ctx.font = '15px Arial';
            ctx.fillText('Press R to restart', canvas.width / 2 - 55, canvas.height / 2 + 70);
        }

        if(TIME <= 0){
            BALL_SPEED = 6;
            PLAYER_SPEED = 6;
        }
    });
}

function countDown(){
    setInterval(() => {
        if(!PAUSE){
            TIME = TIME - 0.01;
        }
    }, 1000);
}

function showPlayerPoint(player){
    ctx.font = '40px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Punto jugador ' + (player + 1), canvas.width / 2 - 120, canvas.height / 2);
    PAUSE = true;
    setTimeout(() => {
        PAUSE = false;
        draw();
    }, 2000);
}

function draw() {
    if(PAUSE || GAME_OVER) return;
    clearCanvas();
    drawTime();
    // hay que dibujar los elementos
    drawBall();
    drawPlayers();
    drawScores();

    // colisiones y movimientos
    ballMovement();
    playersMovement();
    collisionDetection();
    checkScore();

    window.requestAnimationFrame(draw);
}

draw();
// eventos de teclado
initEvents();
countDown();