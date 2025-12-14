/* JS para la pagina de bienvenida */

/* --- MANEJO SOUNDTRACK ---*/
const playlist = [
    "assets/music/01 - Opening.ogg",
    "assets/music/03 - HWV 56 - Why do the nations so furiously rage together.ogg",
    "assets/music/04 - Sanctuary.ogg"
];

// variables musica
let currentTrack = 0;
const music = new Audio();
music.volume = 0.2;
music.muted = true;

function playTrack(index) {
    music.src = playlist[index];
    music.play();
}

function pauseTrack(index) {
    music.src = playlist[index];
    music.pause();
}

/* MANEJO SONIDO */
let soundsEnabled = false;

const soundPool = {
    hover: new Audio("assets/sounds/001_Hover_01.wav"),
    click: new Audio("assets/sounds/Click_Electronic_04.mp3"),
    back: new Audio("assets/sounds/Mouth_Special_00.mp3"),
    start: new Audio("assets/sounds/Mouth_Special_00.mp3"),
    move: new Audio("assets/sounds/Slide_Sharp_00.mp3"),
    bounce: new Audio("assets/sounds/Mouth_00.mp3")
};

function playSound(name) {
    if (!soundsEnabled) return;
    const sound = soundPool[name].cloneNode(); // clona para poder reproducir múltiples a la vez
    sound.volume = 0.2;
    sound.play();
}


// Cuando termina una canción pasa a la siguiente
music.addEventListener("ended", () => {
    currentTrack++;
    if (currentTrack >= playlist.length) {
        currentTrack = 0; // vuelve al inicio
    }
    playTrack(currentTrack);
});


/* --- CONFIGURACIÓN DEL JUEGO --- */
const gameConfig = {
    players: 2,
    difficulty: "NORMAL",
    player1: {
        name: "PLAYER1",
        controls: {
            up: "W",
            down: "S",
            action: "Space"
        }
    },
    player2: {
        name: "PLAYER2",
        controls: {
            up: "ArrowUp",
            down: "ArrowDown",
            action: "Enter"
        }
    }
}

/* --- CARGA DINÁMICA DE MENÚS --- */
const menuPanel = document.getElementById("menu-panel");

function setupMenuEvents() {
    menuPanel.addEventListener("click", (e) => {
        playSound("click");

        if (e.target.closest("#play-button")) {
            loadGame(gameConfig);
        }

        if (e.target.closest("#music-switch")) {
            music.muted = !music.muted;
            playTrack(currentTrack);
            document.getElementById("music-switch-value").textContent = music.muted ? "OFF" : "ON";
        }

        if (e.target.closest("#sounds-switch")) {
            soundsEnabled = !soundsEnabled;
            document.getElementById("sounds-switch-value").textContent = soundsEnabled ? "ON" : "OFF";
        }
    });

    menuPanel.addEventListener("mouseover", (e) => {
        const li = e.target.closest(".menu-item");
        if (!li || !menuPanel.contains(li)) return;

        /* e.relatedTarget es el elemento desde el que entró,
        si el li lo contiene(es un hijo de li) return */
        if (li.contains(e.relatedTarget)) return;

        playSound("hover");
    });
}


async function loadMenu(menuFile) {
    const res = await fetch(`menus/${menuFile}`);
    menuPanel.innerHTML = await res.text();
}



/**
 * Función para cargar el css de los html que se cargan manera dinámica
 * @param {*} href 
 */
function loadCSS(href) {
    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
    }
}


/**
 * TODO
 * @param {*} config 
 */
async function loadGame(config) {
    // Ocultar menú
    document.getElementById("menu-panel").style.display = "none";

    loadCSS("css/pong.css");

    // cargamos el html que hay en pong.html
    const res = await fetch("pong.html");
    const html = await res.text();

    // Se añade el html de pong.html al game-panel
    const gamePanel = document.getElementById("game-panel");
    gamePanel.innerHTML = html;

    // Cargamos el JS del juego
    const script = document.createElement("script");
    script.src = "pong.js";

    // Hacemos gamePanel visible
    gamePanel.style.display = "block";

    // Cuando se carga el script se llama a initGame con la config actual
    script.onload = () => {
        if (window.initGame) {
            window.initGame(config);
        }
    };

    // el script del juego se añade al body
    document.body.appendChild(script);
}

// Menú inicial
loadMenu("main-menu.html");

// setup de eventos de menu
setupMenuEvents();

// Exponer funciones globales para los botones
window.showMainMenu = () => loadMenu("main-menu.html");
window.showOptionsMenu = () => loadMenu("options-menu.html");
