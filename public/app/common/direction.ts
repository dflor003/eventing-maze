'use strict';

import {Vector2D} from './vector-2d';
import {Utils} from './utils';

export class Direction extends Vector2D{
    static Up = new Direction(0, -1);
    static Down = new Direction(0, 1);
    static Left = new Direction(-1, 0);
    static Right = new Direction(1, 0);

    private _angle: number;

    constructor(x: number, y: number) {
        super(Utils.clamp(x, -1, 1), Utils.clamp(y, -1, 1));
        this._angle = Utils.getAngle(this.x, this.y);
    }

    static getDirectionTo(from: Vector2D, to: Vector2D): Direction {
        let diff = Vector2D.subtract(to, from);
        return new Direction(diff.x, diff.y);
    }

    get angleRads(): number {
        return this._angle;
    }

    get angleDegrees(): number {
        return Utils.toDegrees(this._angle);
    }

    name(): string {
        let degrees = this.angleDegrees;
        if (degrees === 0) return 'Right';
        if (degrees === -90) return 'Up';
        if (Math.abs(degrees) === 180) return 'Left';
        if (degrees === 90) return 'Down';

        return degrees.toFixed(2);
    }

    opposite(): Direction {
        return new Direction(-this.x, -this.y);
    }

    toString(): string {
        return this.name();
    }
}