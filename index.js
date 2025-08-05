const player = document.getElementById('player');
const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const phaseDisplay = document.getElementById('phase');

let score = 0;
let lives = 3;
let currentPhase = 0;

const phases = [
  {
    name: "Cidade Medieval",
    background: "https://github.com/soraiaevelin/Jogo.Soraia-/blob/b24b15871559fab53925662086b332f917454731/medieval-bg.jpg?raw=true",
   goodItems: [
  "https://github.com/soraiaevelin/Jogo.Soraia-/blob/b24b15871559fab53925662086b332f917454731/barrel-pixel.png?raw=true",
  " https://github.com/soraiaevelin/Jogo.Soraia-/blob/b24b15871559fab53925662086b332f917454731/sword-pixel.png?raw=true",
  "https://github.com/soraiaevelin/Jogo.Soraia-/blob/b24b15871559fab53925662086b332f917454731/torch-pixel.png?raw=true"
],
badItems: [
  "https://github.com/soraiaevelin/Jogo.Soraia-/blob/b24b15871559fab53925662086b332f917454731/apple-pixel.png?raw=true"
],

    fallSpeed: 5,
    dropInterval: 1500
  },
  {
    name: "floresta mágica",
    background: "https://github.com/soraiaevelin/Jogo.Soraia-/blob/b24b15871559fab53925662086b332f917454731/forest-bg.jpg?raw=true",
    goodItems: [
  "https://github.com/soraiaevelin/Jogo.Soraia-/blob/b24b15871559fab53925662086b332f917454731/firefly-pixel.png?raw=true",
  "https://github.com/soraiaevelin/Jogo.Soraia-/blob/b24b15871559fab53925662086b332f917454731/mushroom-pixel.png?raw=true",
  "https://github.com/soraiaevelin/Jogo.Soraia-/blob/b24b15871559fab53925662086b332f917454731/plant-pixel.png?raw=true"
],
badItems: [
  "https://github.com/soraiaevelin/Jogo.Soraia-/blob/b24b15871559fab53925662086b332f917454731/hydrant-pixel.png?raw=true"
],
    fallSpeed: 7,
    dropInterval: 1000
  },
  {
    name: "Cidade Futurista",
    background: "https://img.craftpix.net/2023/01/Free-City-Backgrounds-Pixel-Art2.png",
    goodItems: [
  "https://github.com/soraiaevelin/Jogo.Soraia-/blob/b24b15871559fab53925662086b332f917454731/ship-pixel.png?raw=true",
  "https://github.com/soraiaevelin/Jogo.Soraia-/blob/b24b15871559fab53925662086b332f917454731/zeppelin-pixel.png?raw=true",
  "https://github.com/soraiaevelin/Jogo.Soraia-/blob/b24b15871559fab53925662086b332f917454731/building-pixel.png?raw=true"
],
badItems: [
  "https://github.com/soraiaevelin/Jogo.Soraia-/blob/b24b15871559fab53925662086b332f917454731/candle-pixel.png?raw=true"
]
,
    fallSpeed: 9,
    dropInterval: 700
  }
];

function changePhase() {
  if (currentPhase >= phases.length) {
    alert("🎉 Parabéns! Você venceu todas as fases!");
    return;
  }

  const phase = phases[currentPhase];
  game.style.backgroundImage = `url('${phase.background}')`;
  phaseDisplay.textContent = "Fase: " + phase.name;
  lives = 3;
  score = 0;
  updateHUD();
  startDropping();
}

function updateHUD() {
  scoreDisplay.textContent = "Pontuação: " + score;
  livesDisplay.textContent = "Vidas: " + lives;
}

document.addEventListener("mousemove", (e) => {
  let x = e.clientX;
  player.style.left = `${x - player.offsetWidth / 2}px`;
});

let dropIntervalId;

function startDropping() {
  if (dropIntervalId) clearInterval(dropIntervalId);

  const phase = phases[currentPhase];
  dropIntervalId = setInterval(() => {
    dropItem(phase);
  }, phase.dropInterval);
}

function dropItem(phase) {
  const isGood = Math.random() > 0.3;
  const itemList = isGood ? phase.goodItems : phase.badItems;
  const img = itemList[Math.floor(Math.random() * itemList.length)];

  const item = document.createElement("div");
  item.classList.add("item");
  item.style.left = `${Math.random() * (window.innerWidth - 40)}px`;
  item.style.backgroundImage = `url('${img}')`;

  game.appendChild(item);

  let topPos = 0;
  const fall = () => {
    topPos += phase.fallSpeed;
    item.style.top = `${topPos}px`;

    const itemRect = item.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      itemRect.bottom >= playerRect.top &&
      itemRect.left < playerRect.right &&
      itemRect.right > playerRect.left
    ) {
      if (phase.goodItems.includes(img)) {
        score++;
      } else {
        lives--;
        if (lives <= 0) {
          alert("😢 Fim de jogo! Você perdeu todas as vidas!");
          location.reload();
        }
      }

      item.remove();
      updateHUD();

      if (score >= 10) {
        currentPhase++;
        clearInterval(dropIntervalId);
        changePhase();
      }
    }

    if (topPos > window.innerHeight) {
      item.remove();
    } else {
      requestAnimationFrame(fall);
    }
  };

  requestAnimationFrame(fall);
}

changePhase();
