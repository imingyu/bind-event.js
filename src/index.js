import { version } from '../package.json';
import { on, off, trigger } from './core.js';
import * as util from './util.js';
class Binder {
    constructor(obj) {
        this.length = 0;
        if (typeof obj === 'string') {
            var els = util.query(obj);
            if (els.length > 0) {
                var self = this;
                Array.prototype.forEach.call(els, function (el) {
                    self[self.length] = el;
                    self.length++;
                });
            }
        } else if (typeof obj === 'object') {
            this[0] = obj;
        } else {
            console.error('不支持对非object类型的数据进行事件绑定');
        }
    }

    on() {
        var args = Array.from(arguments),
            i, len = this.length;
        for (i = 0; i < len; i++) {
            on.apply(null, [this[i]].concat(args));
        }
    }
    off() {
        var args = Array.from(arguments),
            i, len = this.length;
        for (i = 0; i < len; i++) {
            off.apply(null, [this[i]].concat(args));
        }
    }
    trigger() {
    }
}

function E(obj){
    return new Binder(obj);
}
E.version = version;
E.on = on;
E.off = off;
E.trigger = trigger;

export default E;