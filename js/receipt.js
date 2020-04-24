var dragging = false;
var position = null;
let xxx = document.querySelector("#xxx");
let xxx2 = document.querySelector("#xxx2");
let xxx3 = document.querySelector("#xxx3");
let xxx4 = document.querySelector("#xxx4");

xxx.style.left = 200 + "px";
xxx.style.top = 700 + "px";

xxx2.style.left = 800 + "px";
xxx2.style.top = 400 + "px";

xxx3.style.left = 1000 + "px";
xxx3.style.top = 250 + "px";

xxx4.style.left = 600 + "px";
xxx4.style.top = 500 + "px";
let current;

xxx.addEventListener("mousedown", function (e) {
  current = xxx;
  dragging = true;
  position = [e.clientX, e.clientY];
});

xxx2.addEventListener("mousedown", function (e) {
  current = xxx2;
  dragging = true;
  position = [e.clientX, e.clientY];
});

xxx3.addEventListener("mousedown", function (e) {
  current = xxx3;
  dragging = true;
  position = [e.clientX, e.clientY];
});

xxx4.addEventListener("mousedown", function (e) {
  current = xxx4;
  dragging = true;
  position = [e.clientX, e.clientY];
});

document.addEventListener("mousemove", function (e) {
  if (dragging === false) {
    return;
  }

  const x = e.clientX;
  const y = e.clientY;
  const deltaX = x - position[0];
  const deltaY = y - position[1];

  const left = parseInt(current.style.left || 0);
  const top = parseInt(current.style.top || 0);
  current.style.left = left + deltaX + "px";
  current.style.top = top + deltaY + "px";
  position = [x, y];
});
document.addEventListener("mouseup", function (e) {
  dragging = false;
});
