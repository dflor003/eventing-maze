'use strict';

import Container = PIXI.Container;
import Graphics = PIXI.Graphics;

import {Maze} from '../models/maze';
import {MazeCell} from '../models/maze-cell';
import {Direction} from '../../common/direction';
import {Vector2D} from '../../common/vector-2d';
import {MazeCellView} from './maze-cell-view';

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