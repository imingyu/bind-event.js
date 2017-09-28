import Map from './map.js';
import Binder from './constructor.js';
import { version } from '../package.json';
import core from './core.js';

var $map = new Map(),
    eventBinder = core({
        map(obj, merge) {
            var binder = {};
            merge(binder);
            $map.set(obj, binder);
        },
        get(obj) {
            return $map.get(obj);
        },
        bind(obj, type, namespace) {
            bind(obj, type, $map.get(obj).realHandler, false);
        },
        unbind(obj, type, namespace) {
            unbind(obj, type, $map.get(obj).realHandler);
        },
        remove(obj) {
            $map.delete(obj);
        }
    });

class ObjectBinder extends Binder {
    constructor(el) {
        super(el, eventBinder);
    }
}

function E(obj) {
    return new ObjectBinder(obj);
}
E.version = version;
E.on = on;
E.off = off;
E.trigger = trigger;

export default ObjectBinder;