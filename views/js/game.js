//game.js

function initGame() {
	
}

function draw() {
	var a_Position = gl.getAttribLocation(glProgram, 'a_Position'); 	
 	var a_PointSize = gl.getAttribLocation(glProgram, 'a_PointSize'); 	
 	var u_FragColor = gl.getUniformLocation(glProgram, 'u_FragColor');

 	gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
 	gl.vertexAttrib1f(a_PointSize, 5.0);
 	gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0); 	

 	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.vertexAttrib3f(0.0, 0.0, 0.0, 1.0);
	gl.drawArrays(gl.POINTS, 0, 1);
}

window.onload = function() {
	init();
	initGame();
	draw();
}