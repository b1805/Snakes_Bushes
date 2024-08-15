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

//Dark Mode toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Displays the grid when you first open the program
function initialize() {
  createTriangleGrid();
  CANVAS.addEventListener('click', clickHandler); // Left click for selecting the triangles
  //CANVAS.addEventListener('contextmenu', setLightSource); // Right click for moving the light source
  drawLightSource();
}

// Handles clicks
function clickHandler(event) {
  //console.log("mouse click");
  if(DRAGGING) {
    updateScreen();
    return;
  } 
  if (SELECT_BUTTON.checked) {
    selectTriangle(event);
  } else if (MAGNIFY_BUTTON.checked) {
    magnify(event);
    //var x = event.offsetX * parseFloat(zoomInput.value);
    //var y = event.offsetY * parseFloat(zoomInput.value);
    centerView(event, parseFloat(zoomInput.value));
  } else if (DEMAGNIFY_BUTTON.checked) {
    demagnify(event);
   // var x = event.offsetX / parseFloat(zoomInput.value);
    //var y = event.offsetY / parseFloat(zoomInput.value);
    //var x = event.offsetX;
    //var y = event.offsetY;
    centerView(event, 1 / parseFloat(zoomInput.value));
  } else if (CENTER_BUTTON.checked) {
    centerView(event);
  }
}

// Function to magnify
function magnify(event) {
  let inputValue = parseFloat(zoomInput.value);
  TOTAL_ZOOM *= inputValue;
  updateScreen();
}

// Function to demagnify
function demagnify(event) {
  let inputValue = parseFloat(zoomInput.value);
  TOTAL_ZOOM /= inputValue;
  updateScreen();
}

// Function to center the view
function centerView(event, scale = 1) {
  var x = event.offsetX * scale;
  var y = event.offsetY * scale;
  X_TRANS *= scale;
  Y_TRANS *= scale;
  X_TRANS += (500-x);
  Y_TRANS += (400-y);
  updateScreen();
}

function resetZoomDrag() {
  X_TRANS = 0;
  Y_TRANS = 0;
  X_START = 0;
  Y_START = 0;
  X_END = 0;
  Y_END = 0;
  TOTAL_ZOOM = 1;
  updateScreen();
}

// Changes colors
function applyColors() {
  WALL_COLOR = document.getElementById("wallColorInput").value;
  PHOTON_TAIL_COLOR = document.getElementById("photonTailColorInput").value;
  PHOTON_TOP_COLOR = document.getElementById("photonTopColorInput").value;
  LIGHT_SOURCE_COLOR = document.getElementById("lightSourceColorInput").value;
  BOUND_COLOR = document.getElementById("boundColorInput").value;
  DRAG_LINE_COLOR = document.getElementById("dragLineColorInput").value;
  updateScreen(); // Update canvas with new colors
}

// Changes Epsilon Value
function changeEpsilon() {
  CORNER_EPS = parseFloat(document.getElementById("epsilonInput").value);
  //console.log(CORNER_EPS);
}

// Get rid of the grid lines and make the background black
function blackbackground() {
  bool = document.getElementById("backgroundInput").value;
  if (bool == 1) {
  BACKGROUND_COLOR = "#000000";
  }
  else if (bool == 0) {
    BACKGROUND_COLOR = "#FFFFFF";
  }
  updateScreen();
}

// Turns the mouse coordinates on and off
function changeMouseCoordsVisibility() {
  const mouseVisibilityCheckBox = document.getElementById("mouseVisibilityCheckBox");
  const mouse_coords = document.getElementById("mouse_coords");
  if(mouseVisibilityCheckBox.checked) {
    mouse_coords.style.display = "inline";
  } else {
    mouse_coords.style.display = "none";
  }
}

