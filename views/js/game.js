//game.js ---------------------------------------------------------------------

//constans
var GAME_SPEED_INDEX = 100;
var FLOATING_DECIMALS = 2;
var LEVEL_BORDER = 1.0;

var VISIBLE_DEBUG_INFO = false;
var ANIMATED_BALL = true;

//shader variables
var a_Position;
var a_PointSize;
var a_Color;
var u_xformMatrix;
var a_TexCoord;

//game loop and fps variables
var fps = GAME_SPEED_INDEX;
var now;
var then;
var interval = 1000 / fps;
var delta;
var lastCalledTime;

var racket = {
	cmx : 0.9,				//constans webgl matrix x coordinate (init coordinate)
	cmy : 0.2,				//constans webgl matrix y coordinate (init coordinate)
	cw  : 0.05,				//constans racket width
	ch  : 0.4,				//constans racket height
	tx  : 0,				//webgl transformation x (only use in the transformation matrix)
	ty  : 0,				//webgl transformation y (only use in the transformation matrix)
	wx  : 0,				//world x corrdinate
	wy  : 0,				//world y corrdinate
	sp  : 0.1,				//speed
};

var ball = {
	cmx : 0.1,				//constans webgl matrix x coordinate (init coordinate)
	cmy : 0.0,				//constans webgl matrix y coordinate (init coordinate)
	cd  : 0.1,				//constans ball diamater
	tx  : 0,				//webgl transformation x (only use in the transformation matrix)
	ty  : 0,				//webgl transformation y (only use in the transformation matrix)
	wx  : 0,				//world x corrdinate
	wy  : 0,				//world y corrdinate
	dr  : 0,				//direction 0: right-top, 1: right-bottom, 2: left-bottom, 3: left-top
	sp  : 0.03,				//speed
};

//webgl object matrices
var racketVertices = new Float32Array([
	-racket.cmx,  			 racket.cmy,  			  1.0,  1.0, 0.0, 0.0,
	-racket.cmx, 			 racket.cmy - racket.ch,  1.0,  1.0, 0.0, 0.0,
	-racket.cmx + racket.cw, racket.cmy,  			  1.0,  1.0, 0.0, 0.0,
	-racket.cmx + racket.cw, racket.cmy - racket.ch,  1.0,  1.0, 0.0, 0.0
]);
/*
var ballVertices = new Float32Array([
	-ball.cmx,  		 ball.cmy,  		  1.0,  0.5, 0.5, 0.0, 0.0, 1.0,
	-ball.cmx,  		 ball.cmy - ball.cd,  1.0,  0.5, 0.5, 0.0, 0.0, 0.0,
	 ball.cmx - ball.cd, ball.cmy,  		  1.0,  0.5, 0.5, 0.0, 1.0, 1.0,
	 ball.cmx - ball.cd, ball.cmy - ball.cd,  1.0,  0.5, 0.5, 0.0, 1.0, 0.0
]);
*/
var ballVertices = new Float32Array([
	-ball.cmx,  		 ball.cmy,  		  1.0,  0.5, 0.5, 0.0, 
	-ball.cmx,  		 ball.cmy - ball.cd,  1.0,  0.5, 0.5, 0.0, 
	 ball.cmx - ball.cd, ball.cmy,  		  1.0,  0.5, 0.5, 0.0, 
	 ball.cmx - ball.cd, ball.cmy - ball.cd,  1.0,  0.5, 0.5, 0.0
]);

