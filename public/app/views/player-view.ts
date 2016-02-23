import Container = PIXI.Container;
import Rectangle = PIXI.Rectangle;
import Sprite = PIXI.Sprite;
import {MazeView} from './maze-view';
import {Direction} from '../common/direction';
import {Vector2D} from '../common/vector-2d';
import {EventBus} from '../common/event-bus';
import {Utils} from '../common/utils';

let TextureCache = PIXI.utils.TextureCache;

type InterpolationFunction<T> = (entity: T) => boolean;

export class PlayerView extends Container {
    private maze: MazeView;
    private path: Direction[] = [];
    private mazePosition = Vector2D.empty();
    private maxVelocity = new Vector2D(5, 5);
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

        this.mazePosition = new Vector2D(centerX, centerY);
        this.x = centerPos.x + (this.width / 4);
        this.y = centerPos.y;
    }

    move(direction: Direction): void {
        Utils.debug(`Player move event ${direction}`);
        this.path.push(direction);
    }

    update(): void {
        if (!this.path.length) {
            return;
        }

        let target = this.path.shift(),
            currentX = this.mazePosition.x,
            currentY = this.mazePosition.y,
            cellInDirection = this.maze.cellViewInDirection(currentX, currentY, target);

        if (!cellInDirection || cellInDirection.hasWall(target.opposite())) {
            return Utils.debug(`Tried to move in direction ${target} but there was a wall!`);
        }

        Utils.debug(`Player update moving in direction ${target}`);
        let center = cellInDirection.position;
        this.x = center.x + (this.width / 4);
        this.y = center.y;
        this.mazePosition = new Vector2D(cellInDirection.mazePosition.x, cellInDirection.mazePosition.y);
    }
}