namespace app.common {
    export class Utils {
        static ShowDebug = true;
        static ShowLog = true;

        static isNullOrUndefined(val: any): boolean {
            return typeof val === 'undefined' || val === null;
        }

        static debug(...args:any[]) {
            if (Utils.ShowDebug && console && typeof console.debug === 'function') {
                console.debug.apply(console, arguments);
            }
        }

        static log(...args:any[]) {
            if (Utils.ShowLog && console && typeof console.log === 'function') {
                console.log.apply(console, arguments);
            }
        }
    }

    export class Args {
        static notNull<T>(val: T, name: string): T {
            if (Utils.isNullOrUndefined(val)) {
                throw new Error(`Argument was null: ${name}`);
            }

            return val;
        }
    }
}