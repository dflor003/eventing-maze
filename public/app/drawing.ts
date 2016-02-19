namespace app {
    export interface IPoint {
        x: number;
        y: number;
    }

    export class Point implements IPoint {
        x: number;
        y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        toString(): string {
            return `(${this.x}, ${this.y})`;
        }
    }

    export class Direction {
        static Up = new Direction('Up', 'Down');
        static Down = new Direction('Down', 'Up');
        static Left = new Direction('Left', 'Right');
        static Right = new Direction('Right', 'Left');

        private _name: string;
        private _opposite: string;

        constructor(name: string, opposite: string) {
            this._name = name;
            this._opposite = opposite;
        }

        name(): string {
            return this._name;
        }

        opposite(): Direction {
            return Direction[this._opposite];
        }

        toString(): string {
            return this._name;
        }
    }
}