const deg = (x) => Math.PI * (x / 180);
const container = document.getElementById("container");
const bottomText = document.getElementById("bottom-text");

function initCanvas() {
  const canvas = document.getElementById("canvas");
  canvas.style.visibility = "visible";
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  canvas.offscreenCanvas = document.createElement("canvas");
  canvas.offscreenCanvas.width = canvas.width;
  canvas.offscreenCanvas.height = canvas.height;

  const CENTER = [canvas.width / 2, canvas.height / 2];
  ctx.strokeStyle = "#2bb673";
  ctx.fillStyle = "#c25a7c";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
  ctx.shadowOffsetX = 10;
  ctx.shadowOffsetY = 5;
  ctx.shadowBlur = 10;

  let size = canvas.width * 0.3;
  let sides = 10;
  const scale = 0.5;
  let spread = deg(30);

  let iter = 0;
  let growthLimit = 0.29;
  let rotationAngle = 0;
  let rotationVelocity = 0.01;
  let growthFactor = 0;
  let growthVelocity = 0.005;
  let maxLevel = 5;
  let branches = 1;

  function drawBranch(level = 0, lengthFactor = 0) {
    if (level > maxLevel) return;

    const currentLength = size * lengthFactor;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(currentLength, 0);
    ctx.stroke();

    for (let i = 0; i < branches; i++) {
      ctx.save();
      ctx.translate(currentLength - (currentLength / branches) * i, 0);
      ctx.scale(scale, scale);

      ctx.save();
      ctx.rotate(-spread);
      drawBranch(level + 1, lengthFactor);
      ctx.restore();

      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(0, currentLength, size * 0.15, 0, deg(360));
    ctx.fill();
  }

  async function drawBranch2(level = 0) {
    if (level > maxLevel) return;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size, 0);
    ctx.stroke();

    for (let i = 0; i < branches; i++) {
      ctx.save();
      ctx.translate(size - (size / branches) * i, 0);
      ctx.rotate(spread);
      ctx.scale(scale, scale);
      drawBranch2(level + 1);
      ctx.restore();

      ctx.save();
      ctx.translate(size - (size / branches) * i, 0);
      ctx.rotate(-spread);
      ctx.scale(scale, scale);
      drawBranch2(level + 1);
      ctx.restore();
    }

    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(0, size, size * 0.05, 0, deg(360));
    ctx.fill();
  }

  function drawFractal() {
    ctx.globalCompositeOperation = "destination-over";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    if (iter == 1) ctx.translate(CENTER[0], CENTER[1]);
    else ctx.translate(CENTER[0], canvas.height);

    if (iter != 2) {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = "#b88490";
      ctx.arc(0, 0, size * 0.15, 0, deg(360));
      ctx.fill();
      ctx.restore();
    }

    ctx.rotate(rotationAngle);
    for (let i = 0; i < sides; i++) {
      if (iter == 2) {
        ctx.rotate(deg(-90) / sides);
        drawBranch2();
      } else {
        ctx.rotate(deg(360) / sides);
        drawBranch(0, growthFactor);
      }
    }

    ctx.restore();

    rotationAngle += rotationVelocity;

    if (growthFactor < growthLimit) {
      growthFactor += growthVelocity;
    }

    window.requestAnimationFrame(drawFractal);
  }

  ctx.save();
  ctx.translate(CENTER[0], CENTER[1]);
  ctx.beginPath();
  ctx.fillStyle = "#b88490";
  ctx.arc(0, 0, size * 0.15, 0, deg(360));
  ctx.fill();
  ctx.restore();

  canvas.addEventListener("click", async () => {
    if (iter == 2) return;

    switch (++iter) {
      case 1:
        growthLimit = 0.29;
        showBottomText("tap it again", 4500);
        break;
      case 2:
        bottomText.textContent = "";
        container.style.visibility = "visible";
        await showText("and lastly...", 2500);
        container.style.visibility = "hidden";

        showBottomText("hope you say yes", 3500);
        size = canvas.height * 0.3;
        spread = deg(45);
        sides = 1;
        maxLevel = 3;
        branches = 2;
        rotationAngle = 0;
        rotationVelocity = 0;

        return;
      default:
        break;
    }

    window.requestAnimationFrame(drawFractal);
  });
}

window.addEventListener("load", async () => {
  await showText("hoy", 1500);
  await showText("ay ang laki", 1500);
  await showText("that's what she said", 500);
  await showAnimatedText("wait", 1000);
  await showText("yown", 1500);
  await showText("*cough *cough", 2000);
  await showText("hi Yana", 1500);
  await showText("(mae)", 500);
  await showText("ano, game ka na?", 2000);
  await showText("wala ka namang choice...", 2000);
  await showText("ok game", 1500);
  await showText("I hope you like it, pretty", 2500);
  await showText("3", 1000);
  await showText("2", 1000);
  await showText("1", 1000);

  container.style.visibility = "hidden";
  initCanvas();
});

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function showBottomText(text, delay) {
  await wait(delay);

  bottomText.textContent = text;
  bottomText.style.visibility = "visible";
}

async function showText(text, delay) {
  const div = createTextElement(text);
  container.appendChild(div);

  await wait(delay);

  clearDiv(container);
}

async function showAnimatedText(text, delay) {
  const div = createTextElement(text);
  container.appendChild(div);

  await wait(delay);

  container.firstElementChild.classList.add("animated-text");
  await wait(2000);

  container.style.fontSize = "5rem";
  clearDiv(container);
}

function createTextElement(text) {
  const div = document.createElement("div");
  div.textContent = text;

  return div;
}

function clearDiv(div) {
  div.removeChild(div.firstElementChild);
}
