let gamePanel;
let ball;

let panelWidth;
let panelHeight;

let ball_radius = 20;
let velocity_x;
let velocity_y;

let ball_movement = null;

let matchConfig;
let players;


function initGame(config) {
    matchConfig = config;
    gamePanel = document.getElementById("game-panel");
    const paddle1 = document.getElementById("paddle1");
    ball = document.getElementById("ball");

    players = [];

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
    const paddle1 = players[0].paddle;


    //Check Top
    if (ball.offsetTop <= 0) {
        velocity_y = -velocity_y;
        playSound("bounce");
    }

    //Check right
    // Rebote derecha si solo 1 jugador
    if (matchConfig.players === 1) {
        if (ball.offsetLeft >= panelWidth - 2 * ball_radius) {
            velocity_x = -velocity_x;
        }
    }

    if (matchConfig.players === 2) {
        const paddle2 = players[1].paddle;
        // Check paddle2
        if (
            ball.offsetLeft + 2 * ball_radius >= paddle2.offsetLeft &&
            ball.offsetTop + 2 * ball_radius >= paddle2.offsetTop &&
            ball.offsetTop <= paddle2.offsetTop + paddle2.offsetHeight
        ) {
            velocity_x = -velocity_x;
            ball.style.left = paddle2.offsetLeft - 2 * ball_radius + "px";
            playSound("bounce");
        }


    }


    //Check bottom
    if (ball.offsetTop >= (panelHeight - 2 * ball_radius)) {
        velocity_y = -velocity_y;
        playSound("bounce");
    }

    // Check paddle1
    if (ball.offsetLeft <= paddle1.offsetLeft + paddle1.offsetWidth &&
        ball.offsetTop + 2 * ball_radius >= paddle1.offsetTop &&
        ball.offsetTop <= paddle1.offsetTop + paddle1.offsetHeight) {
        velocity_x = -velocity_x;
        ball.style.left = paddle1.offsetLeft + paddle1.offsetWidth + "px"; // afuera de la pala
        playSound("bounce");
    }


    //Check paddle1 lose
    if (ball.offsetLeft <= 5) {
        clearInterval(ball_movement);
        alert("Player1 loses");
        location.reload();
    }

    // Check paddle2 lose
    if (players.length === 2 && ball.offsetLeft + 2 * ball_radius >= panelWidth) {
        clearInterval(ball_movement);
        alert("Player 2 loses");
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