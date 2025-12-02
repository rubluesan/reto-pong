const paddle = document.getElementById("paddle");
const ball = document.getElementById("ball");

const ball_radius = window.prompt("Introduce el radio de la bola");
ball.style.width = 2 * ball_radius + "px";
ball.style.height = 2 * ball_radius + "px";
ball.style.borderRadius = ball_radius + "px";

var velocity_x = 15;
var velocity_y = -15;

// //Add onkeypress handler
// document.onkeypress = move_paddle;

//add onkeydown handler
document.addEventListener("keydown", move_paddle);

//add onkeyup handler
document.addEventListener("keyup", stop_paddle);

// Move ball
var ball_movement = setInterval(move_ball, 25);

function move_ball() {

    //Check Top
    if (ball.offsetTop <= 0) {
        velocity_y = -velocity_y;
    }

    //Check right
    if (ball.offsetLeft >= (window.innerWidth - 2 * ball_radius)) {
        velocity_x = -velocity_x;
    }

    //Check bottom
    if (ball.offsetTop >= (window.innerHeight - 2 * ball_radius)) {
        velocity_y = -velocity_y;
    }

    if (ball.offsetLeft <= 90 &&
        (ball.offsetTop >= (paddle.offsetTop - ball_radius)) &&
        (ball.offsetTop <= (paddle.offsetTop + 150 - ball_radius))) {
        velocity_x = -velocity_x;
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

let intervalId = null;

function stop_paddle(e) {
    e.preventDefault()
    clearInterval(intervalId);
    intervalId = null;
}

function move_paddle(e) {
    e.preventDefault()

    if (e.repeat) return;

    clearInterval(intervalId)
    // console.log("tecla pulsada: " + pkey.which);  
    if (e.keyCode == 56) {
        intervalId = setInterval(move_up, 20);
    } else if (e.keyCode == 50) {
        intervalId = setInterval(move_down, 20);
    }
    
}

function move_up() {
    paddle.style.top = (paddle.offsetTop - 10) + "px";
}

function move_down() {
    paddle.style.top = (paddle.offsetTop + 10) + "px";
}