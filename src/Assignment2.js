"use strict";

var canvas;
var gl;

var points = [];
var colors = [];

var vertBufferId;
var colorBufferId;

let redComponent = 0;
let greenComponent = 0;
let blueComponent = 0;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    if (!canvas) {
        alert("Canvas not found");
        return;
    }

    gl = WebGLUtils.setupWebGL(canvas, {preserveDrawingBuffer: true});
    if (!gl) {
        alert("WebGL isn't available");
        return;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    vertBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 16, gl.DYNAMIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    colorBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 32, gl.DYNAMIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    let drawing = false;
    canvas.addEventListener("mousedown", function (e) {
        drawing = true;
        addPoint(e.x, e.y);
        addPoint(e.x-1, e.y-1); //add it twice so will will add this, allows the user to draw a single point.
                            //this doesn't work, is it because the points are exactly the same?
        render();
    });

    canvas.addEventListener("mousemove", function (e) {
        if (drawing) {
            addPoint(e.x, e.y);
        }
        
        render();
    });

    canvas.addEventListener("mouseup", function () {
        drawing = false;
        points = [];
    });

    canvas.addEventListener("mouseleave", function () {
        drawing = false;
        points = [];
    });

    document.getElementsByTagName("body")[0].onmousemove = function (e) {
        document.getElementById("mouse_coord").innerHTML = e.x + "," + e.y
    }

    document.getElementById("btnClear").onclick = function (e) {
        clear();
    }

    document.getElementById("red-slider").onchange = function (e) {
        let color = document.getElementById("red-color");
        let text = document.getElementById("red-text");
        let white = document.getElementById("all-color");
               
        redComponent = e.target.value / 255;

        color.style.backgroundColor = "rgb(" + redComponent * 255 + ",0,0)";
        text.value = redComponent;
        white.style.background = "rgb(" + redComponent * 255 + "," + greenComponent * 255 + "," + blueComponent * 255 + ")";
    }

    document.getElementById("green-slider").onchange = function (e) {
        let color = document.getElementById("green-color");
        let text = document.getElementById("green-text");
        let white = document.getElementById("all-color");

        greenComponent = e.target.value / 255;

        color.style.backgroundColor = "rgb(0," + greenComponent * 255 + ",0)";
        text.value = greenComponent;
        white.style.background = "rgb(" + redComponent * 255 + "," + greenComponent * 255 + "," + blueComponent * 255 + ")";
    }

    document.getElementById("blue-slider").onchange = function (e) {
        let color = document.getElementById("blue-color");
        let text = document.getElementById("blue-text");
        let white = document.getElementById("all-color");

        blueComponent = e.target.value / 255;

        color.style.backgroundColor = "rgb(0,0," + blueComponent * 255 + ")";
        text.value = blueComponent;
        white.style.background = "rgb(" + redComponent * 255 + "," + greenComponent * 255 + "," + blueComponent * 255 + ")";
    }

    
    document.getElementById("red-color").style.backgroundColor = "rgb(" + redComponent * 255 + ",0,0)";
    document.getElementById("red-text").value = redComponent;

    document.getElementById("green-color").style.backgroundColor = "rgb(0," + greenComponent * 255 + ",0)";
    document.getElementById("green-text").value = greenComponent;
    
    document.getElementById("blue-color").style.backgroundColor = "rgb(0,0," + blueComponent * 255 + ")";
    document.getElementById("blue-text").value = blueComponent;

    document.getElementById("all-color").style.background = "rgb(" + redComponent * 255 + "," + greenComponent * 255 + "," + blueComponent * 255 + ")";
    
    //document.getElementById("line-width").onchange = function (e) {
    //    document.getElementById("line-text").value = e.target.value;
    //    gl.lineWidth(e.target.value);
    //}

    //document.getElementById("line-text").value = 1;
    

    render();
    clear();
}

function translate(x, dir)
{
    let bHdir = dir === "h" ? true : false;
    x = x / (bHdir ? canvas.width : canvas.height);
    return (2 * x + -1) * (bHdir ? 1 : -1);
}

function addPoint(x, y, c) {
    x = translate(x-8, "h");
    y = translate(y-8   , "v");
    points.push(x, y);
    while (points.length > 4)
        points.shift();

}

function clear() {
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function render()
{
    //gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertBufferId);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten([redComponent, greenComponent, blueComponent, 1.0, redComponent, greenComponent, blueComponent, 1.0]));
    //gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten([1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0]));

    gl.drawArrays(gl.LINE_STRIP, 0, points.length /  2);
}
