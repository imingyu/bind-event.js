export var on = (el, type, handler) => {
    if (!isDom(el)) return;
    el.$$handlers = el.$$handlers || {};
    var handlers = el.$$handlers,
        namespace = "default",
        index = type.indexOf('.');
    if (index != -1) {
        namespace = type.substr(index + 1, type.length);
        type = type.substr(0, index);
    }
    if (!handlers[type]) {
        handlers[type] = handlers[type] || {};
        var realHandler = function (e) {
            var dom = this,
                handlers = Object.values(this.$$handlers[e.type] || {}),
                result;
            if (handlers && handlers.length > 0) {
                handlers.forEach(item => {
                    if (item.call(dom, e) === false) {
                        result = false;
                    }
                });
            }
            return result;
        };
        handlers[type + '-real'] = realHandler;
        el.addEventListener(type, realHandler, false);
    }
    handlers[type][namespace] = handler;
}
export var off = (el, type) => {
    if (!isDom(el)) return;
    el.$$handlers = el.$$handlers || {};
    var handlers = el.$$handlers,
        namespace = "default",
        index = type.indexOf('.');
    if (index != -1) {
        namespace = type.substr(index + 1, type.length);
        type = type.substr(0, index);
        if (handlers[type]) delete handlers[type][namespace];
    } else {
        el.removeEventListener(type, handlers[type + '-real']);
    }
}

export var trigger = (el, type) => {
    if (!isDom(el)) return;
}