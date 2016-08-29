//shaders.js ------------------------------------------------------------------

// Vertex shader program
var VSHADER_SOURCE =
	' attribute vec4 a_Position ;\n' +
	' attribute float a_PointSize ;\n' +
	' attribute vec4 a_Color;\n' +
	' varying vec4 v_Color;\n' +
	' uniform mat4 u_xformMatrix;\n' +
	' attribute vec2 a_TexCoord;\n' +
	' varying vec2 v_TexCoord;\n' +
 	'void main() {\n' + 	 	
 	' 	//gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' +
 	'	//gl_Position = a_Position;\n' +
 	' 	gl_Position = a_Position * u_xformMatrix;\n' +
 	'	//gl_PointSize = 10.0;\n' +
 	' 	gl_PointSize = a_PointSize;\n' +
 	' 	v_Color = a_Color;\n' +
 	'   v_TexCoord = a_TexCoord;\n' +
 	'}\n';

// Fragment shader program
var FSHADER_SOURCE =	
	' precision mediump float;\n' +
	' uniform vec4 u_FragColor;\n' +
	' varying vec4 v_Color;\n' +
	' uniform sampler2D u_Sampler;\n' +
	' varying vec2 v_TexCoord;\n' +
 	'void main() {\n' + 	 	
 	'	//gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
 	' 	gl_FragColor = v_Color;\n' +
 	'   //gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
 	'}\n';