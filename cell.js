class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.obstacleColor = color(0);
    this.startColor = color(0, 255, 0);
    this.endColor = color(0, 0, 255);
    this.neighbors = [];
    this.previous = undefined;

    this.alpha = 100;
    this.start = false;
    this.end = false;
    this.obstacle = false;
    if (random(1) < 0.5) {
      this.obstacle = true;
    }
  }
  display(color) {
    this.alpha -= 0.1;
    fill(this.obstacle ? this.obstacleColor : color);
    if (this.start || this.end)
      fill(this.start ? this.startColor : this.endColor);
    if (this.obstacle && !this.start && !this.end)
      rect(this.x * squareSize, this.y * squareSize, squareSize, squareSize);
    else rect(this.x * squareSize, this.y * squareSize, squareSize, squareSize);
  }

  addNeighbors(grid) {
    let x = this.x;
    let y = this.y;
    if (x < gridSize - 1) {
      this.neighbors.push(grid[x + 1][y]);
    }
    if (x > 0) {
      this.neighbors.push(grid[x - 1][y]);
    }
    if (y < gridSize - 1) {
      this.neighbors.push(grid[x][y + 1]);
    }
    if (y > 0) {
      this.neighbors.push(grid[x][y - 1]);
    }
    if (x > 0 && y > 0) {
      this.neighbors.push(grid[x - 1][y - 1]);
    }
    if (x < gridSize - 1 && y > 0) {
      this.neighbors.push(grid[x + 1][y - 1]);
    }
    if (x > 0 && y < gridSize - 1) {
      this.neighbors.push(grid[x - 1][y + 1]);
    }
    if (x < gridSize - 1 && y < gridSize - 1) {
      this.neighbors.push(grid[x + 1][y + 1]);
    }
  }
}
