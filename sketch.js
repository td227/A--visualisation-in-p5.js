var gridSize = 60;
let squareSize;
let grid;

let visitedColor;
let notVisitedColor;
let pathColor;

let notVisited = [];
let visited = [];
let start = undefined;
let end = undefined;

let path = [];
var fRateMin = 1;
var fRate = 60;
var fRateMax = 150;

var myAngle = 30;
var myColor = "#eeee00";

let gui;

function setup() {
  createCanvas(windowHeight, windowHeight);
  gui = createGui("astar");
  gui.addGlobals("fRate");
  visitedColor = color(0, 255, 0, 80);
  notVisitedColor = color(255, 0, 0, 80);
  pathColor = color(0, 0, 255, 80);
  grid = new Array(gridSize).fill(0).map(() => new Array(gridSize).fill(0));
  squareSize = width / gridSize;
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      grid[x][y] = new Cell(x, y);
    }
  }
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      grid[x][y].addNeighbors(grid);
    }
  }

  startCoords = createVector(
    Math.floor(random(0, gridSize)),
    Math.floor(random(0, gridSize))
  );
  start = grid[startCoords.x][startCoords.y];
  grid[startCoords.x][startCoords.y].start = true;

  let valid = false;
  while (!valid) {
    endCoords = createVector(
      Math.floor(random(0, gridSize)),
      Math.floor(random(0, gridSize))
    );
    if (
      grid[endCoords.x][endCoords.y] !== start &&
      !grid[endCoords.x][endCoords.y].obstacle
    )
      valid = true;
  }
  end = grid[endCoords.x][endCoords.y];
  grid[endCoords.x][endCoords.y].end = true;

  notVisited.push(start);
}

function heuristic(a, b) {
  let dx = Math.abs(a.x - b.x);
  let dy = Math.abs(a.y - b.y);
  return dx + dy;
}

function draw() {
  strokeWeight(1);
  frameRate(fRate);
  stroke(0);
  let current;
  if (notVisited.length > 0) {
    let winner = 0;
    for (let i = 0; i < notVisited.length; i++) {
      if (notVisited[i].f < notVisited[winner].f) {
        winner = i;
      }
    }
    current = notVisited[winner];
    if (current === end) {
      noLoop();
      console.log(`path found in  ${path.length} steps`);
    }
    removeData(notVisited, current);
    visited.push(current);
    current.neighbors.forEach((neighbor) => {
      if (!visited.includes(neighbor) && !neighbor.obstacle) {
        let tempG = current.g + heuristic(current, neighbor);
        let newPath = false;
        if (notVisited.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          notVisited.push(neighbor);
        }
        if (newPath) {
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    });
  } else {
    console.log("no solution");
    noLoop();
    return;
  }
  background(0);
  grid.forEach((x) => x.forEach((y) => y.display(50)));
  visited.forEach((x) => x.display(color(0, 255, 0, 50)));
  notVisited.forEach((x) => x.display(color(255, 0, 0, 50)));

  path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  noFill();
  stroke(0, 0, 200);
  strokeWeight(squareSize / 2);
  beginShape();
  path.forEach((x) =>
    vertex(x.x * squareSize + squareSize / 2, x.y * squareSize + squareSize / 2)
  );
  endShape();
}

function removeData(arr, data) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === data) {
      arr.splice(i, 1);
    }
  }
}
