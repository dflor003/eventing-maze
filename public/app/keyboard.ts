const Debug = true;

export enum KeyCode {
    LeftArrow = 37,
    UpArrow = 38,
    RightArrow = 39,
    DownArrow = 40,
}

export class KeyBinding {
    private _keyCode: KeyCode;
    private _pressedCallbacks: JQueryCallback = $.Callbacks('unique');
    private _releasedCallbacks: JQueryCallback = $.Callbacks('unique');
    private _isPressed: boolean = false;

    constructor(keyCode: KeyCode) {
        this._keyCode = keyCode;

        if (Debug) {
            this.press(() => console.debug(`Key pressed: ${KeyCode[keyCode]}`))
            this.release(() => console.debug(`Key released: ${KeyCode[keyCode]}`))
        }
    }

    press(handler: () => void): this {
        this._pressedCallbacks.add(handler);
        return this;
    }

    release(handler: () => void): this {
        this._releasedCallbacks.add(handler);
        return this;
    }

    bindTo(element: JQuery): this {
        element
            .on('keydown', evt => this.downHandler(evt))
            .on('keyup', evt => this.upHandler(evt));

        return this;
    }

    private downHandler(evt: JQueryEventObject): void {
        let keyCode = evt.which;
        if (keyCode === this._keyCode) {
            if (!this._isPressed) {
                this._pressedCallbacks.fire(this);
            }

            this._isPressed = true;
            evt.preventDefault();
        }
    }

    private upHandler(evt: JQueryEventObject): void {
        let keyCode = evt.which;
        if (keyCode === this._keyCode) {
            if (this._isPressed) {
                this._releasedCallbacks.fire(this);
            }

            this._isPressed = false;
            evt.preventDefault();
        }
    }
}

export class InputManager {
    private static _instance = new InputManager();
    private bindScope: JQuery;
    private bindings: KeyBinding[] = [];

    static get instance(): InputManager {
        return InputManager._instance;
    }

    constructor(bindScope: JQuery = $(window)) {
        this.bindScope = bindScope;
    }

    bind(keyCode: KeyCode): KeyBinding {
        let binding = new KeyBinding(keyCode).bindTo(this.bindScope);
        this.bindings.push(binding);
        return binding;
    }
}