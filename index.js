const player = document.getElementById('player');
const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const phaseDisplay = document.getElementById('phase');
const modal = document.getElementById('instructionModal');
const playButton = document.getElementById('playButton');
const phaseTitle = document.getElementById('phaseTitle');
const goodItemsDisplay = document.getElementById('goodItemsDisplay');
const badItemsDisplay = document.getElementById('badItemsDisplay');
const countdown = document.getElementById('countdown');

let score = 0;
let lives = 3;
let currentPhase = 0;
let gameIntervals = [];
let gameRunning = false;

let playerX = window.innerWidth / 2;
const playerSpeed = 8;
const keysPressed = {};

const phases = [
  {
    name: "Cidade Medieval",
    background: "images/medieval-bg.jpg",
    goodItems: ["images/sword-pixel.png", "images/torch-pixel.png", "images/barrel-pixel.png"],
    badItems: ["images/apple-pixel.png"],
    fallSpeed: 4,
    dropInterval: 1200
  },
  {
    name: "Floresta Mística",
    background: "images/forest-bg.jpg",
    goodItems: ["images/firefly-pixel.png", "images/mushroom-pixel.png", "images/plant-pixel.png"],
    badItems: ["images/hydrant-pixel.png"],
    fallSpeed: 7,
    dropInterval: 900
  },
  {
    name: "Cidade Futurista",
    background: "images/future-city-bg.png",
    goodItems: ["images/building-pixel.png", "images/zeppelin-pixel.png", "images/ship-pixel.png"],
    badItems: ["images/candle-pixel.png"],
    fallSpeed: 9,
    dropInterval: 600
  }
];

// === INSTRUÇÕES E MODAL ===
function showInstructions() {
  const phase = phases[currentPhase];
  modal.style.display = "flex";
  gameRunning = false;

  phaseTitle.textContent = `Fase ${currentPhase + 1}: ${phase.name}`;
  goodItemsDisplay.innerHTML = '';
  badItemsDisplay.innerHTML = '';

  phase.goodItems.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    goodItemsDisplay.appendChild(img);
  });

  phase.badItems.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    badItemsDisplay.appendChild(img);
  });

  countdown.textContent = '';
  playButton.disabled = false;
}

// === INICIAR FASE APÓS PLAY OU TECLA SPACE ===
function startGameCountdown() {
  let seconds = 5;
  countdown.textContent = seconds;
  playButton.disabled = true;

  const timer = setInterval(() => {
    seconds--;
    countdown.textContent = seconds;
    if (seconds === 0) {
      clearInterval(timer);
      modal.style.display = 'none';
      gameRunning = true;
      startDropping();
    }
  }, 1000);
}

playButton.addEventListener('click', startGameCountdown);

// Espaço também ativa o botão de jogar
document.addEventListener('keydown', (e) => {
  keysPressed[e.key] = true;

  if (e.code === 'Space' && modal.style.display !== 'none') {
    playButton.click();
  }
});

document.addEventListener('keyup', (e) => {
  keysPressed[e.key] = false;
});

// === FASES E LÓGICA ===
function clearGameArea() {
  document.querySelectorAll('.item').forEach(item => item.remove());
  gameIntervals.forEach(clearInterval);
  gameIntervals = [];
}

function changePhase() {
  clearGameArea();
  gameRunning = false;

  const phase = phases[currentPhase];
  game.style.background = `url('${phase.background}') no-repeat center center / cover`;
  phaseDisplay.textContent = `Fase: ${currentPhase + 1}`;
  updateHUD();

  showInstructions();
}

function startDropping() {
  const phase = phases[currentPhase];
  gameIntervals.push(setInterval(() => dropItem(phase), phase.dropInterval));
}

function updateHUD() {
  scoreDisplay.textContent = `Pontuação: ${score}`;
  livesDisplay.textContent = `Vidas: ${lives}`;
  phaseDisplay.textContent = `Fase: ${currentPhase + 1}`;
}

function dropItem(phase) {
  if (!gameRunning) return;

  const isGood = Math.random() < 0.7;
  const itemSrc = isGood
    ? phase.goodItems[Math.floor(Math.random() * phase.goodItems.length)]
    : phase.badItems[Math.floor(Math.random() * phase.badItems.length)];

  const item = document.createElement('div');
  item.classList.add('item');
  item.style.backgroundImage = `url('${itemSrc}')`;
  item.style.left = Math.random() * (window.innerWidth - 80) + 'px';
  game.appendChild(item);

  const fall = setInterval(() => {
    if (!document.body.contains(item)) return clearInterval(fall);
    const currentTop = parseInt(item.style.top || '-90px');
    item.style.top = currentTop + phase.fallSpeed + 'px';

    if (currentTop > window.innerHeight) {
      item.remove();
      clearInterval(fall);
    }

    const itemRect = item.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      itemRect.bottom > playerRect.top &&
      itemRect.top < playerRect.bottom &&
      itemRect.left < playerRect.right &&
      itemRect.right > playerRect.left
    ) {
      if (isGood) {
        score++;
        if (score % 10 === 0 && currentPhase < phases.length - 1) {
          currentPhase++;
          changePhase();
        }
      } else {
        lives--;
        if (lives <= 0) {
          alert('Fim de jogo!');
          location.reload();
        }
      }
      updateHUD();
      item.remove();
      clearInterval(fall);
    }
  }, 20);
}

// === MOVIMENTO DO JOGADOR ===
function movePlayer() {
  if (keysPressed['ArrowLeft'] || keysPressed['a']) playerX -= playerSpeed;
  if (keysPressed['ArrowRight'] || keysPressed['d']) playerX += playerSpeed;

  playerX = Math.max(0, Math.min(playerX, window.innerWidth - player.offsetWidth));
  player.style.left = playerX + 'px';
  requestAnimationFrame(movePlayer);
}

// === INÍCIO DO JOGO ===
updateHUD();
changePhase();
movePlayer();