// Changes the coordinates of the light source
function changeLightSourceCoordinates() {
  lightSource["x"] = parseInt(document.getElementById("lightSourceXInput").value);
  lightSource["y"] = parseInt(document.getElementById("lightSourceYInput").value);
  
  BOUNDARIES.forEach(lineSeg => {
    COORDS.push([lineSeg.x1, lineSeg.y1]);
    COORDS.push([lineSeg.x2, lineSeg.y2]);
  })

  const setCOORDS = new Set(COORDS.map(JSON.stringify));
  COORDS = Array.from(setCOORDS).map(JSON.parse);

  // Log the COORDS and Boundaries list
  console.log("COORDS Array:", COORDS);
  console.log("Boundaries Array:", BOUNDARIES);
  updateScreen(); // Update canvas with new coordinates
}

// Changes M & N values
function changeMN() {
  M = parseInt(document.getElementById("MInput").value);
  N = parseInt(document.getElementById("NInput").value);
  TAIL_SIZE = (TRIANGLE_SIDE/M)*Math.sin(Math.atan(M/N));

  // Find the line segment with the largest y1 and y1 == y2
  let maxYLineSegment = null;
  let maxY = -Infinity;

  BOUNDARIES.forEach(lineSeg => {
    if (lineSeg.y1 === lineSeg.y2 && lineSeg.y1 > maxY) {
      maxY = lineSeg.y1;
      maxYLineSegment = lineSeg;
    }
  });

  // Move the light source to the middle of this line segment
  if (maxYLineSegment) {
    if (M % 2 === 0) {
      if (maxYLineSegment.x1 < maxYLineSegment.x2) {
        lightSource["x"] = maxYLineSegment.x1 + (TRIANGLE_SIDE * (1/(2*M)));
        lightSource["y"] = maxYLineSegment.y1;
      }
      else {
        lightSource["x"] = maxYLineSegment.x2 + (TRIANGLE_SIDE * (1/(2*M)));
        lightSource["y"] = maxYLineSegment.y1;
      }
    }
    else {
      if (maxYLineSegment.x1 < maxYLineSegment.x2) {
        lightSource["x"] = maxYLineSegment.x1 + (TRIANGLE_SIDE * (1/2));
        lightSource["y"] = maxYLineSegment.y1;
      }
      else {
        lightSource["x"] = maxYLineSegment.x2 + (TRIANGLE_SIDE * (1/2));
        lightSource["y"] = maxYLineSegment.y1;
      }
    }
    

    const setCOORDS = new Set(COORDS.map(JSON.stringify));
    COORDS = Array.from(setCOORDS).map(JSON.parse);

    // Log the COORDS and Boundaries list
    console.log("COORDS Array:", COORDS);
    console.log("Boundaries Array:", BOUNDARIES);
    updateScreen(); // Update canvas with new coordinates
  }
}

//log function
function log(b, n) {
  return Math.log(n) / Math.log(b);
}

//map function, pos is a position vector maps from the unmagnified values to a scale factor
function map(pos) {
  return pos.mult(TOTAL_ZOOM).add(new Vector(X_TRANS, Y_TRANS)); // Re-add this when we want to drag
}

//map function, maps from the magnified canvas to locations in our internal unmagnified
function unmap(pos) {
  return pos.add(new Vector(X_TRANS, Y_TRANS).mult(-1)).mult(1/TOTAL_ZOOM); 
}

// function changeThickness() {
//   TAIL_SIZE = parseFloat(document.getElementById("tailSizeInput").value);
// }

// Function to change rendering speed
function changeSpeed() {
  SPEED_TIMES_TEN = parseInt(document.getElementById("speedInput").value);
  //console.log(SPEED_TIMES_TEN)
}

// Advanced Function to change rendering speed to 1000
function changeSpeed2() {
  SPEED_TIMES_TEN = 1000;
  document.getElementById("speedInput").value = 1000;
  document.getElementById("speedInput").classList.add("red_slider");
  document.getElementById("speedValue").textContent = 1000; // Update the displayed value
  //console.log(SPEED_TIMES_TEN)
}

// Add an event listener to the slider to reset the color on input change
document.getElementById("speedInput").addEventListener('input', function() {
  this.classList.remove("red_slider");
  document.getElementById("speedValue").textContent = this.value; // Update the displayed value
});

// Initialize the displayed value on page load
document.getElementById("speedValue").textContent = document.getElementById("speedInput").value;