function initGame() {
	//shader variables assigments
	a_Position = gl.getAttribLocation(glProgram, 'a_Position');
	a_PointSize = gl.getAttribLocation(glProgram, 'a_PointSize');
	a_Color = gl.getAttribLocation(glProgram, 'a_Color');
	u_xformMatrix = gl.getUniformLocation(glProgram, 'u_xformMatrix');
	a_TexCoord = gl.getAttribLocation(glProgram, 'a_TexCoord');	

	//racket world coordinates (left-top vertex coordinate)
	racket.wx = ffix(-racket.cmx);
	racket.wy = ffix((racket.ty + racket.cmy));
	//console.log('racket.ty: ' + racket.ty);
	//console.log('racket.wy: ' + racket.wy);

	//ball world coordinates (left-top vertex coordinate)
	ball.wx = ffix(-ball.cmx);
	ball.wy = ffix(ball.cmy);
	ball.dr = 3;

	document.addEventListener("keydown", keyDownHandler, true);
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

function keyDownHandler(event) {	
	if (event.keyCode == 38) {	//up
		racket.ty += racket.sp;
	}
	if (event.keyCode == 40) {	//down		
		racket.ty -= racket.sp;
	}
	if (event.keyCode == 37) {	//left		
		
	}
	if (event.keyCode == 39) {	//right				
		
	}
	if (event.keyCode == 32) {	//space - fire

	}	
	racket.wx = ffix((racket.tx - racket.cmx));
	racket.wy = ffix((racket.ty + racket.cmy));	
	racketWallCollision();
	//console.log('racket.ty: ' + racket.ty);
	//console.log('racket.wy: ' + racket.wy);
	//console.log('racket.wx: ' + racket.wx + ' racket.wy: ' + racket.wy);
}

function racketWallCollision() {
	if(racket.wy > LEVEL_BORDER) {						//top wall
		racket.wy = LEVEL_BORDER;
		racket.ty = racket.wy - racket.cmy;
	}
	if((racket.wy - racket.ch) < -LEVEL_BORDER) {		//bottom wall
		racket.wy = -LEVEL_BORDER;
		racket.ty = racket.wy + racket.cmy;
	}
	racket.wy = ffix((racket.ty + racket.cmy));			//recalculation
}

/*
 * The webgl system is right handed because the vertical directions is inverted!!!
 */
function moveBall() {			
	switch(ball.dr) {
		case 0 : ball.tx += ball.sp; ball.ty += ball.sp; break;	//0: right-top
		case 1 : ball.tx += ball.sp; ball.ty -= ball.sp; break;	//1: right-bottom
		case 2 : ball.tx -= ball.sp; ball.ty -= ball.sp; break;	//2: left-bottom
		case 3 : ball.tx -= ball.sp; ball.ty += ball.sp; break;	//3: left-top
		//test
		case 5 : ball.tx -= ball.sp; break;
		case 6 : ball.ty += ball.sp; break;
	}		
	ball.wx = ffix((-ball.cmx + ball.tx));
	ball.wy = ffix((ball.cmy + ball.ty));
	ballCollision();
	//console.log('ball.wx: ' + ball.wx + ' ball.wy: ' + ball.wy);
}

function ballCollision() {	
	if(ball.wy > LEVEL_BORDER) {					//top wall				
		//console.log('ball.wx: ' + ball.wx + ' ball.wy: ' + ball.wy + ' ball.dr: ' + ball.dr);
		if(ball.dr === 0) {
			ball.dr = 1;			
		}
		if(ball.dr === 3) {
			ball.dr = 2;			
		}				
	}
	if((ball.wy - ball.cd) < -LEVEL_BORDER) {	//bottom wall	
		//console.log('ball.wx: ' + ball.wx + ' ball.wy: ' + ball.wy + ' ball.dr: ' + ball.dr);	
		if(ball.dr === 1) {
			ball.dr = 0;			
		}
		if(ball.dr === 2) {
			ball.dr = 3;			
		}
	}
	if(ball.wx < -LEVEL_BORDER) {				//left wall
		//console.log('ball.wx: ' + ball.wx + ' ball.wy: ' + ball.wy + ' ball.dr: ' + ball.dr);
		if(ball.dr === 2) {
			ball.dr = 1;			
		}
		if(ball.dr === 3) {		
			ball.dr = 0;	
		}
	}
	if(ball.wx > LEVEL_BORDER - ball.cd) {		//right wall
		//console.log('ball.wx: ' + ball.wx + ' ball.wy: ' + ball.wy + ' ball.dr: ' + ball.dr);
		if(ball.dr === 1) {
			ball.dr = 2;
		}
		if(ball.dr === 0) {
			ball.dr = 3;			
		}
	}	
	if(ball.wx <= (racket.wx + racket.cw) && collisionRacket()) {		//racket
		//console.log('ball.wx: ' + ball.wx + ' ball.wy: ' + ball.wy + ' ball.dr: ' + ball.dr);
		if(ball.dr === 2) {
			ball.dr = 1;			
		}
		if(ball.dr === 3) {		
			ball.dr = 0;	
		}
	}
}

function collisionRacket() {
	if(racket.wy >= 0) {
		if(ball.wy <= racket.wy && ball.wy >= racket.wy - racket.ch) {		//if racket.wy is in the positive domain
			return true;
		}
	} else if(racket.wy < 0) {
		if(ball.wy <= racket.wy && ball.wy >= racket.wy - racket.ch) {		//if racket.wy is in the negative domain
			return true;
		}
	}
	return false;
}

function draw() {

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	//player racket
	gl.uniformMatrix4fv(u_xformMatrix, false, translateMatrice(racket.tx, racket.ty, 0));
	var n = initPlayerRacket(gl);	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

	//ball
	gl.uniformMatrix4fv(u_xformMatrix, false, translateMatrice(ball.tx, ball.ty, 0));
	var m = initBall(gl);
	//textureDraw(gl, m);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, m);

	/*
	gl.uniformMatrix4fv(u_xformMatrix, false, translateMatrice(ball.tx, ball.ty, 0));
	var m = initBall(gl);	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, m);
	*/

	/*
	gl.vertexAttrib3f(0.0, 0.0, 0.0, 1.0);
	gl.drawArrays(gl.POINTS, 0, 1);	
	*/
}

function textureDraw(gl, n) {
	var texture = gl.createTexture();
	var u_Sampler = gl.getUniformLocation(glProgram, 'u_Sampler');
	image = new Image();

	image.onload = function() {		
		loadTexture(gl, n, texture, u_Sampler, image);			
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
	};	
	image.src = 'brick001.jpg';
	//image.src = 'ball_texture.png';
}

function loadTexture(gl, n, texture, u_Sampler, image) {
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);	
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);	
	gl.uniform1i(u_Sampler, 0);	
}

//http://stackoverflow.com/questions/22941695/webgl-vertex-space-coordinates
function initPlayerRacket(gl) {
	var allBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, allBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, racketVertices, gl.STATIC_DRAW);

	var FSIZE = racketVertices.BYTES_PER_ELEMENT;
	
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0);
	gl.enableVertexAttribArray(a_Position);
	
	gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
	gl.enableVertexAttribArray(a_PointSize);
	
	gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
	gl.enableVertexAttribArray(a_Color);

	return (racketVertices.length / 6);
}

function initBall(gl) {
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
	/*
	gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 6);
	gl.enableVertexAttribArray(a_TexCoord);
	*/
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

function ffix(fnum) {
	var str = fnum.toFixed(FLOATING_DECIMALS);
	//console.log('fnum: ' + fnum + ' strNum: ' + str + ' parseFloat: ' + parseFloat(str));
	return parseFloat(str);
}

window.onload = function() {
	init();
	initGame();	
	gameLoop();	
}