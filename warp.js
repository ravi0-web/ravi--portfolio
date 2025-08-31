const canvas = document.getElementById("warpCanvas");
const ctx = canvas.getContext("2d");

let w = (canvas.width = window.innerWidth);
let h = (canvas.height = window.innerHeight);

const stars = [];
const numStars = 800;
let baseSpeed = 2;
let targetSpeed = 2;

// Cursor position
let mouseX = w / 2;
let mouseY = h / 2;

// Generate stars
for (let i = 0; i < numStars; i++) {
  stars.push({
    x: Math.random() * w - w / 2,
    y: Math.random() * h - h / 2,
    z: Math.random() * w,
  });
}

function animate() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, w, h);

  baseSpeed += (targetSpeed - baseSpeed) * 0.05;

  for (let i = 0; i < numStars; i++) {
    let star = stars[i];
    star.z -= baseSpeed;

    if (star.z <= 0) {
      star.x = Math.random() * w - w / 2;
      star.y = Math.random() * h - h / 2;
      star.z = w;
    }

    let k = 128.0 / star.z;
    let x = star.x * k + w / 2;
    let y = star.y * k + h / 2;

    let colorRatio = 1 - star.z / w;
    let r = 180 + 75 * colorRatio;
    let g = 180 + 75 * colorRatio;
    let b = 255;

    let size = (1 - star.z / w) * 3;
    ctx.beginPath();
    ctx.fillStyle = `rgba(${r},${g},${b},${1 - star.z / w})`;
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    if (baseSpeed > 5) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${r},${g},${b},${1 - star.z / w})`;
      ctx.moveTo(x, y);
      ctx.lineTo(x - (star.x / star.z) * 20, y - (star.y / star.z) * 20);
      ctx.stroke();
    }
  }

  drawCursor(mouseX, mouseY);

  requestAnimationFrame(animate);
}

function drawCursor(x, y) {
  const size = 30;
  const glow = ctx.createRadialGradient(x, y, 0, x, y, size*1.5);
  glow.addColorStop(0, "rgba(100,180,255,0.8)");
  glow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.beginPath();
  ctx.fillStyle = glow;
  ctx.arc(x, y, size*1.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(180,220,255,0.9)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x - size - 10, y);
  ctx.lineTo(x - size, y);
  ctx.moveTo(x + size, y);
  ctx.lineTo(x + size + 10, y);
  ctx.moveTo(x, y - size - 10);
  ctx.lineTo(x, y - size);
  ctx.moveTo(x, y + size);
  ctx.lineTo(x, y + size + 10);
  ctx.stroke();
}

// Hover speed effect
canvas.addEventListener("mouseenter", () => targetSpeed = 15);
canvas.addEventListener("mouseleave", () => targetSpeed = 2);

// Mouse move tracking
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Handle resize
window.addEventListener("resize", () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
});

animate();

// Fade in main content after first frame
requestAnimationFrame(() => {
  const main = document.querySelector("main");
  const locationDiv = document.querySelector(".location");
  setTimeout(() => {
    main.style.opacity = "1";
    locationDiv.style.opacity = "1";
  }, 100);
});