// Changes the number of Triangles in the grid (essentially the size of the grid)
function changeNumberTriangles(){
  TRIANGLE_SIDE = parseInt(document.getElementById("triangleSideInput").value);
  TRIANGLES = [];
  SELECTED_TRIANGLES = [];
  createTriangleGrid();
  //console.log(TRIANGLE_SIDE);
}

// Function to make the grid of triangles
function createTriangleGrid() {
  const triangleSize = TRIANGLE_SIDE;
  // Split canvas into square cells
  for (let y = 0; y < CANVAS.height; y += triangleSize) {
    for (let x = 0; x < CANVAS.width; x += triangleSize) {
      let isEvenRow = (y / triangleSize) % 2 === 0;
      let isEvenCol = (x / triangleSize) % 2 === 0;

      // We split the cell into two (45,45) triangles, which are oriented differently depending on the parity of the row and column
      if ((isEvenRow && isEvenCol) || (!isEvenRow && !isEvenCol)) {
        let triangle1 = new Path2D();
        triangle1.moveTo(x, y);
        triangle1.lineTo(x + triangleSize, y);
        triangle1.lineTo(x, y + triangleSize);
        triangle1.closePath();
        let triangleObj1 = { path: triangle1, selected: false, point1: { x: x, y: y }, point2: { x: x + triangleSize, y: y }, point3: { x: x, y: y + triangleSize } };
        TRIANGLES.push(triangleObj1);

        let triangle2 = new Path2D();
        triangle2.moveTo(x + triangleSize, y);
        triangle2.lineTo(x + triangleSize, y + triangleSize);
        triangle2.lineTo(x, y + triangleSize);
        triangle2.closePath();
        let triangleObj2 = { path: triangle2, selected: false, point1: { x: x + triangleSize, y: y }, point2: { x: x + triangleSize, y: y + triangleSize }, point3: { x: x, y: y + triangleSize } };
        TRIANGLES.push(triangleObj2);
      } else {
        let triangle1 = new Path2D();
        triangle1.moveTo(x, y);
        triangle1.lineTo(x + triangleSize, y);
        triangle1.lineTo(x + triangleSize, y + triangleSize);
        triangle1.closePath();
        let triangleObj1 = { path: triangle1, selected: false, point1: { x: x, y: y }, point2: { x: x + triangleSize, y: y }, point3: { x: x + triangleSize, y: y + triangleSize } };
        TRIANGLES.push(triangleObj1);

        let triangle2 = new Path2D();
        triangle2.moveTo(x, y);
        triangle2.lineTo(x, y + triangleSize);
        triangle2.lineTo(x + triangleSize, y + triangleSize);
        triangle2.closePath();
        let triangleObj2 = { path: triangle2, selected: false, point1: { x: x, y: y }, point2: { x: x, y: y + triangleSize }, point3: { x: x + triangleSize, y: y + triangleSize } };
        TRIANGLES.push(triangleObj2);
      }
    }
  }
  drawTriangles();
}


// Function to draw the triangles and also several other fixed canvas elements
function drawTriangles() {
  CTX.lineWidth = 1.0;
  // Clear the canvas
  CTX.clearRect(0, 0, canvas.width, canvas.height);
  CTX.fillStyle = BACKGROUND_COLOR;
  CTX.fillRect(0, 0, canvas.width, canvas.height);
  CTX.strokeStyle = WALL_COLOR;
  // Drawing order is important here. We first draw the bolded boundaries to the shape,
  // then we draw the triangles
  
  drawBounds();
  /*
  TRIANGLES.forEach(triangle => {
    if (SELECTED_TRIANGLES.includes(triangle)) {
      CTX.fillStyle = 'black';
      CTX.strokeStyle = WALL_COLOR;
      CTX.fill(triangle.path);
    }
    if (BACKGROUND_COLOR == "#000000") CTX.globalAlpha = 0.0; // To remove the grid lines while recording
    CTX.stroke(triangle.path);
    CTX.strokeStyle = WALL_COLOR;
    CTX.globalAlpha = 1; // Change it to default after done
  });
  */
  TRIANGLES.forEach(triangle => {
    // Mat the coordinates of the vertices in the original grid to the magnifier
    const p1 = map(new Vector(triangle.point1.x, triangle.point1.y));
    const p2 = map(new Vector(triangle.point2.x, triangle.point2.y));
    const p3 = map(new Vector(triangle.point3.x, triangle.point3.y));
    let path = new Path2D();
    path.moveTo(p1.x, p1.y);
    path.lineTo(p2.x, p2.y);
    path.lineTo(p3.x, p3.y);
    path.closePath();
    if (triangle.selected) {
      CTX.fillStyle = 'black';
      CTX.strokeStyle = WALL_COLOR;
      CTX.fill(path);
    }
    if(BACKGROUND_COLOR == "#000000") this.ctx.globalAlpha = 0.0; // To remove the grid lines while recording
    CTX.stroke(path);
    CTX.strokeStyle = WALL_COLOR;
    CTX.globalAlpha = 1; // Change it to default after done
  });
  drawLightSource();
}

