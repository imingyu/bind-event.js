import ShimMap from './map.js';
import * as util from './util.js';

var $map = new ShimMap();

var getBinder = obj => {
    var binder = obj.$$e || $map.get(obj);
    if (!binder) {
        binder = {
            target: obj,
            ts: new Date().getTime(),
            handlers: {},
            realHandler: function (event) {
                return exec(this, obj, event.type, Array.from(arguments));
            }
        };
        if (util.isDom(obj)) {
            obj.$$e = binder;
        }
        $map.set(obj, binder);
    }
    return binder;
}

var decomposeEventName = function (eventName) {
    var namespace = "___default___",
        index = eventName.indexOf('.');
    if (index != -1) {
        namespace = eventName.substr(index + 1, eventName.length);
        eventName = eventName.substr(0, index);
    }
    return {
        type: eventName,
        namespace: namespace
    }
}
var exec = (runtimeTarget, bindingTarget, type, eventArgs) => {
    if(process.env.NODE_ENV !== 'production'){
        console.log(new Date().getTime());
    }
    var binder = bindingTarget.$$e || $map.get(bindingTarget),
        handlerItem, result, ns,
        events = binder.handlers[type];
    for (ns in events) {
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
    if(process.env.NODE_ENV !== 'production'){
        console.log(new Date().getTime());
    }
    return result;
}

export var on = (obj, eventName, handler) => {
    var typeInfo = decomposeEventName(eventName),
        namespace = typeInfo.namespace,
        type = typeInfo.type,
        binder = getBinder(obj);
    if (util.isDom(obj) && !binder.handlers[type]) {
        util.bind(obj, type, binder.realHandler);
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

export var off = (obj, eventName) => {
    var typeInfo = decomposeEventName(eventName),
        namespace = typeInfo.namespace,
        type = typeInfo.type,
        binder = getBinder(obj),
        events = binder.handlers[type];

    if (binder && events) {
        if (namespace === "___default___") {
            delete binder.handlers[type];
            if (util.isDom(obj)) {
                util.unbind(obj, type, binder.realHandler);
            }
            $map.delete(obj);
        } else {
            delete events[namespace];
        }
    }
}

export var trigger = (obj, type) => {
}