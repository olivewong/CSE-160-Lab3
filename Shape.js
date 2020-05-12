
class Cube { 
  constructor(color='hot pink') {
    this.rgba = colors[color];
    this.vertices = new Float32Array(cubeCoords['positions']);
    this.indices = new Float32Array(cubeCoords['indices']);
    this.faceColors = new Float32Array(cubeCoords['indices']);
    this.numFaces = 6;
    this.modelMatrix = new Matrix4();
  }

  initIndexBuffer() {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(this.indices), gl.STATIC_DRAW);
  }

  get colors() {
    // Get color array + add some nice arbitrary shading
    let colors = [];

    for (var j = 0; j < this.numFaces * 4; ++j) {
      let rgbaShading = [];

      // Subtract .08 from alpha for each face to simulate shading
      for (let i = 0; i < 3; i++) {
        rgbaShading.push(this.rgba[i] * (1.0 - j * .08));
      }
      // Keep alpha
      rgbaShading.push(this.rgba[3])

      // Repeat each color four times for the four vertices of the face
      colors = colors.concat(
        rgbaShading.map(x=> x * 0.7),  // make it gradienty,
        rgbaShading,
        rgbaShading,
        rgbaShading.map(x=> x * 0.9), 
      );
    }
    return new Float32Array(colors);
  }


  render() {
 
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.modelMatrix.elements);
    
    // Create + send data to index buffer
    this.initIndexBuffer();
    
    // Create + send data to color buffer (attr a_Color)
    if (!initArrayBuffer(this.colors, 4, gl.FLOAT, 'a_Color'))
      return -1;
  
    // Create + send data to vertex coordinate buffer (attr a_Color)
    if (!initArrayBuffer(this.vertices, 3, gl.FLOAT, 'a_Position'))
     return -1;

    // Draw
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    
  }
}




/*

  initUVBuffer = (uv) => { 
    // Create a WebGL buffer (array in GPU memory)
    let uvBuffer = gl.createBuffer(); 
    if (!uvBuffer) {
      throw 'Failed to create the vertex buffer object';
    }
  
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  
    // Write data into the buffer object 
    gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW);
  
    // Get memory location of attribute a_UV (var in GPU memory)
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  
    // Assign the buffer object to a_UV variable 
    // Size = 2 bc 2d
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  
    // Enable assignment to an attribute variable so vertex shader can access buffer obj
    gl.enableVertexAttribArray(a_UV);
  
  }

  
  */