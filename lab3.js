// Lab 3: Creating A Virtual World
// https://www.youtube.com/watch?v=vNHP_OBk5tw&list=PLbyTU_tFIkcOs7XVopOy5Oti-HGiIZx0J&index=2
//https://stackoverflow.com/questions/36689118/using-varying-at-the-moment-chrome-not-working

// Vertex shader program
const VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ProjectionMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    //gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * a_Position;
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_Color = a_Color;
    v_UV = a_UV;
  }`;

// Fragment shader program
const FSHADER_SOURCE = `
  precision mediump float;
  //varying vec2 v_UV;  
  varying vec4 v_Color;
  void main() {
    //gl_FragColor = vec4(v_UV, 1.0, 1.0);
    gl_FragColor = v_Color;
    //gl_FragColor = vec4(1.0, 0, 0, 1);
  }`;

setUpWebGL = () => {
  // Retrieve <canvas> element
  const canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  const gl = getWebGLContext(canvas);
  if (!gl) throw 'Failed to get the rendering context for WebGL';

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  return {gl, canvas};
}

connectVariablesToGLSL = (gl) => {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) throw 'Failed to intialize shaders.';

  // Get the storage location of a_Position
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) throw 'Failed to get the storage location of a_Position';

  // Get the storage location of a_Position
  let a_UV = 2//gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) throw 'Failed to get the storage location of a_UV';

  // Get the storage location of a_Color
  let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (!a_Color) throw 'Failed to get the storage location of a_Color';

  // Holds all the transformations and pass when drawing
  let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) throw 'Failed to get the storage location of u_ModelMatrix';

  // Camera angle
  let u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) throw 'Failed to get the storage location of u_GlobalRotateMatrix';

  // View matrix
  let u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) throw 'Failed to get the storage location of u_ViewMatrix';

  // Orthographic projection matrix
  let u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) throw 'Failed to get the storage location of u_ProjectionMatrix';
  
  return {
    a_Position, a_UV, a_Color, u_ModelMatrix, u_GlobalRotateMatrix, u_ViewMatrix, u_ProjectionMatrix
  }
}

initArrayBuffer = (data, num, type, attribute) => {
  var buffer = gl.createBuffer();   // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }

  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  //debugger;

  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

let shapesList = [];
const {gl, canvas} = setUpWebGL();
let {
  a_Position, a_UV, a_Color, u_ModelMatrix, u_GlobalRotateMatrix, u_ViewMatrix, u_ProjectionMatrix
} = connectVariablesToGLSL(gl);
let animate = false;
let g_GlobalAngle = document.getElementById('angleSlider').value;
let startTime = performance.now();


let jointAnglesAnimation = {
  // thigh, knee, ankle, metacarpus
  'foreL': [
    [27, -39, 0, 11], [32, -13, -39, 20], 
   ],
  'foreR': [
    [27, -39, 0, 11], [32, -13, -39, 20], 
   ],
  'hindL': [
    [18, 21, 28, 0], [23, 17, 28, 0], 
  ],
  'hindR': [
    [23, 4, 20, 16], [18, 21, 28, 0], 
   ],
}


let jointAngles = {
  // thigh, knee, ankle, metacarpus
  'foreL': [],
  'foreR': [],
  'hindL': [],
  'hindR': []
}


toggleAnimation = () => {
  animate = !animate;
  // If turned on animation, start calling tick function
  if (animate) {
    startTime = performance.now();
    tick();
  }
}

tick = () => {
  renderAllShapes();
  if (animate) {
    updateJointAnglesByAnimation();
    requestAnimationFrame(tick);
  }
}

updateJointAnglesByAnimation = () => {
  const numFrames = 13;
  const theTime = parseInt((performance.now() - startTime) / 100); // the divisor slows it down 
  const frame = theTime % numFrames;
  for (const [legName, val] of Object.entries(jointAngles)) {
    jointAngles[legName] = jointAnglesAnimation[legName][frame];
  }

}

updateJointAnglesByInput = (joint=undefined, slider=undefined) => {
  // update using the sliders, rather than animating them
  for (const [legName, val] of Object.entries(jointAngles)) {
    // Update each leg
    if (joint) jointAngles[legName][joint] = parseInt(document.getElementById(slider).value);
    // Update each joint
    else jointAngles[legName] = [
      parseInt(document.getElementById('thighSlider').value),
      parseInt(document.getElementById('kneeSlider').value),
      parseInt(document.getElementById('ankleSlider').value),
      parseInt(document.getElementById('metacarpusSlider').value)
    ]
  }
  renderAllShapes();
}

main = () => {

  document.getElementById('angleSlider').addEventListener('input', (e) => {
    g_GlobalAngle = e.target.value;
    renderAllShapes();
  });
  updateJointAnglesByInput();

}

clearCanvas = () => {
  // Retrieve <canvas> element
  let canvas = document.getElementById('webgl');
  // Get the rendering context for WebGL
  let gl = getWebGLContext(canvas);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  shapesList = [];
}


inchesToGl = (inches, mode='scalar') => {
  // Given a value in inches, approximates a webgl coordinates
  // For scalar mode, output is 0.0 - 1.0
  // For coordinates mode, output is -1.0 - 1.0
  // Loaf is ~22 inches long
  const screenLengthIn = 30.0;
  if (inches > screenLengthIn) throw 'too long';
  if (mode == 'scalar') return inches / screenLengthIn;
  else if (mode == 'coordinates') return ((2 * inches) / (screenLengthIn) - 1.0); //test 
}

renderAllShapes = () => {
  // Pass the matrix to u_GlobalRotateMatrix attribute
  let globalRotationMatrix = new Matrix4().rotate(g_GlobalAngle, 0, 1, 0);
  //globalRotationMatrix.rotate(-5, 1, 0, 0); // arbitrary, just for perspective
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotationMatrix.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  // Loaf body 
  let body = new Cube(color='hot pink');
 // body.modelMatrix.translate(0.1, 0.0, 0.0);
  body.modelMatrix.scale(
    inchesToGl(16), // long
    inchesToGl(5.5),  // tall
    inchesToGl(7) // wide
  ) 
   body.render();

  let cube = new Cube();

 
  // Head
  let head = new Cube(color='indiger');
  head.modelMatrix.translate(-0.6, 0.1, 0.0);
  head.modelMatrix.scale(
    inchesToGl(3), 
    inchesToGl(3), 
    inchesToGl(3),
  );
  head.render();

  // Snoot
  let headCoordMat = new Matrix4(head.modelMatrix);
  let snoot = new Cube('soft ginger');
  snoot.modelMatrix = headCoordMat;
  snoot.modelMatrix.translate(-0.8, -0.3, 0.0);
  snoot.modelMatrix.rotate(10, 0, 0, 1);
  snoot.modelMatrix.scale(
    1, 
    0.5, 
    0.5,
  );
  snoot.modelMatrix.rotate(10, 0, 0, 1);
  snoot.render();

}
