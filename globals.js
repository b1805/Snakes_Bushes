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

// These represent the main canvas we draw on
const CANVAS = document.getElementById('canvas'); // The main canvas
const CTX = CANVAS.getContext('2d', { willReadFrequently: true }); // Canvas contexts are used to draw on and read from

// Style values
let BACKGROUND_COLOR = '#FFFFFF';
let WALL_COLOR = '#A000C8';
let PHOTON_TAIL_COLOR = '#FFA500';
let PHOTON_TOP_COLOR = '#009DFF';
let PHOTON_HEAD_COLOR = '#E1FF00';
let LIGHT_SOURCE_COLOR = '#00FF00';
let BOUND_COLOR = "#FF0000";
let DRAG_LINE_COLOR = "#FF0000";
let PART_COLOR = '#FF0000';

let SHOW_PART = true;
let IS_ON_HORIZONTAL_BOUND_VAR = false;
let IS_ON_VERTICAL_BOUND_VAR = false;
let IS_ON_HYPO_BOUND_VAR = false;
let IS_ON_CORNER_VAR = false;
let PHOTON_RADIUS = 2.50; // Distance away from source
//let NUMBER_LIGHT_RAYS = 360;
let ANGLE = 45;
let M = 1;
let N = 1;
let TRIANGLE_SIDE = 100;
const RENDER_INTERVAL_TIME = 33;
let SPEED_TIMES_TEN = 500;
let HEAD_SIZE = 3.00;
let TAIL_SIZE = (TRIANGLE_SIDE/M)*Math.sin(Math.atan(M/N));
let TAIL_SIZE_2 = 2.00;
let CORNER_EPS = 0.001; // Radius of the epsilon ball around each corner for collision detection

//For magnification and dragging
var ZOOM_INPUT = document.getElementById('zoomInput');
var SELECT_BUTTON = document.getElementById('selectButton');
var MAGNIFY_BUTTON = document.getElementById('magnifyButton');
var DEMAGNIFY_BUTTON = document.getElementById('demagnifyButton');
var CENTER_BUTTON = document.getElementById('centerButton');
let TOTAL_ZOOM = 1;
let X_TRANS = 0;
let Y_TRANS = 0;
let X_START = 0;
let Y_START = 0;
let X_END = 0;
let Y_END = 0;
let DRAGGING = false;
let MOUSE_DOWN = false;

let TRIANGLES = [];
let SELECTED_TRIANGLES = [];
let BOUNDARIES = [];
let PARTITIONS = [];
let COORDS = [];
var PHOTONS = [];
var RENDER_INTERVAL;

let VIDEO = new Whammy.Video(33);
var CURRENTLY_RECORDING = false;
var RECORDING = document.getElementById('recording');
var DOWNLOAD_BUTTON = document.getElementById('downloadButton');
var STATUS_ELEMENT = document.getElementById('status');
var NUM_CAPTURED_FRAMES = 0;

let SCREEN_ZOOM = 0.97 * (window.innerWidth / 1850);

let lightSource = { x: 450, y: 400 };
