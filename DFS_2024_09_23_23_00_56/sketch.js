let cols, rows;
let w = 20; // Width of each cell, decrease size to enlarge the maze
let grid = [];
let stack = [];
let current;
let target;
let found = false;
let obstacles = [];

function setup() {
  createCanvas(600, 600); // Enlarged canvas size
  cols = floor(width / w);
  rows = floor(height / w);
  
  // Initialize all cells in the maze
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
    }
  }
  
  // Set the starting point and target
  current = grid[0];
  target = grid[floor(random(grid.length))];
  
  // Mark the target cell
  target.target = true;
  
  frameRate(20); // Control the animation speed
}

function draw() {
  background(51);
  
  // Display all cells
  for (let i = 0; i < grid.length; i++) {
    grid[i].show();
  }
  
  // Draw obstacles
  for (let i = 0; i < obstacles.length; i++) {
    fill(255, 165, 0); // Obstacles are shown in orange
    rect(obstacles[i].i * w, obstacles[i].j * w, w, w);
  }
  
  if (!found) {
    current.visited = true;
    current.highlight(); // Current cell highlighted in different color
    
    // Get unvisited neighbors of the current cell, skip obstacles
    let next = current.checkNeighbors();
    
    if (next) {
      next.visited = true;
      stack.push(current);
      current = next; // Move to the next cell
    } else if (stack.length > 0) {
      current.backtrack = true; // Mark the backtracking path
      current = stack.pop(); // Backtrack
    }
    
    if (current === target) {
      found = true; // Target found
      noLoop(); // Stop the animation
      console.log("Target found!");
    }
  }
}

// Get the index of each cell
function index(i, j) {
  if (i < 0 || j < 0 || i >= cols || j >= rows) {
    return -1;
  }
  return i + j * cols;
}

// Set obstacles by clicking
function mousePressed() {
  let i = floor(mouseX / w);
  let j = floor(mouseY / w);
  
  let clickedCell = grid[index(i, j)];
  
  if (clickedCell && clickedCell !== current && clickedCell !== target) {
    clickedCell.obstacle = true; // Set this cell as an obstacle
    obstacles.push(clickedCell);
  }
}

// Cell class
class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.visited = false;
    this.backtrack = false;
    this.obstacle = false; // New obstacle property
    this.walls = [true, true, true, true]; // Top, Right, Bottom, Left
    this.target = false;
  }
  
  checkNeighbors() {
    let neighbors = [];
    
    let top = grid[index(this.i, this.j - 1)];
    let right = grid[index(this.i + 1, this.j)];
    let bottom = grid[index(this.i, this.j + 1)];
    let left = grid[index(this.i - 1, this.j)];
    
    if (top && !top.visited && !top.obstacle) {
      neighbors.push(top);
    }
    if (right && !right.visited && !right.obstacle) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited && !bottom.obstacle) {
      neighbors.push(bottom);
    }
    if (left && !left.visited && !left.obstacle) {
      neighbors.push(left);
    }
    
    if (neighbors.length > 0) {
      let r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  }
  
  // Highlight the current cell
  highlight() {
    let x = this.i * w;
    let y = this.j * w;
    noStroke();
    fill(135, 206, 235); // Current search position shown in light blue
    rect(x, y, w, w);
  }
  
  // Display the cell and its walls
  show() {
    let x = this.i * w;
    let y = this.j * w;
    //stroke(255);
    if (this.walls[0]) {
      line(x, y, x + w, y); // Top
    }
    if (this.walls[1]) {
      line(x + w, y, x + w, y + w); // Right
    }
    if (this.walls[2]) {
      line(x + w, y + w, x, y + w); // Bottom
    }
    if (this.walls[3]) {
      line(x, y + w, x, y); // Left
    }
    
    if (this.visited) {
      noStroke();
      fill(0, 128, 128); // Path visited shown in teal
      rect(x, y, w, w);
    }
    
    if (this.backtrack) {
      noStroke();
      fill(255, 255, 255, 100); // Backtracking path shown in white
      rect(x, y, w, w);
    }
    
    if (this.target) {
      noStroke();
      fill(255, 0, 0, 200); // Target shown in red
      rect(x, y, w, w);
    }
  }
}
