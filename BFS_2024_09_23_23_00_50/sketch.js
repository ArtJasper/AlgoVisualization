let cols, rows;
let w = 20; // Width of each cell
let grid = [];
let queue = []; // Use queue for BFS
let current;
let target;
let found = false;
let startSet = false; // Flag to indicate if the start point is set
let targetSet = false; // Flag to indicate if the target point is set

function setup() {
  createCanvas(600, 600); // Canvas size
  cols = floor(width / w);
  rows = floor(height / w);
  
  // Initialize all the cells of the maze
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
    }
  }
  
  frameRate(7); // Control the animation speed
}

function draw() {
  background(51);
  
  // Display all cells
  for (let i = 0; i < grid.length; i++) {
    grid[i].show();
  }

  if (!found && startSet && targetSet) {
    if (queue.length > 0) {
      current = queue.shift(); // Get the current cell from the queue
      if (!current.start) {
        current.visitedCount++; // Increase visit count, the start point doesn't count
      }

      // Check if we have reached the target
      if (current === target) {
        found = true; // Mark as found
        console.log("found target"); // Output message when target is found
        //reconstructPath(); // Reconstruct the path
        //noLoop(); // Stop the animation
        return; // Ensure draw stops execution
      }

      // Iterate over the neighbors of the current cell
      let neighbors = current.getNeighbors();
      shuffle(neighbors, true); // Shuffle the neighbors randomly
      
      for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];
        if (!neighbor.inQueue && !neighbor.obstacle) {
          if (adjustDirection(neighbor, current)) {
            neighbor.previous = current; // Record the predecessor node
            neighbor.inQueue = true; // Mark as added to the queue
            queue.push(neighbor);
          }
        }
      }
    } else {
      noLoop(); // Stop the animation if there are no more cells in the queue
    }
  }
}

// Adjust search direction based on obstacles to avoid moving into obstacles
function adjustDirection(neighbor, current) {
  return !neighbor.obstacle; // If the neighbor is an obstacle, return false to avoid entering the obstacle
}

// Reconstruct the path and mark it
function reconstructPath() {
  let temp = current;
  temp.isPath = true;
  while (temp.previous) {
    temp.previous.isPath = true;
    temp = temp.previous;
  }
}

// Get the index of each cell
function index(i, j) {
  if (i < 0 || j < 0 || i >= cols || j >= rows) {
    return -1;
  }
  return i + j * cols;
}

// Mouse click: the first click sets the start point, the second click sets the target, subsequent clicks set obstacles
function mousePressed() {
  let i = floor(mouseX / w);
  let j = floor(mouseY / w);
  
  let clickedCell = grid[index(i, j)];
  
  if (!startSet && clickedCell) {
    current = clickedCell;
    current.start = true; // Mark as the start point
    queue.push(current); // Add the start point to the queue
    startSet = true;
  } else if (!targetSet && clickedCell) {
    target = clickedCell;
    target.target = true; // Mark as the target
    targetSet = true;
  } else if (clickedCell && clickedCell !== current && clickedCell !== target) {
    clickedCell.obstacle = true; // Set as obstacle
  }
}

// Cell class
class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.visitedCount = 0; // Record the number of visits
    this.inQueue = false;
    this.obstacle = false;
    this.isPath = false; // Mark for the final path
    this.previous = undefined; // Predecessor node
    this.start = false; // Mark if it is the start point
    this.target = false; // Mark if it is the target point
  }
  
  // Get the top, right, bottom, and left neighbors of the current cell
  getNeighbors() {
    let neighbors = [];
    
    let top = grid[index(this.i, this.j - 1)];
    let right = grid[index(this.i + 1, this.j)];
    let bottom = grid[index(this.i, this.j + 1)];
    let left = grid[index(this.i - 1, this.j)];
    
    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);
    
    return neighbors;
  }
  
  // Display the cell and its walls
  show() {
    let x = this.i * w;
    let y = this.j * w;
    stroke(255);
    
    // Start point remains green regardless of visit count
    if (this.start) {
      noStroke();
      fill(0, 255, 0); // Start point shown in green
      rect(x, y, w, w);
    } 
    // Show white for the second and subsequent visits
    else if (this.visitedCount >= 2) {
      noStroke();
      fill(255); // Second and subsequent visits shown in white
      rect(x, y, w, w);
    }
    // Show teal for the first visit
    else if (this.visitedCount === 1) {
      noStroke();
      fill(0, 128, 128); // First visit path shown in teal
      rect(x, y, w, w);
    }

    // Draw obstacles
    if (this.obstacle) {
      noStroke();
      fill(255, 165, 0); // Obstacles shown in orange
      rect(x, y, w, w);
    }

    // Draw the target
    if (this.target) {
      noStroke();
      fill(255, 0, 0); // Target shown in red
      rect(x, y, w, w);
    }

    // Draw the final path
    if (this.isPath) {
      noStroke();
      fill(255, 255, 255); // Final path shown in white
      rect(x, y, w, w);
    }
  }
}
