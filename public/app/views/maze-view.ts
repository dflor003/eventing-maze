import Container = PIXI.Container;
import Graphics = PIXI.Graphics;
import {Maze, MazeCell} from '../models/maze';
import {Direction} from "../common/direction";
import {Vector2D} from "../common/vector-2d";

export class MazeView extends Container {
    private pixelsPerCell = 48;
    private marginX = 10;
    private marginY = 10;
    private maze: Maze;
    private viewByMazePosition: MazeCellView[][] = [];

    constructor(maze: Maze) {
        super();
        this.maze = maze;
        this.build();
    }

    get mazeWidth(): number {
        return this.maze.width;
    }

    get mazeHeight(): number {
        return this.maze.height;
    }

    build(): void {
        let pixelsPerCell = this.pixelsPerCell,
            marginX = this.marginX,
            marginY = this.marginY,
            currentX = marginX,
            currentY = marginY,
            maze = this.maze;

        for (let row = 0; row < maze.height; row++) {
            currentX = marginX;
            let rowCells = [];
            for (let col = 0; col < maze.width; col++) {
                let cell = maze.getCell(col, row),
                    cellView = new MazeCellView(cell, pixelsPerCell);

                cellView.x = currentX;
                cellView.y = currentY;

                this.addChild(cellView);
                rowCells.push(cellView);

                currentX += pixelsPerCell;
            }

            this.viewByMazePosition.push(rowCells);
            currentY += pixelsPerCell;
        }
    }

    cellViewAt(x: number, y: number): MazeCellView {
        let cols = this.viewByMazePosition[y];
        return cols ? cols[x] : null;
    }

    cellViewInDirection(currentX: number, currentY: number, direction: Direction): MazeCellView {
        if (direction.equals(Direction.Up)) {
            return this.cellViewAt(currentX, currentY - 1);
        }
        if (direction.equals(Direction.Down)) {
            return this.cellViewAt(currentX, currentY + 1);
        }
        if (direction.equals(Direction.Left)) {
            return this.cellViewAt(currentX - 1, currentY);
        }
        if (direction.equals(Direction.Right)) {
            return this.cellViewAt(currentX + 1, currentY);
        }

        throw new Error('Invalid direction');
    }
}

export class MazeCellView extends Container {
    private cell: MazeCell;
    private size: number;

    constructor(cell: MazeCell, size: number) {
        super();
        this.cell = cell;
        this.size = size;
        this.build();
    }


    get mazePosition(): Vector2D {
        return this.cell.position;
    }

    hasWall(direction: Direction): boolean {
        return this.cell.hasWall(direction);
    }

    getCenter(): Vector2D {
        let globalPosition = this.getGlobalPosition(undefined),
            centerX = globalPosition.x + (this.width / 2),
            centerY = globalPosition.y + (this.height / 2);

        return new Vector2D(centerX, centerY);
    }

    private build(): void {
        let currentX = 0,
            currentY = 0,
            size = this.size;

        if (this.cell.hasWall(Direction.Up)) {
            this.addChild(this.makeLine(new Vector2D(currentX, currentY), new Vector2D(currentX + size, currentY)));
        }
        if (this.cell.hasWall(Direction.Left)) {
            this.addChild(this.makeLine(new Vector2D(currentX, currentY), new Vector2D(currentX, currentY + size)));
        }
        if (this.cell.hasWall(Direction.Down)) {
            this.addChild(this.makeLine(new Vector2D(currentX, currentY + size), new Vector2D(currentX + size, currentY + size)));
        }
        if (this.cell.hasWall(Direction.Right)) {
            this.addChild(this.makeLine(new Vector2D(currentX + size, currentY), new Vector2D(currentX + size, currentY + size)));
        }
    }

    private makeLine(from: Vector2D, to: Vector2D): Graphics {
        var line = new Graphics();
        line.lineStyle(3, 0x000, 1);
        line.moveTo(from.x, from.y);
        line.lineTo(to.x, to.y);
        return line;
    }
}