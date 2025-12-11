type Cell = {
  x: number;
  y: number;
};

export const generateMaze = (width: number, height: number): number[][] => {
  // Dimensions of the maze array (walls and paths)
  // For a WxH grid of cells, we need 2W+1 x 2H+1 to represent walls around them
  const rows = height * 2 + 1;
  const cols = width * 2 + 1;
  
  // Initialize with walls (1)
  const maze = Array.from({ length: rows }, () => Array(cols).fill(1));

  // Helper to check valid cell
  const isValid = (r: number, c: number) => {
    return r > 0 && r < rows - 1 && c > 0 && c < cols - 1;
  };

  // Randomized partial Prim's or Recursive Backtracker
  // Let's use recursive backtracker with a stack
  const stack: Cell[] = [];
  
  // Start at (1,1) which corresponds to cell (0,0)
  const start: Cell = { x: 1, y: 1 };
  maze[start.y][start.x] = 0; // 0 is path
  stack.push(start);

  const directions = [
    { dx: 0, dy: -2 }, // Up
    { dx: 0, dy: 2 },  // Down
    { dx: -2, dy: 0 }, // Left
    { dx: 2, dy: 0 }   // Right
  ];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    
    // Find unvisited neighbors
    const neighbors: { cell: Cell; wall: Cell }[] = [];
    
    for (const d of directions) {
      const nr = current.y + d.dy;
      const nc = current.x + d.dx;
      // Between is the wall
      const wr = current.y + d.dy / 2;
      const wc = current.x + d.dx / 2;

      if (isValid(nr, nc) && maze[nr][nc] === 1) {
        neighbors.push({
          cell: { x: nc, y: nr },
          wall: { x: wc, y: wr }
        });
      }
    }

    if (neighbors.length > 0) {
      // Choose random neighbor
      const chosen = neighbors[Math.floor(Math.random() * neighbors.length)];
      
      // Remove wall
      maze[chosen.wall.y][chosen.wall.x] = 0;
      // Mark neighbor as visited (path)
      maze[chosen.cell.y][chosen.cell.x] = 0;
      
      stack.push(chosen.cell);
    } else {
      stack.pop();
    }
  }

  // Ensure start and end are open (though algorithm does this essentially)
  // Start is (1,1). End could be far corner.
  // Let's ensure (1,1) is cleared (it is)
  // Let's pick a goal. Farthest point ideally, or just bottom-right (2*W-1, 2*H-1)
  
  return maze;
};
