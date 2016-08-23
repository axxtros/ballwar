//init.js

var canvas = null;
var gl = null;
var glProgram = null;

function init() {
	canvas = document.getElementById("gamecanvas");
	gl = canvas.getContext("webgl", true) || canvas.getContext("experimental-webgl", true);	
	if(!gl) {
		console.log('ERROR (game.js : init() ): Failed to get the rendering contect for WebGL!');
		return;	
	}
	initShaders();
}

function initShaders() {		
	vertexShader = cmpShader(VSHADER_SOURCE, gl.VERTEX_SHADER);
	fragmentShader = cmpShader(FSHADER_SOURCE, gl.FRAGMENT_SHADER);
	
	glProgram = gl.createProgram();
	gl.attachShader(glProgram, vertexShader);
	gl.attachShader(glProgram, fragmentShader);
	gl.linkProgram(glProgram);
	
	if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
		console.log("Unable to initialize the shader program.");
	}				
	gl.useProgram(glProgram);
}

function cmpShader(src, type) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader, src);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.log("Error compiling shader: " + gl.getShaderInfoLog(shader));
	}
	return shader;
}