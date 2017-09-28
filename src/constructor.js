export default class Binder {
    constructor(obj, binder) {
        this.binder = binder;
        this.length = 0;
        if (typeof obj === 'object') {
            this[0] = obj;
            this.length++;
        }
    }
    on() {
        var args = Array.from(arguments),
            i, len = this.length;
        for (i = 0; i < len; i++) {
            this.binder.on.apply(null, [this[i]].concat(args));
        }
    }
    off() {
        var args = Array.from(arguments),
            i, len = this.length;
        for (i = 0; i < len; i++) {
            this.binder.off.apply(null, [this[i]].concat(args));
        }
    }
    trigger() {
        var args = Array.from(arguments),
            i, len = this.length;
        for (i = 0; i < len; i++) {
            this.binder.trigger.apply(null, [this[i]].concat(args));
        }
    }
}