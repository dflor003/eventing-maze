/// <reference path="../libs.d.ts" />

namespace app {
    import Container = PIXI.Container;
    import Graphics = PIXI.Graphics;
    import Text = PIXI.Text;
    import Rectangle = PIXI.Rectangle;
    import Texture = PIXI.Texture;
    import Sprite = PIXI.Sprite;
    import DisplayObject = PIXI.DisplayObject;

    let TextureCache = PIXI.utils.TextureCache;
    const Debug = false;

    export function loadAssets(done: () => void): void {
        PIXI.loader
            .add([
                'assets/player.png'
            ])
            .load(done);
    }

    export function renderMaze(element: HTMLElement, maze: Maze): GameManager {
        // Setup and configure the PIXI renderer
        let $element = $(element),
            width = $element.width(),
            height = $element.height(),
            renderer = PIXI.autoDetectRenderer(width, height, {antialias: true, transparent: true, resolution: 1});

        renderer.autoResize = true;
        renderer.backgroundColor = 0xFFF;
        $element.append(renderer.view);

        let scene = new Container(),
            mazeView = new MazeView(maze),
            player = new PlayerView(mazeView);

        scene.addChild(mazeView);
        scene.addChild(player);

        return new GameManager(renderer, scene);
    }

    interface IDynamic {
        update?: () => void;
        children?: DisplayObject[];
    }

    export class GameManager {
        private scene: Container;
        private renderer: PIXI.CanvasRenderer|PIXI.WebGLRenderer;

        isRunning = false;

        constructor(renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer, scene: Container) {
            this.renderer = renderer;
            this.scene = scene;
        }

        start(): void {
            this.isRunning = true;
            this.run();
        }

        stop(): void {
            this.isRunning = false;
        }

        run(): void {
            if (!this.isRunning) {
                return;
            }

            requestAnimationFrame(this.run);
            this.update(this.scene);
            this.renderer.render(this.scene);
        }

        update(obj: IDynamic): void {
            if(typeof obj.update === 'function') {
                obj.update();
            }

            if (obj.children && obj.children.length) {
                for(let child of obj.children) {
                    this.update(child);
                }
            }
        }
    }

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
            return this.viewByMazePosition[y][x];
        }

        cellViewInDirection(currentX: number, currentY: number, direction: Direction): MazeCellView {
            switch (direction) {
                case Direction.Up:
                    return this.cellViewAt(currentX, currentY - 1);
                case Direction.Down:
                    return this.cellViewAt(currentX, currentY + 1);
                case Direction.Left:
                    return this.cellViewAt(currentX - 1, currentY);
                case Direction.Up:
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

        hasWall(direction: Direction): boolean {
            return this.cell.hasWall(direction);
        }

        get mazePosition(): Vector2D {
            return this.cell.position;
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

            if (!Debug) {
                return;
            }

            let text = new Text(this.cell.setId.toString(), {font: '12px Lucida Console', fill: 'black'});
            text.x = 5;
            text.y = size / 2;
            this.addChild(text);
        }

        private makeLine(from: Vector2D, to: Vector2D): Graphics {
            var line = new Graphics();
            line.lineStyle(3, 0x000, 1);
            line.moveTo(from.x, from.y);
            line.lineTo(to.x, to.y);
            return line;
        }
    }

    type InterpolationFunction<T> = (entity: T) => boolean;

    export class PlayerView extends Container {
        private maze: MazeView;
        private mazeX = 0;
        private mazeY = 0;
        private path: Vector2D[];
        private actions: InterpolationFunction<PlayerView>[] = [];
        private accelX: number = 0;
        private accelY: number = 0;
        private velocityX: number = 0;
        private velocityY: number = 0;

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
                return;
            }

            this.path.push(cellInDirection.mazePosition);
        }

        update(): void {
            this.velocityX += this.accelX;
            this.velocityY += this.accelY;

            this.x += this.velocityX;
            this.y += this.velocityY;
        }
    }

    export class EventBus {
        private static _instance = new EventBus();
        private callbacks = {};

        static get instance(): EventBus {
            return EventBus._instance;
        }

        on(event: string, handler: Function): EventBus {
            let callback = this.getCallbackFor(event);
            callback.add(handler);
            return this;
        }

        emit(event: string, payload: any): EventBus {
            let callback = this.getCallbackFor(event);
            callback.fire(payload);
            return this;
        }

        private getCallbackFor(event: string): JQueryCallback {
            return this.callbacks[event] || (this.callbacks[event] = $.Callbacks('unique'));
        }
    }
}