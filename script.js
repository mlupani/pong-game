const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 400;

const PLAYERS_WIDTH = 10;
const PLAYERS_HEIGHT = 60;
const BALL_SPEED = 4;
const PLAYER_SPEED = 4;
const PAUSE = false;

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 4,
    speed: 5,
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
        y: 270,
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

    // el jugador pierde
    else if(ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0){
        document.location.reload();
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

function draw() {
    if(PAUSE) return;
    clearCanvas();
    // hay que dibujar los elementos
    drawBall();
    drawPlayers();
    //drawScore();

    // colisiones y movimientos
    ballMovement();
    playersMovement();
    collisionDetection();

    window.requestAnimationFrame(draw);
}

draw();
// eventos de teclado
initEvents();