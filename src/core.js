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

var mergeBinder = (binder) => {
    binder.ts = binder.ts || new Date().getTime();
    binder.handlers = binder.handlers || {};
    binder.realHandler = function (event) {
        var runtimeTarget = this,
            type = event.type,
            eventArgs = Array.from(arguments),
            typeHandlers = binder.handlers[type],
            handlerItem, result, ns;


        for (ns in typeHandlers) {
            handlerItem = typeHandlers[ns];
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
        return result;
    }
}

export default function (store) {
    return {
        on(obj, eventName, handler) {
            var typeInfo = decomposeEventName(eventName),
                namespace = typeInfo.namespace,
                type = typeInfo.type;

            var memory = store.get(obj);
            if (!memory) {
                store.map(obj, mergeBinder);
            }
            if (!memory.handlers[type]) {
                store.bind(obj, type, namespace);
            }

            memory.handlers[type] = memory.handlers[type] || {};
            memory.handlers[type][namespace] = memory.handlers[type][namespace] || [];
            memory.handlers[type][namespace].push(handler);
        },

        off(obj, eventName) {
            var typeInfo = decomposeEventName(eventName),
                namespace = typeInfo.namespace,
                type = typeInfo.type,
                memory = store.get(obj, type, namespace);

            if (memory && memory.handlers[type]) {
                var events = memory.handlers[type];
                if (namespace === "___default___") {
                    delete memory.handlers[type];
                    store.unbind(obj, type, namespace);
                    store.remove(obj);
                } else {
                    delete events[namespace];
                }
            }
        },
        trigger(obj, type) {
        }
    };
}

