let cols, rows;
let w = 20; // 单元格的宽度
let grid = [];
let queue = []; // 使用队列实现 BFS
let current;
let target;
let found = false;
let startSet = false; // 标记起点是否已设置
let targetSet = false; // 标记目标是否已设置

function setup() {
  createCanvas(600, 600); // 画布尺寸
  cols = floor(width / w);
  rows = floor(height / w);
  
  // 初始化迷宫的所有单元格
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
    }
  }
  
  frameRate(10); // 控制动画速度
}

function draw() {
  background(51);
  
  // 显示所有单元格
  for (let i = 0; i < grid.length; i++) {
    grid[i].show();
  }

  if (!found && startSet && targetSet) {
    if (queue.length > 0) {
      current = queue.shift(); // 从队列中取出当前单元格
      if (!current.start) {
        current.visitedCount++; // 增加访问次数，起点不增加
      }

      // 遍历当前单元格的邻居
      let neighbors = current.getNeighbors();
      shuffle(neighbors, true); // 随机打乱邻居的顺序
      
      for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];
        if (!neighbor.inQueue && !neighbor.obstacle) {
          if (adjustDirection(neighbor, current)) {
            neighbor.previous = current; // 记录前驱节点
            neighbor.inQueue = true; // 标记已加入队列
            queue.push(neighbor);
          }
        }
      }

      if (current === target) {
        found = true; // 找到目标
        reconstructPath(); // 重建路径
        noLoop(); // 停止动画
      }
    } else {
      noLoop();
    }
  }
}

// 根据障碍物调整搜索方向，避免继续朝障碍方向前进
function adjustDirection(neighbor, current) {
  return !neighbor.obstacle; // 如果邻居是障碍物，则返回false，避免进入障碍物
}

// 重建路径并标记
function reconstructPath() {
  let temp = current;
  temp.isPath = true;
  while (temp.previous) {
    temp.previous.isPath = true;
    temp = temp.previous;
  }
}

// 获取每个单元格的索引
function index(i, j) {
  if (i < 0 || j < 0 || i >= cols || j >= rows) {
    return -1;
  }
  return i + j * cols;
}

// 鼠标点击：第一次点击设置起点，第二次点击设置目标，后续点击为障碍物
function mousePressed() {
  let i = floor(mouseX / w);
  let j = floor(mouseY / w);
  
  let clickedCell = grid[index(i, j)];
  
  if (!startSet && clickedCell) {
    current = clickedCell;
    current.start = true; // 标记为起点
    queue.push(current); // 将起点加入队列
    startSet = true;
  } else if (!targetSet && clickedCell) {
    target = clickedCell;
    target.target = true; // 标记为目标
    targetSet = true;
  } else if (clickedCell && clickedCell !== current && clickedCell !== target) {
    clickedCell.obstacle = true; // 设置障碍物
  }
}

// 单元格类
class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.visitedCount = 0; // 记录访问次数
    this.inQueue = false;
    this.obstacle = false;
    this.isPath = false; // 用于标记最终路径
    this.previous = undefined; // 前驱节点
    this.start = false; // 标记是否是起点
    this.target = false; // 标记是否是目标
  }
  
  // 获取当前单元格的上下左右邻居
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
  
  // 显示单元格和墙
  show() {
    let x = this.i * w;
    let y = this.j * w;
    stroke(255);
    
    // 起点始终保持绿色，不随访问次数变化
    if (this.start) {
      noStroke();
      fill(0, 255, 0); // 起点显示为绿色
      rect(x, y, w, w);
    } 
    // 二次及以上访问显示为白色
    else if (this.visitedCount >= 2) {
      noStroke();
      fill(255); // 二次及以上访问显示为白色
      rect(x, y, w, w);
    }
    // 第一次访问显示青色
    else if (this.visitedCount === 1) {
      noStroke();
      fill(0, 128, 128); // 第一次访问的路径显示为青色
      rect(x, y, w, w);
    }

    // 绘制障碍物
    if (this.obstacle) {
      noStroke();
      fill(255, 165, 0); // 障碍物显示为橙色
      rect(x, y, w, w);
    }

    // 绘制目标
    if (this.target) {
      noStroke();
      fill(255, 0, 0); // 目标显示为红色
      rect(x, y, w, w);
    }

    // 绘制最终路径
    if (this.isPath) {
      noStroke();
      fill(255, 255, 255); // 最终路径显示为白色
      rect(x, y, w, w);
    }
  }
}
