/* MIT License

Copyright (c) 2024 Bhavya Jain

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

// Stop dragging when mouse released
document.onmouseup = () => {
  draggable = null;
}
canvas.onmousedown = (mouseEvent) => {
  DRAGGING = false;
  MOUSE_DOWN = true;
  //console.log("mouse down");
  X_START = mouseEvent.offsetX;
  Y_START = mouseEvent.offsetY;
}
canvas.onmouseup = (mouseEvent) => {
  MOUSE_DOWN = false;
  //console.log("mouse up");
  X_END = mouseEvent.offsetX;
  Y_END = mouseEvent.offsetY;
  X_TRANS += (X_END - X_START);
  Y_TRANS += (Y_END - Y_START);
}
// show mouse coordinates
canvas.onmousemove = (mouseEvent) => {
  //console.log("mouse move");
  DRAGGING = true;
  reDraw();
  if (MOUSE_DOWN) {
    CTX.beginPath();
    CTX.strokeStyle = DRAG_LINE_COLOR;
    CTX.lineWidth = 3;
    CTX.moveTo(X_START, Y_START);
    CTX.lineTo(mouseEvent.offsetX, mouseEvent.offsetY);
    CTX.stroke();
    CTX.lineWidth = 1.0;
  }
  const x_coord = document.getElementById("x_coord");
  const y_coord = document.getElementById("y_coord");
  const mouse_coords = document.getElementById("mouse_coords");
  // Set the displayed mouse coords
  /*
  x_coord.innerHTML = "X: " + Math.floor(mouseEvent.clientX - canvas.getBoundingClientRect().x);
  y_coord.innerHTML = "Y: " + Math.max(Math.floor(mouseEvent.clientY - canvas.getBoundingClientRect().y),0);
  */
  x_coord.innerHTML = "X: " + Math.max(Math.floor(mouseEvent.offsetX),0);
  y_coord.innerHTML = "Y: " + Math.max(Math.floor(mouseEvent.offsetY),0);
  //mouse_coords.style.position = "fixed";
  //console.log(mouseEvent.clientX);
  //console.log(window.innerHeight + 17.5 - mouseEvent.clientY);
  mouse_coords.style.left = mouseEvent.clientX + 'px';
  mouse_coords.style.bottom = (window.innerHeight + 17.5 - mouseEvent.clientY) + 'px';
}

// Hide coords when mouse leaves canvas
canvas.onmouseleave = () => {
  const mouse_coords = document.getElementById("mouse_coords");
  mouse_coords.style.visibility = "hidden";
}

// Show coords when mouse enters canvas
canvas.onmouseenter = () => {
  const mouse_coords = document.getElementById("mouse_coords");
  mouse_coords.style.visibility = "visible";
}