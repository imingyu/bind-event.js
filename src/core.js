import ShimMap from './map.js';
import * as util from './util.js';

var $map = new ShimMap();

var init = obj => {
    $map.set(obj, {
        target: obj,
        ts: new Date().getTime(),
        handlers: {},
        realHandler: function (event) {
            return exec(this, obj, event.type, Array.from(arguments));
        }
    });
}

var exec = (runtimeTarget, bindingTarget, type, eventArgs) => {
    var start = new Date().getTime();
    console.log('exec.start:' + start);
    var binder = $map.get(bindingTarget),
        prop, handlerItem, result, ns;
    for (prop in binder.handlers) {
        if (prop === type) {
            var events = binder.handlers[type];
            if (events) {
                for (ns in binder.handlers[type]) {
                    handlerItem = events[ns];
                    if (Array.isArray(handlerItem)) {
                        handlerItem.forEach(item => {
                            var res = item.apply(runtimeTarget, eventArgs);
                            if (typeof res === 'boolean') {
                                result = typeof result === 'boolean' ? result && res : res;
                            }
                        })
                    } else {
                        var res = handlerItem.apply(runtimeTarget, eventArgs);
                        if (typeof res === 'boolean') {
                            result = typeof result === 'boolean' ? result && res : res;
                        }
                    }
                }
            }
        }
    }
    var end = new Date().getTime();
    console.log('exec.end:' + end);
    console.log('exec.total:' + (end - start));
    return result;
}

export var on = (obj, type, handler) => {
    var namespace = "___default___",
        index = type.indexOf('.');
    if (index != -1) {
        namespace = type.substr(index + 1, type.length);
        type = type.substr(0, index);
    }
    var binder = $map.get(obj);
    if (!$map.has(obj)) {
        init(obj);
        binder = $map.get(obj);
        if (util.isDom(obj)) {
            util.bind(obj, type, binder.realHandler);
        }
    }

    binder.handlers[type] = binder.handlers[type] || {};
    if (namespace === '___default___') {
        //顶级命名支持多次绑定，如：click
        binder.handlers[type][namespace] = binder.handlers[type][namespace] || [];
        binder.handlers[type][namespace].push(handler);
    } else {
        //含子命名空间不支持多次绑定，如：click.user
        binder.handlers[type][namespace] = handler;
    }
}

export var off = (obj, type) => {
    if (!$map.has(obj)) return;
    var binder = $map.get(obj),
        namespace = "___default___",
        index = type.indexOf('.');
    if (index != -1) {
        namespace = type.substr(index + 1, type.length);
        type = type.substr(0, index);
    }
    if (binder.handlers[type]) {
        if (namespace === "___default___") {
            delete binder.handlers[type];
            if (util.isDom(obj)) {
                util.unbind(obj, type, binder.realHandler);
            }
            $map.delete(obj);
        } else {
            delete binder.handlers[type][namespace];
        }
    }
}

export var trigger = (obj, type) => {
}