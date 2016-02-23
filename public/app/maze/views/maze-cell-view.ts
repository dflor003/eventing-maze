'use strict';

import Graphics = PIXI.Graphics;
import Container = PIXI.Container;

import {Vector2D} from '../../common/vector-2d';
import {Direction} from '../../common/direction';
import {MazeCell} from '../models/maze-cell';

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