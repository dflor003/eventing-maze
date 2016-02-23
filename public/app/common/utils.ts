export class Utils {
    static ShowDebug = true;
    static ShowLog = true;

    static isNullOrUndefined(val: any): boolean {
        return typeof val === 'undefined' || val === null;
    }

    static debug(...args: any[]) {
        if (Utils.ShowDebug && console && typeof console.debug === 'function') {
            console.debug.apply(console, arguments);
        }
    }

    static log(...args: any[]) {
        if (Utils.ShowLog && console && typeof console.log === 'function') {
            console.log.apply(console, arguments);
        }
    }

    static clamp(value: number, min: number, max: number): number {
        if (value <= min) {
            return min;
        }

        if (value >= max) {
            return max;
        }

        return value;
    }

    static getAngle(x: number, y: number): number {
        return Math.atan2(y, x);
    }

    static toDegrees(rads: number): number {
        Args.notNull(rads, 'rads');
        return rads * (180 / Math.PI);
    }

    static randInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}

export class IdGenerator {
    private static idChars = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
    private static numChars = 5;

    static nextId(): string {
        let result = '',
            chars = IdGenerator.idChars;

        for (let i = 0; i < IdGenerator.numChars; i++) {
            result += chars[Utils.randInt(0, chars.length)];
        }

        return result;
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
