import {Direction} from '../common/direction';
import {Vector2D} from '../common/vector-2d';

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

    get position(): Vector2D {
        return new Vector2D(this.x, this.y);
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