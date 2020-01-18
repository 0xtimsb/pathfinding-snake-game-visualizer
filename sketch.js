const cols = 30, rows = 30
const cellLength = 20

let grid = new Array(cols)

let openSet = [], closedSet = []
let start, end
let path = []

class Cell {
  constructor(i, j) {
    this.i = i
    this.j = j
    this.f = 0
    this.g = 0
    this.h = 0
    this.neighbors = []
    this.previous = undefined
    this.wall = false

    if (random(1) < 0.35) {
      this.wall = true
    }
  }

  show(col) {
    fill(col)
    if (this.wall) {
      fill(20)
    }
    noStroke()
    rect((this.i*cellLength)+((windowWidth/2)-(cellLength*cols/2)), (this.j*cellLength)+((windowHeight/2)-(cellLength*rows/2)), cellLength-1, cellLength-1)
  }

  addNeighbors() {
    if (this.i < cols-1)
      this.neighbors.push(grid[this.i+1][this.j])
    if (this.i > 0)
      this.neighbors.push(grid[this.i-1][this.j])
    if (this.j < rows-1)
      this.neighbors.push(grid[this.i][this.j+1])
    if (this.j > 0)
      this.neighbors.push(grid[this.i][this.j-1])
  }
}

function removeFromArray(arr, e) {
  for (let i = arr.length-1; i >= 0; i--) {
    if (arr[i] == e) {
      arr.splice(i, 1)
    }
  }
}

function heuristic(a, b) {
  let d = abs(a.i-b.i) + abs(a.j-b.j)
  return d
}

function setup() {
  createCanvas(windowWidth, windowHeight)

  // Making a 2D array
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows)
  }

  // Assigning cell object
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j)
    }
  }

  // Getting neighbors for each cell
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbors()
    }
  }

  // Setting up start and goal node.
  start = grid[0][0]
  end = grid[cols-1][rows-1]
  start.wall = false
  end.wall = false

  openSet.push(start)
}

function draw() {

  // Pathfinding algorithm
  if (openSet.length > 0) {

    let lowestIndex = 0 // Winner
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i
      }
    }

    let current = openSet[lowestIndex]

    if (current === end) {

      // Find the path // Backtracking
      path = []
      let temp = current
      path.push(temp)
      while (temp.previous) {
        path.push(temp.previous)
        temp = temp.previous
      }

      noLoop()
      console.log('Done!')
    }

    removeFromArray(openSet, current)
    closedSet.push(current)

    for(let i = 0; i < current.neighbors.length; i++) {
      let neighbor = current.neighbors[i]

      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        let tempG = current.g + 1

        let newPath = false

        if(openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG
            newPath = true
          }
        } else {
          neighbor.g = tempG
          openSet.push(neighbor)
          newPath = true
        }

        if (newPath) {
          neighbor.h = heuristic(neighbor, end)
          neighbor.f = neighbor.h + neighbor.g
          neighbor.previous = current
        }
      }
    }

  } else {
    // no solution
    noLoop()
    console.log('No Solution')
  }

  // Clearing background - Black
  background(0)

  // Showing grid on canvas
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show(color(45))
    }
  }

  for (let i = 0; i < openSet.length; i++) {
    openSet[i].show(color(60))
  }

  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(70))
  }

  for (let i = 0; i < path.length; i++) {
    path[i].show(color(170))
  }

  // Printing text
  textAlign(CENTER)

  fill(170)
  textSize(27)
  text('Pathfinding using A* algorithm with JavaScript', windowWidth/2, 60);
}
