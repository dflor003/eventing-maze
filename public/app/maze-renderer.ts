namespace app {
    interface GridOptions {
        sizeX: number;
        sizeY: number;
        pixelsX: number;
        pixelsY: number;
    }

    interface IPoint {
        x: number;
        y: number;
    }

    class Point implements IPoint {
        x: number;
        y: number;

        constructor(x : number, y: number) {
            this.x = x;
            this.y = y;
        }
    }

    export function renderMaze(canvas: HTMLCanvasElement, maze: IMaze) {
        var opts =
            r = new Renderer(canvas, );
    }

    class Renderer {
        canvasWidth: number;
        canvasHeight: number;
        sizeX: number;
        sizeY: number;
        pixelsX: number;
        pixelsY: number;
        ctx: CanvasRenderingContext2D;

        constructor(canvas: HTMLCanvasElement, opts: GridOptions) {
            this.canvasWidth = canvas.width;
            this.canvasHeight = canvas.height;
            this.ctx = canvas.getContext('2d');
            this.sizeX = opts.sizeX;
            this.sizeY = opts.sizeY;
            this.pixelsX = opts.pixelsX;
            this.pixelsY = opts.pixelsY;
        }

        renderLine(from: IPoint, to: IPoint) {
            var ctx = this.ctx,
                sizeX = this.pixelsX,
                pixelStart = new Point(from.x * sizeX, from.y * sizeX),
                pixelEnd = new Point(to.x * sizeX, to.y * sizeX);

            ctx.moveTo(pixelStart.x, pixelStart.y);
            ctx.lineTo(pixelEnd.x, pixelEnd.y);
            ctx.stroke();
        }
    }
}