// Function to draw the triangles and also several other fixed canvas elements
function drawTriangles2() {
  CTX.lineWidth = 1.0;
  CTX.strokeStyle = WALL_COLOR;
   drawBounds();
  // TRIANGLES.forEach(triangle => {
  //   if (!SELECTED_TRIANGLES.includes(triangle)) {
  //     CTX.fillStyle = BACKGROUND_COLOR;
  //     CTX.strokeStyle = WALL_COLOR;
  //     CTX.fill(triangle.path);
  //   }
  //   if (BACKGROUND_COLOR == "#000000") CTX.globalAlpha = 0.0; // To remove the grid lines while recording
  //   CTX.stroke(triangle.path);
  //   CTX.strokeStyle = WALL_COLOR;
  //   CTX.globalAlpha = 1; // Change it to default after done
  // });
  // drawLightSource();

  TRIANGLES.forEach(triangle => {
    // Mat the coordinates of the vertices in the original grid to the magnifier
    const p1 = map(new Vector(triangle.point1.x, triangle.point1.y));
    const p2 = map(new Vector(triangle.point2.x, triangle.point2.y));
    const p3 = map(new Vector(triangle.point3.x, triangle.point3.y));
    let path = new Path2D();
    path.moveTo(p1.x, p1.y);
    path.lineTo(p2.x, p2.y);
    path.lineTo(p3.x, p3.y);
    path.closePath();
    if (!triangle.selected) {
      CTX.fillStyle = BACKGROUND_COLOR;
      CTX.strokeStyle = WALL_COLOR;
      CTX.fill(path);
    }
    if(BACKGROUND_COLOR == "#000000") this.ctx.globalAlpha = 0.0; // To remove the grid lines while recording
    CTX.stroke(path);
    CTX.strokeStyle = WALL_COLOR;
    CTX.globalAlpha = 1; // Change it to default after done
  });
  drawLightSource();
}


// Draws the light source point
function drawLightSource() {
  drawCircle(lightSource.x, lightSource.y, 2, LIGHT_SOURCE_COLOR);
}

// Function to let users select triangles by clicking them
function selectTriangle(event) {
  //if (event.button === 2) return;  // Ignore right-clicks
  const x = event.offsetX;
  const y = event.offsetY;
  const magXY = unmap(new Vector(x, y));
  TRIANGLES.forEach(triangle => {
    if (CTX.isPointInPath(triangle.path, magXY.x, magXY.y)) {
      triangle.selected = !triangle.selected;
      if (triangle.selected) {
        SELECTED_TRIANGLES.push(triangle);
      } else {
        const index = SELECTED_TRIANGLES.indexOf(triangle);
        if (index > -1) {
          SELECTED_TRIANGLES.splice(index, 1);
        }
      }
    }
  });
  drawTriangles();
}


// Sets the light source *needs more comments
function setLightSource(event) {
  event.preventDefault();
  const x = event.offsetX;
  const y = event.offsetY;
  lightSource = { x: x, y: y };
  createPhotons();
  drawTriangles();
}

