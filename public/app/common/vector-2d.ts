'use strict';

import {Args, Utils} from './utils';

export class Vector2D {
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    static empty(): Vector2D {
        return new Vector2D(0, 0);
    }

    static add(left: Vector2D, right: Vector2D): Vector2D {
        Args.notNull(left, 'left');
        Args.notNull(right, 'right');

        return new Vector2D(left.x + right.x, left.y + right.y);
    }

    static subtract(left: Vector2D, right: Vector2D): Vector2D {
        Args.notNull(left, 'left');
        Args.notNull(right, 'right');

        return new Vector2D(left.x - right.x, left.y - right.y);
    }

    static multiply(left: Vector2D, right: Vector2D): Vector2D {
        Args.notNull(left, 'left');
        Args.notNull(right, 'right');

        return new Vector2D(left.x * right.x, left.y * right.y);
    }

    static scale(left: Vector2D, factor: number): Vector2D {
        Args.notNull(left, 'left');
        Args.notNull(factor, 'factor');

        return Vector2D.multiply(left, new Vector2D(factor, factor));
    }

    add(other: Vector2D): Vector2D {
        return Vector2D.add(this, other);
    }

    subtract(other: Vector2D): Vector2D {
        return Vector2D.subtract(this, other);
    }

    multiply(other: Vector2D): Vector2D {
        return Vector2D.multiply(this, other);
    }

    scale(factor: number): Vector2D {
        return Vector2D.scale(this, factor);
    }

    reverse(): Vector2D {
        return new Vector2D(-this.x, -this.y);
    }

    equals(other: Vector2D) {
        if (Utils.isNullOrUndefined(other)) {
            return false;
        }

        return this.x === other.x && this.y === other.y;
    }

    toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}