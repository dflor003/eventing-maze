import {Utils} from './utils';

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
        Utils.debug(`Emitting event '${event}'`, payload);

        let callback = this.getCallbackFor(event);
        callback.fire(payload);
        return this;
    }

    private getCallbackFor(event: string): JQueryCallback {
        return this.callbacks[event] || (this.callbacks[event] = $.Callbacks('unique'));
    }
}