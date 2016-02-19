namespace app {
    import Container = PIXI.Container;
    import Graphics = PIXI.Graphics;
    type WallMap = { [key: string]: boolean; };

    export class MazeCell {
        private static lastSetId = 1;
        private x: number;
        private y: number;
        private walls: WallMap = {};

        setId: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
            this.setId = MazeCell.lastSetId++;
            this.walls[Direction.Up.toString()] = true;
            this.walls[Direction.Down.toString()] = true;
            this.walls[Direction.Left.toString()] = true;
            this.walls[Direction.Right.toString()] = true;
        }

        get position(): Point {
            return new Point(this.x, this.y);
        }

        getX(): number {
            return this.x;
        }

        getY(): number {
            return this.y;
        }

        hasWall(direction: Direction): boolean {
            return this.walls[direction.toString()] === true;
        }

        mergeWith(other: MazeCell): void {
            let directionToOther = this.directionTo(other);
            this.walls[directionToOther.name()] = false;
            other.walls[directionToOther.opposite().name()] = false;
            other.setId = this.setId;
        }

        isSameSetAs(other: MazeCell): boolean {
            return this.setId === other.setId;
        }

        directionTo(other: MazeCell): Direction {
            if (this.x < other.x && this.y === other.y) {
                return Direction.Right;
            }

            if (this.x > other.x && this.y === other.y) {
                return Direction.Left;
            }

            if (this.y < other.y && this.x === other.x) {
                return Direction.Down;
            }

            if (this.y > other.y && this.x === other.x) {
                return Direction.Up;
            }

            throw new Error('Invalid direction comparison');
        }
    }

    export class Maze {
        private cells: MazeCell[][];

        width: number;
        height: number;

        constructor(width: number, height: number) {
            this.width = width;
            this.height = height;
            this.cells = [];
            for (let row = 0; row < height; row++) {
                var cols = [];
                this.cells.push(cols);
                for (let col = 0; col < width; col++) {
                    var cell = new MazeCell(col, row);
                    cols.push(cell);
                }
            }
        }

        getCell(x: number, y: number): MazeCell {
            var cell = this.cells[y][x];
            if (!cell) {
                throw new Error(`No cell at (${x}, ${y})`);
            }

            return cell;
        }
    }

    export function generateMaze(width: number, height: number): Maze {
        const MergeHorizontalChance = 0.50;
        const MergeVerticalChance = 0.3;
        let maze = new Maze(width, height),
            randInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

        // Iterate every row but the last
        for (let row = 0; row < height - 1; row++) {
            // Capture distinct cells and each cell by set
            let distinctSets = [];
            let setCells = {};

            // Iterate all the columns and randomly join adjacent cells
            for (let col = 0; col < width; col++) {
                let current = maze.getCell(col, row),
                    next = col === width - 1 ? null : maze.getCell(col + 1, row),
                    setId = current.setId,
                    cellsForSet = setCells[setId] || (setCells[setId] = []),
                    shouldJoin = !!next && Math.random() < MergeHorizontalChance && !current.isSameSetAs(next);

                if (cellsForSet.indexOf(current) === -1) {
                    cellsForSet.push(current);
                }

                if (distinctSets.indexOf(setId) === -1) {
                    distinctSets.push(setId);
                }

                if (shouldJoin) {
                    current.mergeWith(next);
                }
            }

            // Randomly merge cells downward, at least one per set
            for (let i = 0; i < distinctSets.length; i++) {
                let setId = distinctSets[i],
                    cells: MazeCell[] = setCells[setId],
                    nextRow = row + 1,
                    stop = false;

                while (!stop) {
                    let randomIndex = randInt(0, cells.length),
                        randomCell = cells[randomIndex],
                        cellUnder = maze.getCell(randomCell.getX(), nextRow);

                    randomCell.mergeWith(cellUnder);
                    cells.splice(randomIndex, 1);
                    if (Math.random() > MergeVerticalChance || cells.length === 0) {
                        stop = true;
                    }
                }
            }
        }

        // Merge all cells with adjacent cells that are of different sets
        for (let col = 0; col < width - 1; col++) {
            let current = maze.getCell(col, height - 1),
                next = maze.getCell(col + 1, height - 1);

            if (!current.isSameSetAs(next)) {
                current.mergeWith(next);
            }
        }

        return maze;
    }
}