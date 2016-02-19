/// <reference path="../libs.d.ts" />

namespace app {
    import Container = PIXI.Container;
    import Graphics = PIXI.Graphics;
    import Text = PIXI.Text;

    const Debug = false;

    export function renderMaze(element: HTMLElement, maze: Maze): GameManager {
        // Setup and configure the PIXI renderer
        let $element = $(element),
            width = $element.width(),
            height = $element.height(),
            renderer = PIXI.autoDetectRenderer(width, height, { antialias: true, transparent: true, resolution: 1 });

        renderer.autoResize = true;
        renderer.backgroundColor = 0xFFF;
        $element.append(renderer.view);

        let mazeView = new MazeView(maze);
        return new GameManager(renderer, mazeView);
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
        private pixelsPerCell = 40;
        private marginX = 10;
        private marginY = 10;
        private maze: Maze;

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
                for (let col = 0; col < maze.width; col++) {
                    let cell = maze.getCell(col, row),
                        cellView = new MazeCellView(cell, pixelsPerCell);

                    cellView.x = currentX;
                    cellView.y = currentY;

                    this.addChild(cellView);

                    currentX += pixelsPerCell;
                }

                currentY += pixelsPerCell;
            }
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
        constructor() {
            super();
            this.build();
        }

        build(): void {

        }
    }
}