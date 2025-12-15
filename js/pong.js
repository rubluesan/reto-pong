let gamePanel;
let paddle;
let ball;

let panelWidth;
let panelHeight;

let ball_radius = 20;
let velocity_x;
let velocity_y;

let ball_movement = null;

let players;


function initGame(config) {
    gamePanel = document.getElementById("game-panel");
    paddle = document.getElementById("paddle1");
    ball = document.getElementById("ball");

    players = [];

    const paddle1 = document.getElementById("paddle1");

    // Jugador 1
    players.push(new Player(config.player1, paddle1));

    // Jugador 2 SOLO si hay 2 jugadores
    if (config.players === 2) {
        const paddle2 = document.createElement("div");
        paddle2.id = "paddle2";
        paddle2.classList.add("paddle", "right");
        gamePanel.appendChild(paddle2);

        players.push(new Player(config.player2, paddle2));
    }

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


function stop_paddle(e) {
    e.preventDefault()

    players.forEach(player => {
        if (e.key === player.controls.up) player.stopUp();
        if (e.key === player.controls.down) player.stopDown();
    });
}

function move_paddle(e) {
    e.preventDefault()

    if (e.repeat) return;

    playSound("move");

    players.forEach(player => {
        if (e.key === player.controls.up) {
            player.stopDown();
            player.moveIntervalUp = setInterval(
                () => player.moveUp(),
                20
            );
        }

        if (e.key === player.controls.down) {
            player.stopUp();
            player.moveIntervalDown = setInterval(
                () => player.moveDown(panelHeight),
                20
            );
        }
    });
}

class Player {
    constructor({ name, controls }, paddleElement) {
        this.name = name;
        this.controls = controls;
        this.paddle = paddleElement;
        this.moveIntervalUp = null;
        this.moveIntervalDown = null;
    }

    moveUp() {
        let newTop = this.paddle.offsetTop - 10;
        if (newTop >= 0) {
            this.paddle.style.top = newTop + "px";
        }
    }

    moveDown(panelHeight) {
        let maxDown = panelHeight - this.paddle.offsetHeight;
        let newTop = this.paddle.offsetTop + 10;
        if (newTop <= maxDown) {
            this.paddle.style.top = newTop + "px";
        }
    }

    stopUp() {
        if (this.moveIntervalUp) {
            clearInterval(this.moveIntervalUp);
            this.moveIntervalUp = null;
        }
    }

    stopDown() {
        if (this.moveIntervalDown) {
            clearInterval(this.moveIntervalDown);
            this.moveIntervalDown = null;
        }
    }

}