namespace app.common {
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