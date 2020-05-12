// Lab 3: Creating A Virtual World
// https://www.youtube.com/watch?v=vNHP_OBk5tw&list=PLbyTU_tFIkcOs7XVopOy5Oti-HGiIZx0J&index=2
// https://stackoverflow.com/questions/36689118/using-varying-at-the-moment-chrome-not-working
// Mozilla tutorial: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL

// Vertex shader program
const VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ProjectionMatrix;   // Perspective
  uniform mat4 u_ViewMatrix;         // Look at
  uniform mat4 u_GlobalRotateMatrix; // Global Rotation
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    //gl_Position = u_ProjectionMatrix * u_ViewMatrix * a_Position;
    //gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_Color = a_Color;
    v_UV = a_UV;
  }`;

// Fragment shader program
const FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;  
  varying vec4 v_Color;
  uniform sampler2D u_Sampler0;
  uniform int u_WhichTexture;
  void main() {
    if (u_WhichTexture == 0) {
      gl_FragColor = v_Color;
    } else if (u_WhichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_WhichTexture == 3) {
      // mixing the color and the texture
      // additive
      gl_FragColor = (0.5) * v_Color + 0.5 * texture2D(u_Sampler0, v_UV); // interpolate
      //gl_FragColor = v_Color - 0.5 * texture2D(u_Sampler0, v_UV); // nice subtractive
      gl_FragColor = (v_Color - 0.4 * texture2D(u_Sampler0, v_UV))+ 0.2 * v_Color* texture2D(u_Sampler0, v_UV); // secret sauce
    } else if (u_WhichTexture == 2) {
      // mixing the color and the texture
      gl_FragColor = v_Color * 1.1 + 0.3 - 0.4*texture2D(u_Sampler0, v_UV) ; // secret sauce
    } else {
      gl_FragColor = vec4(v_UV, u_WhichTexture / 10, 1.0);
    }
  }`;


let shapesList = [];
const {gl, canvas} = setUpWebGL();
let {
  a_Position, a_UV, a_Color, u_ModelMatrix, u_GlobalRotateMatrix, u_ViewMatrix, u_ProjectionMatrix, u_Sampler, u_WhichTexture 
} = connectVariablesToGLSL(gl);
let animate = false;
let g_GlobalAngle = document.getElementById('angleSlider').value;
let startTime = performance.now();
let camera = new Camera();

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
  const texImage = initTextures();
  document.onkeydown = function(ev){ 
    keydown(ev); 
  };
  initAllShapes();

  // Register the event handler to be called on loading an image
  // wait before rendering
  texImage.onload = function() { 
    sendTextureToGLSL(texImage); 
    document.getElementById('angleSlider').addEventListener('input', (e) => {
      g_GlobalAngle = e.target.value;
      renderAllShapes();
    });
    updateJointAnglesByInput();
  };
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

initAllShapes = () => {
  // Loaf body 
  let body = new Cube(color='green');
  body.modelMatrix.scale(
    inchesToGl(16), // long
    inchesToGl(5.5),  // tall
    inchesToGl(7) // wide
  ) 
  shapesList.push(body);

  // Head
  let head = new Cube(color='magenta');
  head.modelMatrix.translate(-0.6, 0.1, 0.0);
  head.modelMatrix.scale(
    inchesToGl(3), 
    inchesToGl(3), 
    inchesToGl(3),
  );
  shapesList.push(head);


  // Snoot
  let headCoordMat = new Matrix4(head.modelMatrix);
  let snoot = new Cube(color='orange');
  snoot.modelMatrix = headCoordMat;
  snoot.modelMatrix.translate(-0.8, -0.3, 0.0);
  snoot.modelMatrix.rotate(10, 0, 0, 1);
  snoot.modelMatrix.scale(
    1, 
    0.5, 
    0.5,
  );
  snoot.modelMatrix.rotate(10, 0, 0, 1);
  shapesList.push(snoot);
}

function keydown(ev) {
  const moveAmt = 0.05
  if(ev.keyCode == 39) { // The right arrow key was pressed
    camera.moveForward();
  } else if (ev.keyCode == 37) { // The left arrow key was pressed
    camera.eye.elements[0] -= moveAmt;
  } else { return; }
  renderAllShapes();
}


renderAllShapes = () => {
  // Pass the matrix to u_GlobalRotateMatrix 
  let globalRotationMatrix = new Matrix4().rotate(g_GlobalAngle, 0, 1, 0);
  //globalRotationMatrix.rotate(-5, 1, 0, 0); // arbitrary, just for perspective
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotationMatrix.elements);

  // if the clipping cuts off it looks really weird like a headless loaf with a neck stem
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, camera.projectionMat);

  // Pass the view matrix
  
  /* z larger = backing up (or u can set wider perspective ˚)
     x larger = shifts to the left
  */
  
  debugger;
  gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMat);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  for (shape of shapesList) {
    shape.render();
  }

}