// This function removes line segments that appear twice, since those are internal
function pruneRepeatedBounds() {
  let existingBounds = new Array();
  let internalBounds = new Array();
  BOUNDARIES.forEach(lineSeg => {
    let i = 0;
    for(; i < existingBounds.length; i++) {
      if(lineSeg.equals(existingBounds[i])) {
        internalBounds.push(lineSeg);
        break;
      }
    }
    existingBounds.push(lineSeg);
  });
  console.log("Existing Bounds:", existingBounds);
  console.log("Internal Bounds:", internalBounds);
  let goodBounds = new Array();
  BOUNDARIES.forEach(lineSeg => {
    let a = false;
    let i = 0;
    for(; i < internalBounds.length; i++) {
      if(internalBounds[i].equals(lineSeg)) {
        a = true;
      }
    }
    if(!a) {
      goodBounds.push(lineSeg);
    }
  })
  BOUNDARIES = goodBounds;
}

// Merges line segments, as many as possible
function mergeLineSegments() {
  let done = false;
  while (!done) {
    done = true;
    let newBoundaries = [];
    for (let i = 0; i < BOUNDARIES.length; i++) {
      let merged = false;
      for (let j = i + 1; j < BOUNDARIES.length; j++) {
        let mergedLine = BOUNDARIES[i].merge(BOUNDARIES[j]);
        if (mergedLine !== false) {
          newBoundaries.push(mergedLine);
          BOUNDARIES.splice(j, 1);  // Remove the merged segment
          merged = true;
          done = false;
          break;  // Stop checking this boundary, move to the next one
        }
      }
      if (!merged) {
        newBoundaries.push(BOUNDARIES[i]);
      }
    }
    BOUNDARIES = newBoundaries;
  }
  return done;
}

// Creates the user selected shape
function createShape() {
  // Clear the COORDS list
  COORDS = [];
  BOUNDARIES = new Array();
 
  // Iterate through selected triangles
  SELECTED_TRIANGLES.forEach(triangle => {
    // Extract coordinates of triangle's vertices
    let point1 = triangle.point1;
    let point2 = triangle.point2;
    let point3 = triangle.point3;
        
    // Add vertices' coordinates to COORDS list
    BOUNDARIES.push(new LineSegment(
      point1.x,
      point1.y,
      point2.x,
      point2.y,
    ));
    BOUNDARIES.push(new LineSegment(
      point2.x,
      point2.y,
      point3.x,
      point3.y,
    ));
    BOUNDARIES.push(new LineSegment(
      point3.x,
      point3.y,
      point1.x,
      point1.y,
    ));
    //COORDS.push([point1.x, point1.y]);
    //COORDS.push([point2.x, point2.y]);
    //COORDS.push([point3.x, point3.y]);
  });

  pruneRepeatedBounds();

  let fullyMerged = false;
  // I assert this is O(n^2 * log n)
  while(!fullyMerged) {
    // We just keep merging until we can't
    fullyMerged = mergeLineSegments();
  }

  // Find the line segment with the largest y1 and y1 == y2
  let maxYLineSegment = null;
  let maxY = -Infinity;

  BOUNDARIES.forEach(lineSeg => {
    if (lineSeg.y1 === lineSeg.y2 && lineSeg.y1 > maxY) {
      maxY = lineSeg.y1;
      maxYLineSegment = lineSeg;
    }
  });

  // Move the light source to the middle of this line segment
  if (maxYLineSegment) {
    if (M % 2 === 0) {
      if (maxYLineSegment.x1 < maxYLineSegment.x2) {
        lightSource["x"] = maxYLineSegment.x1 + (TRIANGLE_SIDE * (1/(2*M)));
        lightSource["y"] = maxYLineSegment.y1;
      }
      else {
        lightSource["x"] = maxYLineSegment.x2 + (TRIANGLE_SIDE * (1/(2*M)));
        lightSource["y"] = maxYLineSegment.y1;
      }
    }
    else {
      if (maxYLineSegment.x1 < maxYLineSegment.x2) {
        lightSource["x"] = maxYLineSegment.x1 + (TRIANGLE_SIDE * (1/2));
        lightSource["y"] = maxYLineSegment.y1;
      }
      else {
        lightSource["x"] = maxYLineSegment.x2 + (TRIANGLE_SIDE * (1/2));
        lightSource["y"] = maxYLineSegment.y1;
      }
    }
    updateScreen();
  }
  
  BOUNDARIES.forEach(lineSeg => {
    COORDS.push([lineSeg.x1, lineSeg.y1]);
    COORDS.push([lineSeg.x2, lineSeg.y2]);
  })

  const setCOORDS = new Set(COORDS.map(JSON.stringify));
  COORDS = Array.from(setCOORDS).map(JSON.parse);

  // Log the COORDS and Boundaries list
  console.log("COORDS Array:", COORDS);
  console.log("Boundaries Array:", BOUNDARIES);
  drawTriangles();
}

