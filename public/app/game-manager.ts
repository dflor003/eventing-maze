import Container = PIXI.Container;
import DisplayObject = PIXI.DisplayObject;

import {Utils} from './common/utils';

export interface IDynamic {
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
        this.run = this.run.bind(this);
    }

    start(): void {
        Utils.log('Game loop starting');
        this.isRunning = true;
        this.run();
    }

    stop(): void {
        this.isRunning = false;
    }

    run(): void {
        if (!this.isRunning) {
            return Utils.log('Game loop stopping');
        }

        requestAnimationFrame(this.run);
        this.update(this.scene);
        this.renderer.render(this.scene);
    }

    update(obj: IDynamic): void {
        if (typeof obj.update === 'function') {
            obj.update();
        }

        if (obj.children && obj.children.length) {
            for (let child of obj.children) {
                this.update(child);
            }
        }
    }
}
