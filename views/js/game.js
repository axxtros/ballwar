//game.js ---------------------------------------------------------------------

//constans
var VISIBLE_DEBUG_INFO = false;
var GAME_SPEED_INDEX = 5;

//shader variables
var a_Position;
var a_PointSize;
var a_Color;
var u_xformMatrix;

//game fps variables
var fps = GAME_SPEED_INDEX;
var now;
var then;
var interval = 1000 / fps;
var delta;
var lastCalledTime;

var ry;
var wry;
var rh;
var bx, by; 
var ballDirection;	//0: right-top, 1: right-bottom, 2: left-bottom, 3: left-top

var ANIMATED_BALL = true;

function initGame() {
	//shader variables assigments
	a_Position = gl.getAttribLocation(glProgram, 'a_Position');
	a_PointSize = gl.getAttribLocation(glProgram, 'a_PointSize');
	a_Color = gl.getAttribLocation(glProgram, 'a_Color');
	u_xformMatrix = gl.getUniformLocation(glProgram, 'u_xformMatrix');

	document.addEventListener("keydown", keyDownHandler, true);

	ry = 0;
	wry = ry + 0.2;
	rh = 0.4;
	bx = 0;
	by = 0;
	ballDirection = 5;

	then =  Date.now();	
}

function gameLoop() {
	requestAnimationFrame(gameLoop);

	if(VISIBLE_DEBUG_INFO) {
		console.log('game loop running...');
		fpsCalculation();
	}	
		
	draw();

	now = Date.now();
    delta = now - then;
    if (delta > interval) {    	
    	if(ANIMATED_BALL) {
			moveBall();
    	}    	
    	then = now - (delta % interval);
    }
}

/*
 * The webgl system is right handed because the vertical directions is inverted!!!
 */
function moveBall() {
	switch(ballDirection) {
		case 0 : bx += 0.1; by += 0.1; break;	//0: right-top
		case 1 : bx += 0.1; by -= 0.1; break;	//1: right-bottom
		case 2 : bx -= 0.1; by -= 0.1; break;	//2: left-bottom
		case 3 : bx -= 0.1; by += 0.1; break;	//3: left-top

		case 5 : bx -= 0.1; break;
		case 6 : by += 0.1; break;
	}	
	ballCollision();
}

function ballCollision() {
	/*
	if(by > 1) {
		if(ballDirection === 0) {
			ballDirection = 1;
		}
		if(ballDirection === 3) {
			ballDirection = 2;
		}
		by = 1;
	}
	if(by < -1) {
		if(ballDirection === 1) {
			ballDirection = 0;
		}
		if(ballDirection === 2) {
			ballDirection = 3;
		}
		by = -1;
	}	
	if(bx < -1) {
		if(ballDirection === 2) {
			ballDirection = 1;
		}
		if(ballDirection === 3) {
			ballDirection = 0;
		}
		bx = -1;
	}
	if(bx > 1) {
		if(ballDirection === 1) {
			ballDirection = 2;
		}
		if(ballDirection === 0) {
			ballDirection = 3;
		}
		bx = 1;
	}
	*/
	
	if(bx < -0.7) {		
		console.log('utkozes...');
		console.log('bx: ' + bx + ' by: ' + by);
		console.log('ry: ' + ry);
		bx = -0.7;
		ANIMATED_BALL = false;
	}
	/*
	if(by > 0.7) {
		console.log('utkozes...');
		console.log('bx: ' + bx + ' by: ' + by);
		console.log('ry: ' + ry);
		by = 0.7;
		ANIMATED_BALL = false;	
	}
	*/
}

function draw() {

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	//player racket
	gl.uniformMatrix4fv(u_xformMatrix, false, translateMatrice(0, ry, 0));
	var n = initPlayerRacket(gl);	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

	//ball
	gl.uniformMatrix4fv(u_xformMatrix, false, translateMatrice(bx, by, 0));
	var m = initBall(gl);	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, m);

	/*
	gl.vertexAttrib3f(0.0, 0.0, 0.0, 1.0);
	gl.drawArrays(gl.POINTS, 0, 1);	
	*/
}

function keyDownHandler(event) {	
	if (event.keyCode == 38) {	//up
		ry += 0.1;
	}
	if (event.keyCode == 40) {	//down	
		ry -= 0.1;	
	}
	if (event.keyCode == 37) {	//left		
		
	}
	if (event.keyCode == 39) {	//right				
		
	}
	if (event.keyCode == 32) {	//space - fire
				
	}
	wry = (ry + 0.2);
	//console.log('ry: ' + ry);
	console.log('wry: ' + wry);
	console.log('wry2: ' + (wry - rh));
}

//http://stackoverflow.com/questions/22941695/webgl-vertex-space-coordinates
function initPlayerRacket(gl) {	
	var verticesAndSize = new Float32Array([
		-0.9,  0.2,  1.0,  1.0, 0.0, 0.0,
		-0.9, -0.2,  1.0,  1.0, 0.0, 0.0,
		-0.8,  0.2,  1.0,  1.0, 0.0, 0.0,
		-0.8, -0.2,  1.0,  1.0, 0.0, 0.0
	]);	

	var allBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, allBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, verticesAndSize, gl.STATIC_DRAW);

	var FSIZE = verticesAndSize.BYTES_PER_ELEMENT;
	
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0);
	gl.enableVertexAttribArray(a_Position);
	
	gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
	gl.enableVertexAttribArray(a_PointSize);
	
	gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
	gl.enableVertexAttribArray(a_Color);

	return (verticesAndSize.length / 6);
}

function initBall(gl) {
	var ballVertices = new Float32Array([
		-0.1,  0.1,  0.1,  0.5, 0.5, 0.0,
		-0.1, -0.1,  0.1,  0.5, 0.5, 0.0,
		 0.1,  0.1,  0.1,  0.5, 0.5, 0.0,
		 0.1, -0.1,  0.1,  0.5, 0.5, 0.0
	]);

	var allBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, allBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, ballVertices, gl.STATIC_DRAW);

	var FSIZE = ballVertices.BYTES_PER_ELEMENT;
	
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0);
	gl.enableVertexAttribArray(a_Position);
	
	gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
	gl.enableVertexAttribArray(a_PointSize);
	
	gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
	gl.enableVertexAttribArray(a_Color);

	return (ballVertices.length / 6);
}

//http://www.c-jump.com/bcc/common/Talk3/Math/Matrices/Matrices.html#W01_0110_3d_translation
function translateMatrice(x, y, z) {
	var e = new Float32Array([
		1,0,0,0, 
		0,1,0,0, 
		0,0,1,0, 
		0,0,0,1
	]);
	e[0]  = 1; e[1]  = 0; e[2]  = 0; e[3]  = x;
    e[4]  = 0; e[5]  = 1; e[6]  = 0; e[7]  = y;
    e[8]  = 0; e[9]  = 0; e[10] = 1; e[11] = z;
    e[12] = 0; e[13] = 0; e[14] = 0; e[15] = 1;
    return e;
}

function fpsCalculation() {
	if(!lastCalledTime) {
		lastCalledTime = Date.now();
		var _fps = 0;
		return;
	}
	var delta = (Date.now() - lastCalledTime) / 1000;
	lastCalledTime = Date.now();
	_fps = 1 / delta;
			
	//gl.font = "bold 12px courier";
	//gl.fillText('fps:' + Math.floor(_fps), 2, 10);
	console.log('fps: ' + Math.floor(_fps));
}

window.onload = function() {
	init();
	initGame();	
	gameLoop();	
}