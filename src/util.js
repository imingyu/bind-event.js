export var isDom = obj => {
    return typeof obj === 'object' && (obj instanceof window.Node || isWindow(obj));
}
export var isWindow = obj => {
    return typeof obj === 'object' && obj.window === obj;
}

export var bind = (el, type, handler, useCapture) => {
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

export var unbind = (el, type, handler) => {
    if (el.removeEventListener) {
        el.removeEventListener(type, handler);
    } else if (el.attachEvent) {
        el.detachEvent('on' + type, handler);
    } else {
        el['on' + type] = null;
    }
}

export var fire = (el, type, w) => {
}

export var query = selector => {
    return document.querySelectorAll(selector);
}