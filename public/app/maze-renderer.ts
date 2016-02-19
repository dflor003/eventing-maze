/// <reference path="../libs.d.ts" />

namespace app {
    import Container = PIXI.Container;
    import Graphics = PIXI.Graphics;
    import Text = PIXI.Text;
    import Rectangle = PIXI.Rectangle;
    import Texture = PIXI.Texture;
    import Sprite = PIXI.Sprite;

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
            renderer = PIXI.autoDetectRenderer(width, height, { antialias: true, transparent: true, resolution: 1 });

        renderer.autoResize = true;
        renderer.backgroundColor = 0xFFF;
        $element.append(renderer.view);

        let scene = new Container(),
            mazeView = new MazeView(maze),
            player = new PlayerView();

        scene.addChild(mazeView);
        scene.addChild(player);
        let centerX = maze.width / 2,
            centerY = maze.height / 2,
            centerCell = mazeView.cellViewAt(centerX, centerY),
            centerPos = centerCell.getGlobalPosition(undefined);

        player.x = centerPos.x + (player.width / 4);
        player.y = centerPos.y;

        return new GameManager(renderer, scene);
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

            this.renderer.render(this.scene);
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

        private build(): void {
            let currentX = 0,
                currentY = 0,
                size = this.size;

            if (this.cell.hasWall(Direction.Up)) {
                this.addChild(this.makeLine(new Point(currentX, currentY), new Point(currentX + size, currentY)));
            }
            if (this.cell.hasWall(Direction.Left)) {
                this.addChild(this.makeLine(new Point(currentX, currentY), new Point(currentX, currentY + size)));
            }
            if (this.cell.hasWall(Direction.Down)) {
                this.addChild(this.makeLine(new Point(currentX, currentY + size), new Point(currentX + size, currentY + size)));
            }
            if (this.cell.hasWall(Direction.Right)) {
                this.addChild(this.makeLine(new Point(currentX + size, currentY), new Point(currentX + size, currentY + size)));
            }

            if (!Debug) {
                return;
            }

            let text = new Text(this.cell.setId.toString(), { font: '12px Lucida Console', fill: 'black' });
            text.x = 5;
            text.y = size / 2;
            this.addChild(text);
        }

        private makeLine(from: IPoint, to: IPoint): Graphics {
            var line = new Graphics();
            line.lineStyle(3, 0x000, 1);
            line.moveTo(from.x, from.y);
            line.lineTo(to.x, to.y);
            return line;
        }
    }

    export class PlayerView extends Container {
        private texturesByDirection: { [key: string]: Texture[]; } = {};

        constructor() {
            super();
            this.build();
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
        }
    }
}