const colors = { // rgba
  'red': [1.0, 0.05, 0.04, 1],
  'orange': [1.0, 0.67, 0.02, 1],
  'yellow': [1.0, 1.0, 0.05, 1],
  'green': [0.05, 1.0, 0.08, 1],
  'turquoise': [0.07, .93, .93, 1],
  'blue': [0.04, .05, .99, 1],
  'magenta': [1.0, 0.01, 1.0, 1],
  'midnight': [8, 0, 59, 1],
  'hot pink':   [1, 0.7, 0.7, 1],
  'lavender':     [0.94, 0.74, 1, 1],
  'indiger': [0.75, 0.74, 0.9, 1],
  'white':      [1.0, 1.0, 1.0, 1],
  'loaf white': [1.0, 0.93, 0.90, 1],
  'loaf darker': [0.98, 0.88, 0.86, 1],
  'softer ginger': [0.86, 0.61, 0.47, 0.8],
  'soft ginger': [0.86, 0.61, 0.47, 1],
  'nose brown': [0.37, 0.22, 0.07, 1 ],
}



// 32 x 32 world
const g_map = [
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 1,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 1, 1,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0],

  [0, 0, 0, 0,   0, 0, 0, 0,   1, 1, 1, 1,   1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   1, 1, 1, 1,   1, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   1, 1, 1, 1,   1, 1, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 1, 1,   1, 1, 1, 1,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0],

  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 1,   1, 1, 1, 1,   1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1,   1, 1, 1, 1,   1, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   1, 1, 1, 1,   1, 1, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 1, 1,   1, 1, 1, 1,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0],
  
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 1,   1, 1, 1, 1,   1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1,   1, 1, 1, 1,   1, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   1, 1, 1, 1,   1, 1, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 1, 1,   1, 1, 1, 1,   0, 0, 0, 0,   0, 0, 0, 0], // turnaround
  
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 1,   1, 1, 1, 1,   1, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 1,   1, 1, 1, 1,   1, 0, 0, 0,   0, 0, 0, 0],
  

  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 1,   1, 1, 1, 1,   1, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 1,   1, 1, 1, 1,   1, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 1, 1,   1, 1, 1, 1,   0, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 1, 1,   1, 1, 1, 1,   0, 0, 0, 0,   0, 0, 0, 0],

  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   1, 1, 1, 1,   1, 1, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   1, 1, 1, 1,   1, 1, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1,   1, 1, 1, 1,   1, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1,   1, 1, 1, 1,   1, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0],

  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 1,   1, 1, 1, 1,   1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 1,   1, 1, 1, 1,   1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 1, 1,   1, 1, 1, 1,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 1, 1,   1, 1, 1, 1,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0],
  
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   1, 1, 1, 1,   1, 1, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0],
  [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   1, 1, 1, 1,   1, 1, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0],
]

const cubeCoords = {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  'positions': [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    
    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,
    
    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,
    
    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
    
    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
    
    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ],
  'texture': [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
  ],
  'indices': [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ],
  'faceColors': [
    [1.0,  1.0,  1.0,  1.0],    // Front face: white
    [1.0,  0.0,  0.0,  1.0],    // Back face: red
    [0.0,  1.0,  0.0,  1.0],    // Top face: green
    [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
    [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
    [1.0,  0.0,  1.0,  1.0],    // Left face: purple
  ]
};