// Creates the user selected shape
function createShape2() {
  // Clear the COORDS list
  COORDS = [];
  BOUNDARIES = new Array();
 
  // Iterate through selected triangles
  SELECTED_TRIANGLES.forEach(triangle => {
    // Extract coordinates of triangle's vertices
    let point1 = triangle.point1;
    let point2 = triangle.point2;
    let point3 = triangle.point3;
        
    // Add vertices' coordinates to COORDS list
    BOUNDARIES.push(new LineSegment(
      point1.x,
      point1.y,
      point2.x,
      point2.y,
    ));
    BOUNDARIES.push(new LineSegment(
      point2.x,
      point2.y,
      point3.x,
      point3.y,
    ));
    BOUNDARIES.push(new LineSegment(
      point3.x,
      point3.y,
      point1.x,
      point1.y,
    ));
    //COORDS.push([point1.x, point1.y]);
    //COORDS.push([point2.x, point2.y]);
    //COORDS.push([point3.x, point3.y]);
  });

  pruneRepeatedBounds();

  let fullyMerged = false;
  // I assert this is O(n^2 * log n)
  while(!fullyMerged) {
    // We just keep merging until we can't
    fullyMerged = mergeLineSegments();
  }
  
  BOUNDARIES.forEach(lineSeg => {
    COORDS.push([lineSeg.x1, lineSeg.y1]);
    COORDS.push([lineSeg.x2, lineSeg.y2]);
  })

  const setCOORDS = new Set(COORDS.map(JSON.stringify));
  COORDS = Array.from(setCOORDS).map(JSON.parse);

  // Log the COORDS and Boundaries list
  console.log("COORDS Array:", COORDS);
  console.log("Boundaries Array:", BOUNDARIES);
  drawTriangles();
  changeLightSourceCoordinates();
}

function startAnimation() {
  ANGLE = (180/Math.PI)*(Math.atan(M/N));
  clearInterval(RENDER_INTERVAL);
  createPhotons();
  RENDER_INTERVAL = setInterval(updateScreen, RENDER_INTERVAL_TIME);
}

function startMultiAnimation() {
  PHOTONS = [];
  clearInterval(RENDER_INTERVAL);
  RENDER_INTERVAL = setInterval(updateScreen, RENDER_INTERVAL_TIME);
  const maxM = M;
  const maxN = N;
  for (i = 0; i <= maxM; i++) {
      for (j = 0; j <= maxN; j++) {
          M = i;
          N = j;
          //console.log(M);
          //console.log(N);
          ANGLE = (180/Math.PI)*(Math.atan(M/N));
          TAIL_SIZE = (TRIANGLE_SIDE/M)*Math.sin(Math.atan(M/N));
          addPhoton2();
      }
  }
}

function startMultiAnimation2() {
  PHOTONS = [];
  clearInterval(RENDER_INTERVAL);
  RENDER_INTERVAL = setInterval(updateScreen, RENDER_INTERVAL_TIME);
  const maxM = M;
  const maxN = N;
  for (i = 0; i <= maxM; i++) {
      for (j = 0; j <= maxN; j++) {
          M = i;
          N = j;
          //console.log(M);
          //console.log(N);
          ANGLE = (180/Math.PI)*(Math.atan(M/N));
          TAIL_SIZE = (TRIANGLE_SIDE/M)*Math.sin(Math.atan(M/N));
          addPhoton();
      }
  }
}

function stopAnimation() {
  clearInterval(RENDER_INTERVAL);
}

