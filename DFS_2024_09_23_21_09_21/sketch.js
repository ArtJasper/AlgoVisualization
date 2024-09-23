let cols, rows;
let w = 20; // 单元格的宽度，减小单元格尺寸以扩大迷宫
let grid = [];
let stack = [];
let current;
let target;
let found = false;
let obstacles = [];

function setup() {
  createCanvas(600, 600); // 扩大画布
  cols = floor(width / w);
  rows = floor(height / w);
  
  // 初始化迷宫的所有单元格
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
    }
  }
  
  // 设置起点和目标
  current = grid[0];
  target = grid[floor(random(grid.length))];
  
  // 将目标标记为目标单元格
  target.target = true;
  
  frameRate(20); // 控制动画速度
}

function draw() {
  background(51);
  
  // 显示所有单元格
  for (let i = 0; i < grid.length; i++) {
    grid[i].show();
  }
  
  // 绘制障碍物
  for (let i = 0; i < obstacles.length; i++) {
    fill(255, 165, 0); // 障碍显示为橙色
    rect(obstacles[i].i * w, obstacles[i].j * w, w, w);
  }
  
  if (!found) {
    current.visited = true;
    current.highlight(); // 当前单元格显示不同颜色
    
    // 获取当前单元格的未访问邻居，跳过障碍物
    let next = current.checkNeighbors();
    
    if (next) {
      next.visited = true;
      stack.push(current);
      current = next; // 移动到下一个单元格
    } else if (stack.length > 0) {
      current.backtrack = true; // 标记回溯路径
      current = stack.pop(); // 回溯
    }
    
    if (current === target) {
      found = true; // 找到目标
      noLoop(); // 停止动画
      console.log("目标已找到！");
    }
  }
}

// 获取每个单元格的索引
function index(i, j) {
  if (i < 0 || j < 0 || i >= cols || j >= rows) {
    return -1;
  }
  return i + j * cols;
}

// 鼠标点击设置障碍
function mousePressed() {
  let i = floor(mouseX / w);
  let j = floor(mouseY / w);
  
  let clickedCell = grid[index(i, j)];
  
  if (clickedCell && clickedCell !== current && clickedCell !== target) {
    clickedCell.obstacle = true; // 将该单元格设置为障碍物
    obstacles.push(clickedCell);
  }
}

// 单元格类
class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.visited = false;
    this.backtrack = false;
    this.obstacle = false; // 新增障碍属性
    this.walls = [true, true, true, true]; // 上、右、下、左
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
  
  // 高亮当前单元格
  highlight() {
    let x = this.i * w;
    let y = this.j * w;
    noStroke();
    fill(135, 206, 235); // 当前搜索位置显示为天蓝色
    rect(x, y, w, w);
  }
  
  // 显示单元格和墙
  show() {
    let x = this.i * w;
    let y = this.j * w;
    //stroke(255);
    if (this.walls[0]) {
      line(x, y, x + w, y); // 上
    }
    if (this.walls[1]) {
      line(x + w, y, x + w, y + w); // 右
    }
    if (this.walls[2]) {
      line(x + w, y + w, x, y + w); // 下
    }
    if (this.walls[3]) {
      line(x, y + w, x, y); // 左
    }
    
    if (this.visited) {
      noStroke();
      fill(0, 128, 128); // 搜索过的路径显示为青色
      rect(x, y, w, w);
    }
    
    if (this.backtrack) {
      noStroke();
      fill(255, 255, 255, 100); // 回溯路径显示为白色
      rect(x, y, w, w);
    }
    
    if (this.target) {
      noStroke();
      fill(255, 0, 0, 200); // 目标显示为红色
      rect(x, y, w, w);
    }
  }
}
