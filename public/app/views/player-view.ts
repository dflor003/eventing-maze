namespace app.views {
    import Vector2D = app.common.Vector2D;
    import Direction = app.common.Direction;
    import EventBus = app.common.EventBus;
    import Container = PIXI.Container;
    import Rectangle = PIXI.Rectangle;
    import Sprite = PIXI.Sprite;
    import Utils = app.common.Utils;

    let TextureCache = PIXI.utils.TextureCache;

    type InterpolationFunction<T> = (entity: T) => boolean;

    export class PlayerView extends Container {
        private maze: MazeView;
        private mazeX = 0;
        private mazeY = 0;
        private path: Direction[] = [];
        private actions: InterpolationFunction<PlayerView>[] = [];
        private acceleration: Vector2D = Vector2D.empty();
        private velocity: Vector2D = Vector2D.empty();

        constructor(maze: MazeView) {
            super();
            this.maze = maze;
            this.build();
            EventBus.instance.on('move', evt => this.move(evt.direction));
        }

        build(): void {
            let framesPerAnim = 4,
                directions = 4,
                width = 128,
                height = 192,
                cellWidth = width / framesPerAnim,
                cellHeight = height / directions,
                texture = TextureCache['assets/player.png'],
                rect1 = new Rectangle(0, 0, cellWidth, cellHeight);

            texture.frame = rect1;
            let sprite = new Sprite(texture);
            sprite.x = 0;
            sprite.y = 0;
            this.addChild(sprite);

            let maze = this.maze,
                centerX = maze.mazeWidth / 2,
                centerY = maze.mazeHeight / 2,
                centerCell = maze.cellViewAt(centerX, centerY),
                centerPos = centerCell.getGlobalPosition(undefined);

            this.mazeX = centerX;
            this.mazeY = centerY;
            this.x = centerPos.x + (this.width / 4);
            this.y = centerPos.y;
        }

        move(direction: Direction): void {

            let cellInDirection = this.maze.cellViewInDirection(this.mazeX, this.mazeY, direction);
            if (!cellInDirection || cellInDirection.hasWall(direction.opposite())) {
                return Utils.debug(`Tried to move into wall ${direction}`);
            }

            Utils.debug(`Player move event ${direction}`);
            this.path.push(direction);
        }

        update(): void {
            if (!this.path.length) {
                return;
            }

            let direction = this.path.shift(),
                moveVector = direction.scale(20);

            Utils.debug(`Player update moving in direction ${direction}`)
            this.x += moveVector.x;
            this.y += moveVector.y;
        }
    }
}