// Creates photon
function createPhotons() {
  PHOTONS = [];
  PHOTONS.push(new Photon(
      lightSource.x + PHOTON_RADIUS * Math.cos(Math.PI * (-ANGLE / 180)), 
      lightSource.y + PHOTON_RADIUS * Math.sin(Math.PI * (-ANGLE / 180)), 
      Math.PI * (-ANGLE / 180), 
      (SPEED_TIMES_TEN/10),
      PHOTON_HEAD_COLOR, 
      PHOTON_TAIL_COLOR,
      TAIL_SIZE)
      );
  PHOTONS.push(new Photon(
      lightSource.x + PHOTON_RADIUS * Math.cos(Math.PI * (-ANGLE / 180)), 
      lightSource.y + PHOTON_RADIUS * Math.sin(Math.PI * (-ANGLE / 180)), 
      Math.PI * (-ANGLE / 180), 
      (SPEED_TIMES_TEN/10),
      PHOTON_HEAD_COLOR, 
      PHOTON_TOP_COLOR,
      Math.min(2,(TAIL_SIZE/5)))
      );
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Adds new photon
function addPhoton() {
  PHOTONS.push(new Photon(
    lightSource.x + PHOTON_RADIUS * Math.cos(Math.PI * (-ANGLE / 180)), 
    lightSource.y + PHOTON_RADIUS * Math.sin(Math.PI * (-ANGLE / 180)), 
    Math.PI * (-((180/Math.PI)*(Math.atan(M/N))) / 180), 
    (SPEED_TIMES_TEN/10),
    getRandomColor(), 
    getRandomColor(),
    TAIL_SIZE)
    );
  PHOTONS.push(new Photon(
    lightSource.x + PHOTON_RADIUS * Math.cos(Math.PI * (-ANGLE / 180)), 
    lightSource.y + PHOTON_RADIUS * Math.sin(Math.PI * (-ANGLE / 180)), 
    Math.PI * (-((180/Math.PI)*(Math.atan(M/N))) / 180), 
    (SPEED_TIMES_TEN/10),
    getRandomColor(), 
    getRandomColor(),
    Math.min(2,(TAIL_SIZE/5)))
    );
}

// Adds new photon
function addPhoton2() {
  PHOTONS.push(new Photon(
    lightSource.x + PHOTON_RADIUS * Math.cos(Math.PI * (-ANGLE / 180)), 
    lightSource.y + PHOTON_RADIUS * Math.sin(Math.PI * (-ANGLE / 180)), 
    Math.PI * (-((180/Math.PI)*(Math.atan(M/N))) / 180), 
    (SPEED_TIMES_TEN/10),
    PHOTON_HEAD_COLOR, 
    PHOTON_TAIL_COLOR,
    TAIL_SIZE)
    );
  PHOTONS.push(new Photon(
    lightSource.x + PHOTON_RADIUS * Math.cos(Math.PI * (-ANGLE / 180)), 
    lightSource.y + PHOTON_RADIUS * Math.sin(Math.PI * (-ANGLE / 180)), 
    Math.PI * (-((180/Math.PI)*(Math.atan(M/N))) / 180), 
    (SPEED_TIMES_TEN/10),
    PHOTON_HEAD_COLOR, 
    PHOTON_TOP_COLOR,
    Math.min(2,(TAIL_SIZE/5)))
    );
}

// Updates the screen
function updateScreen() {
  rayTracedUpdatePositions();
  drawTriangles();
  drawPhotons();
  drawTriangles2();
  drawLightSource();
  if (CURRENTLY_RECORDING) {
    VIDEO.add(CTX);
    NUM_CAPTURED_FRAMES++;
    if (NUM_CAPTURED_FRAMES % 33 === 0) {
      const secs = NUM_CAPTURED_FRAMES / 33;
      displayStatus(`Recording: captured ${secs} second(s) of film so far...`);
    }
  }
}
function reDraw() {
  drawTriangles();
  drawPhotons();
  drawTriangles2();
  drawLightSource();
}

// For a given photon, we want the first boundary it collides with this frame
function getClosestCollision(photon) {
    let closestCollision = null;
    for(let edge = 0; edge < BOUNDARIES.length; ++edge) { // Go through all boundaries
      const result = photon.checkCollision(BOUNDARIES[edge]);
      if(result == null) {
        continue;
      }
      // photonScalar tells us how "far" a collision is
      if(closestCollision == null || (result.photonScalar < closestCollision.photonScalar)) {
        closestCollision = result;
      }
    }
    return closestCollision;
}

// We calculate the path of each photon for this frame
function rayTracedUpdatePositions() {
  for(let i = 0; i < PHOTONS.length; ++i) {
    // A photon can reflect multiple times in a frame, hence we track the magnitude of the vector representing it's remaining movement
    while(PHOTONS[i].vecDirRemaining.mag > 0.0001) {
      //console.log("PHOTONS["+i+"].vecDirRemaining.mag =", PHOTONS[i].vecDirRemaining.mag);
      let closestCollision = getClosestCollision(PHOTONS[i]);
      if(closestCollision == null) { // No bounce
        break;
      }
      if(closestCollision.onCorner == true) {
        PHOTONS[i].deactivate(); // Deactivate photon that hits a corner
      }
      PHOTONS[i].bounceOffSegment(closestCollision); // Bounce off edge
    }
  }
  // Move the photons.
  for (var i = 0; i < PHOTONS.length; ++i) {
    PHOTONS[i].updatePosition();
  }
}

// Draws the Photons
function drawPhotons() {
  PHOTONS.forEach(photon => {
    const len = photon.contactPoints.length;
    for (let i = 0; i < len - 1; i++) {
      drawLine(
        photon.contactPoints[i][0],
        photon.contactPoints[i][1],
        photon.contactPoints[i + 1][0],
        photon.contactPoints[i + 1][1],
        photon.tailColor,
        photon.tailSize * TOTAL_ZOOM
      );
    }
    drawLine(
      photon.contactPoints[len - 1][0],
      photon.contactPoints[len - 1][1],
      photon.x,
      photon.y,
      photon.tailColor,
      photon.tailSize * TOTAL_ZOOM
    );
  });
}

function drawCircle(x, y, radius, color) {
  const pos = map(new Vector(x, y));
  CTX.beginPath();
  CTX.fillStyle = color; 
  CTX.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
  CTX.fill();
}

function drawLine(x1, y1, x2, y2, color, width = TAIL_SIZE) {
  const pos1 = map(new Vector(x1, y1));
  const pos2 = map(new Vector(x2, y2));
  CTX.beginPath();
  CTX.strokeStyle = color;
  CTX.lineWidth = width;
  CTX.moveTo(pos1.x, pos1.y);
  CTX.lineTo(pos2.x, pos2.y);
  CTX.stroke();
  CTX.lineWidth = 1.0;
}

// Draws the boundries of the user selected shape
function drawBounds() {
  // Takes all the lines from the BOUNDARIES array and draws a line at them
  BOUNDARIES.forEach(lineSeg => {
  drawLine(lineSeg.x1, lineSeg.y1, lineSeg.x2, lineSeg.y2, BOUND_COLOR, 3);
  });
  // Takes all the points from the COORDS array and draws a circle at them
  COORDS.forEach(coord => {drawCircle(coord[0], coord[1], 1.5, BOUND_COLOR)});
}

// Recording:
function startRecording() {
  VIDEO = new Whammy.Video(33);
  NUM_CAPTURED_FRAMES = 0;
  if (CURRENTLY_RECORDING) {
    return;
  }
  if (!confirm('This feature only works on Firefox right now. Proceed?')) {
    return;
  }
  CURRENTLY_RECORDING = true;
}

function stopRecording() {
  if (!CURRENTLY_RECORDING) {
    return;
  }
  CURRENTLY_RECORDING = false;
  VIDEO.compile(false, function (output) {
    RECORDING.src = URL.createObjectURL(output);
    DOWNLOAD_BUTTON.href = RECORDING.src;
    displayStatus('Recording complete.');
  });
}

// Recording Status
function displayStatus(text) {
  STATUS_ELEMENT.innerText = `Status: ${text}`;
}

function startAnimationAndRecording() {
  startAnimation();
  startRecording();
}