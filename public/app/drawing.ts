namespace app {

    export class Utils {
        static isNullOrUndefined(val: any): boolean {
            return typeof val === 'undefined' || val === null;
        }
    }

    export class Args {
        static notNull<T>(val: T, name: string): T {
            if (Utils.isNullOrUndefined(val)) {
                throw new Error(`Argument was null: ${name}`);
            }

            return val;
        }
    }

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

        static multiply(left: Vector2D, scale: number): Vector2D;
        static multiply(left: Vector2D, right: Vector2D): Vector2D;
        static multiply(left: Vector2D, right: any): Vector2D {
            Args.notNull(left, 'left');
            Args.notNull(right, 'right');

            if (typeof right === 'number') {
                return Vector2D.multiply(left, new Vector2D(right, right));
            }

            if (right instanceof Vector2D) {
                return new Vector2D(left.x * right.x, left.y * right.y);
            }

            throw new Error(`Invalid type for right: ${right}`);
        }

        add(other: Vector2D): Vector2D {
            return Vector2D.add(this, other);
        }

        subtract(other: Vector2D): Vector2D {
            return Vector2D.subtract(this, other);
        }

        multiply(scale: number): Vector2D;
        multiply(other: Vector2D): Vector2D;
        multiply(right: any): Vector2D {
            return Vector2D.multiply(this, right);
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

    export class Direction extends Vector2D{
        static Up = new Direction(0, -1, 'Up');
        static Down = new Direction(0, 1, 'Down');
        static Left = new Direction(-1, 0, 'Left');
        static Right = new Direction(1, 0, 'Right');

        private _name: string;

        constructor(x: number, y: number, name: string) {
            super(x, y);
            this._name = name;
        }

        name(): string {
            return this._name;
        }

        opposite(): Direction {
            switch (this) {
                case Direction.Up: return Direction.Down;
                case Direction.Down: return Direction.Up;
                case Direction.Left: return Direction.Right;
                case Direction.Right: return Direction.Left;
            }
        }

        toString(): string {
            return this._name;
        }
    }
}