/// <reference path="../../libs.d.ts" />
'use strict';

import Container = PIXI.Container;
import Graphics = PIXI.Graphics;
import Text = PIXI.Text;
import Rectangle = PIXI.Rectangle;
import Texture = PIXI.Texture;
import Sprite = PIXI.Sprite;
import DisplayObject = PIXI.DisplayObject;

import {KeyCode} from './keyboard';
import {GameManager} from './game-manager';
import {Maze} from './models/maze';
import {PlayerView} from './views/player-view';
import {MazeView} from './views/maze-view';
import {InputManager} from './keyboard';
import {EventBus} from '../common/event-bus';
import {Direction} from '../common/direction';

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
        player = new PlayerView(mazeView);

    scene.addChild(mazeView);
    scene.addChild(player);

    InputManager.instance.bind(KeyCode.UpArrow).release(() => EventBus.instance.emit('move', { direction: Direction.Up }));
    InputManager.instance.bind(KeyCode.DownArrow).release(() => EventBus.instance.emit('move', { direction: Direction.Down }));
    InputManager.instance.bind(KeyCode.LeftArrow).release(() => EventBus.instance.emit('move', { direction: Direction.Left }));
    InputManager.instance.bind(KeyCode.RightArrow).release(() => EventBus.instance.emit('move', { direction: Direction.Right }));

    return new GameManager(renderer, scene);
}