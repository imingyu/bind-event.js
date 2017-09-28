import Binder from './constructor.js';
import { version } from '../package.json';
import core from './core.js';

var isDom = obj => {
    return typeof obj === 'object' && (obj instanceof window.Node || isWindow(obj));
}
var isWindow = obj => {
    return typeof obj === 'object' && obj.window === obj;
}

var bind = (el, type, handler, useCapture) => {
    if (typeof useCapture !== 'boolean') {
        useCapture = false;
    }
    if (el.addEventListener) {
        el.addEventListener(type, handler, useCapture);
    } else if (el.attachEvent) {
        el.attachEvent('on' + type, handler);
    } else {
        el['on' + type] = handler;
    }
}

var unbind = (el, type, handler) => {
    if (el.removeEventListener) {
        el.removeEventListener(type, handler);
    } else if (el.attachEvent) {
        el.detachEvent('on' + type, handler);
    } else {
        el['on' + type] = null;
    }
}

var fire = (el, type, w) => {
    if (el.dispatchEvent) {
        el.dispatchEvent()
    }
}

var query = selector => {
    return document.querySelectorAll(selector);
}

var eventBinder = core({
    map(el, merge) {
        var binder = el.$$e || {};
        merge(binder);
    },
    get(el) {
        return el.$$e;
    },
    bind(el, type, namespace) {
        bind(el, type, el.$ee.realHandler, false);
    },
    unbind(el, type, namespace) {
        unbind(el, type, el.$ee.realHandler);
    },
    remove(el) {
        delete el.$$;
    }
})


class ElementBinder extends Binder {
    constructor(el) {
        super(el, eventBinder);
        if (typeof el === 'string') {
            var self = this;
            Array.prototype.forEach.call(query(el), function (item) {
                self[self.length] = item;
                self.length++;
            });
        }
    }
}

function E(obj) {
    return new ElementBinder(obj);
}
E.version = version;
E.on = on;
E.off = off;
E.trigger = trigger;

export default E;