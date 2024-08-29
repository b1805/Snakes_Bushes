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

// Function to save selected triangles to a file
function saveShape() {
    const shapes = SELECTED_TRIANGLES.map(triangle => {
        return {
            point1: triangle.point1,
            point2: triangle.point2,
            point3: triangle.point3
        };
    });
    const data = JSON.stringify(shapes);
    const blob = new Blob([data], { type: 'text/plain' });
  
    // Prompt the user to enter a filename
    let filename = prompt("Enter the filename:", "shape.txt");
    if (filename === null || filename.trim() === "") {
      filename = "shape.txt"; // Default filename if user cancels or enters an empty name
    }
  
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  }
  
  // Function to load selected triangles from a file
  function loadShape(file) {
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const shapes = JSON.parse(content);
  
        SELECTED_TRIANGLES = shapes.map(shape => {
          // Itrates through the grid and select the triangles in the loaded file
            const triangle = TRIANGLES.find((sTriangle) => (sTriangle.point1.x == shape.point1.x && sTriangle.point1.y == shape.point1.y && sTriangle.point2.x == shape.point2.x && sTriangle.point2.y == shape.point2.y && sTriangle.point3.x == shape.point3.x && sTriangle.point3.y == shape.point3.y))
            triangle.selected = true;
            return triangle;
        });
        createShape();
        drawTriangles();
    };
    reader.readAsText(file);
  }
  
  // Function to save selected settings (globals values) to a file
  function saveSettings() {
    const settings = {
      TRIANGLE_SIDE: TRIANGLE_SIDE,
      CORNER_EPS: CORNER_EPS,
      MOUSE_VISIBILITY_BOOL: mouseVisibilityCheckBox.checked,
      TAIL_SIZE_2: TAIL_SIZE_2,
      PHOTON_RADIUS: PHOTON_RADIUS,
      PART_BOOL: parseInt(document.getElementById("partitionOnOffInput").value),
      SPEED_TIMES_TEN: SPEED_TIMES_TEN,
      M: M,
      N: N,
      lightSource: lightSource,
      ZOOM_INPUT: ZOOM_INPUT.value,
      part_x1: parseInt(document.getElementById("partBoxXInput1").value),
      part_y1: parseInt(document.getElementById("partBoxYInput1").value),
      part_x2: parseInt(document.getElementById("partBoxXInput2").value),
      part_y2: parseInt(document.getElementById("partBoxYInput2").value),
      WALL_COLOR: WALL_COLOR,
      PHOTON_TAIL_COLOR: PHOTON_TAIL_COLOR,
      PHOTON_TOP_COLOR: PHOTON_TOP_COLOR,
      LIGHT_SOURCE_COLOR: LIGHT_SOURCE_COLOR,
      BOUND_COLOR: BOUND_COLOR,
      DRAG_LINE_COLOR: DRAG_LINE_COLOR,
      mode_input: parseInt(document.getElementById("modeInput").value)
    };
    const data = JSON.stringify(settings);
    const blob = new Blob([data], { type: 'text/plain' });
  
    // Prompt the user to enter a filename
    let filename = prompt("Enter the filename:", "setting.txt");
    if (filename === null || filename.trim() === "") {
      filename = "setting.txt"; // Default filename if user cancels or enters an empty name
    }
  
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  }
  
  // Function to load selected settings (globals values) from a file
  function loadSettings(file) {
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const setting = JSON.parse(content);
  
        TRIANGLE_SIDE = setting.TRIANGLE_SIDE;
        document.getElementById("triangleSideInput").value = TRIANGLE_SIDE;
        
        CORNER_EPS = setting.CORNER_EPS;
        document.getElementById("epsilonInput").value = CORNER_EPS;
        
        MOUSE_VISIBILITY_BOOL = setting.MOUSE_VISIBILITY_BOOL;
        if(MOUSE_VISIBILITY_BOOL) {
          mouse_coords.style.display = "inline";
        } else {
          mouse_coords.style.display = "none";
        }
        document.getElementById("mouseVisibilityCheckBox").checked = MOUSE_VISIBILITY_BOOL;

        TAIL_SIZE_2 = setting.TAIL_SIZE_2;
        document.getElementById("tailSize2Input").value = TAIL_SIZE_2;

        PHOTON_RADIUS = setting.PHOTON_RADIUS;
        document.getElementById("sourceDistanceInput").value = PHOTON_RADIUS;
        
        const part_num = setting.PART_BOOL;
        if (part_num === 0) {
          SHOW_PART = false; //Turns Partition/Post off
          // Hides the partition coordinates table:
          //partNote.style.visibility = 'hidden';
          part.style.visibility = 'hidden';
          partButton.style.visibility = 'hidden';
          partX.style.visibility = 'hidden';
          partY.style.visibility = 'hidden';
          part1.style.visibility = 'hidden';
          part2.style.visibility = 'hidden';
          partBoxXInput1.style.display = 'none';
          partBoxYInput1.style.display = 'none';
          partBoxXInput2.style.display = 'none';
          partBoxYInput2.style.display = 'none';
        } else if (part_num === 1) {
          SHOW_PART = true; //Turns Partition/Post on
          // Shows the partition coordinates table:
          //partNote.style.visibility = 'visible';
          part.style.visibility = 'visible';
          partButton.style.visibility = 'visible';
          partX.style.visibility = 'visible';
          partY.style.visibility = 'visible';
          part1.style.visibility = 'visible';
          part2.style.visibility = 'visible';
          partBoxXInput1.style.display = 'inline';
          partBoxYInput1.style.display = 'inline';
          partBoxXInput2.style.display = 'inline';
          partBoxYInput2.style.display = 'inline';
        }
        createShape(); // Update canvas with new coordinates
        document.getElementById("partitionOnOffInput").value = part_num;
  
        SPEED_TIMES_TEN = setting.SPEED_TIMES_TEN;
        document.getElementById("speedInput").value = SPEED_TIMES_TEN;

        M = setting.M;
        document.getElementById("MInput").value = M;

        N = setting.N;
        document.getElementById("NInput").value = N;

        lightSource = setting.lightSource;
        document.getElementById("lightSourceXInput").value = lightSource.x;
        document.getElementById("lightSourceYInput").value = lightSource.y;

        document.getElementById("zoomInput").value = setting.ZOOM_INPUT;

        part_x1 = setting.part_x1;
        part_y1 = setting.part_y1;
        part_x2 = setting.part_x2;
        part_y2 = setting.part_y2;
        PARTITIONS = [new LineSegment(part_x1, part_y1, part_x2, part_y2)]
        createShape(); // Update canvas with new coordinates
        document.getElementById("partBoxXInput1").value = part_x1;
        document.getElementById("partBoxXInput2").value = part_x2;
        document.getElementById("partBoxYInput1").value = part_y1;
        document.getElementById("partBoxYInput2").value = part_y2;

        WALL_COLOR = setting.WALL_COLOR;
        document.getElementById("wallColorInput").value = WALL_COLOR;

        PHOTON_TAIL_COLOR = setting.PHOTON_TAIL_COLOR;
        document.getElementById("photonTailColorInput").value = PHOTON_TAIL_COLOR;

        PHOTON_TOP_COLOR = setting.PHOTON_TOP_COLOR;
        document.getElementById("photonTopColorInput").value = PHOTON_TOP_COLOR;

        LIGHT_SOURCE_COLOR = setting.LIGHT_SOURCE_COLOR;
        document.getElementById("lightSourceColorInput").value = LIGHT_SOURCE_COLOR;

        BOUND_COLOR = setting.BOUND_COLOR;
        document.getElementById("boundColorInput").value = BOUND_COLOR;

        DRAG_LINE_COLOR = setting.DRAG_LINE_COLOR;
        document.getElementById("dragLineColorInput").value = DRAG_LINE_COLOR;

        mode_input = setting.mode_input;
        document.getElementById("modeInput").value = mode_input;

        TRIANGLES = [];
        SELECTED_TRIANGLES = [];
        createTriangleGrid();
        updateScreen();
    };
    reader.readAsText(file);
  }