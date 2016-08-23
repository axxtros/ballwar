//shaders.js

// Vertex shader program
var VSHADER_SOURCE =
	' attribute vec4 a_Position ;\n' +
	' attribute float a_PointSize ;\n' +
 	'void main() {\n' + 	 	
 	' 	//gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' +
 	'	gl_Position = a_Position;\n' +
 	'	//gl_PointSize = 10.0;\n' +
 	' 	gl_PointSize = a_PointSize;\n' +
 	'}\n';

// Fragment shader program
var FSHADER_SOURCE =	
	' precision mediump float;\n' +
	' uniform vec4 u_FragColor;\n' +
 	'void main() {\n' + 	 	
 	'	//gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
 	' 	gl_FragColor = u_FragColor;\n' +
 	'}\n';