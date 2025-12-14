let gamePanel;
let paddle;
let ball;

let panelWidth;
let panelHeight;

let ball_radius = 20;
let velocity_x;
let velocity_y;

let ball_movement = null;


function initGame(config) {
    gamePanel = document.getElementById("game-panel");
    paddle = document.getElementById("paddle");
    ball = document.getElementById("ball");

    // Dimensiones del panel
    panelWidth = gamePanel.clientWidth;
    panelHeight = gamePanel.clientHeight;

    //ball_radius = 20;
    ball.style.width = 2 * ball_radius + "px";
    ball.style.height = 2 * ball_radius + "px";
    ball.style.borderRadius = ball_radius + "px";

    velocity_x = 10;
    velocity_y = -10;

    //add onkeydown handler
    document.addEventListener("keydown", move_paddle);

    //add onkeyup handler
    document.addEventListener("keyup", stop_paddle);

    // Move ball
    ball_movement = setInterval(move_ball, 15);
}

function move_ball() {

    //Check Top
    if (ball.offsetTop <= 0) {
        velocity_y = -velocity_y;
        playSound("bounce");
    }

    //Check right
    if (ball.offsetLeft >= (panelWidth - 2 * ball_radius)) {
        velocity_x = -velocity_x;
        playSound("bounce");
    }

    //Check bottom
    if (ball.offsetTop >= (panelHeight - 2 * ball_radius)) {
        velocity_y = -velocity_y;
        playSound("bounce");
    }

    if (ball.offsetLeft <= 90 &&
        (ball.offsetTop >= (paddle.offsetTop - ball_radius)) &&
        (ball.offsetTop <= (paddle.offsetTop + 150 - ball_radius))) {
        velocity_x = -velocity_x;
        playSound("bounce");
    }

    //Check left
    if (ball.offsetLeft <= 5) {
        clearInterval(ball_movement);
        alert("You lose");
        location.reload();
    }

    ball.style.top = (ball.offsetTop + velocity_y) + "px";
    ball.style.left = (ball.offsetLeft + velocity_x) + "px";
}

let intervalUpId = null;
let intervalDownId = null;

function stop_paddle(e) {
    e.preventDefault()

    if (e.keyCode == 56) {
        clearInterval(intervalUpId);
    } else if (e.keyCode == 50) {
        clearInterval(intervalDownId);
    }
}

function move_paddle(e) {
    e.preventDefault()

    if (e.repeat) return;

    playSound("move");

    // console.log("tecla pulsada: " + pkey.which);  
    if (e.keyCode == 56) {
        clearInterval(intervalDownId);
        intervalUpId = setInterval(move_up, 20);
    } else if (e.keyCode == 50) {
        clearInterval(intervalUpId);
        intervalDownId = setInterval(move_down, 20);
    }
}

function move_up() {
    let newTop = paddle.offsetTop - 10;
    let maxTop = 0;
    if (newTop >= maxTop) {
        paddle.style.top = newTop + "px";
    }
}

function move_down() {
    let newDown = paddle.offsetTop + 10;
    let maxDown = panelHeight - paddle.offsetHeight;
    if (newDown <= maxDown) {
        paddle.style.top = (paddle.offsetTop + 10) + "px";
    }
}