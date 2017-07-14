(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.E = factory());
}(this, (function () { 'use strict';

var version = "0.1.0";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var ShimMap = function ShimMap() {
    classCallCheck(this, ShimMap);

    var store = {},
        keys = [],
        values = [],
        map = {},
        hasNaNKey = false,
        naNItemValue;

    this.set = function (key, value) {
        if (typeof key === 'string') {
            store[key] = value;
        } else if (typeof key === 'number' && isNaN(key)) {
            naNItemValue = value;
            hasNaNKey = true;
        } else {
            var keyIndex = keys.indexOf(key);
            if (keyIndex === -1) {
                keyIndex = keys.length;
                keys.push(key);
                map[keyIndex] = values.length;
                values.push(value);
            } else {
                values[map[keyIndex]] = value;
            }
        }
        return this;
    };
    this.get = function (key) {
        if (typeof key === 'string') {
            return store[key];
        } else if (typeof key === 'number' && isNaN(key)) {
            return naNItemValue;
        } else {
            var keyIndex = keys.indexOf(key);
            return keyIndex === -1 ? undefined : values[map[keyIndex]];
        }
    };
    this.has = function (key) {
        if (typeof key === 'string') {
            return store.hasOwnProperty(key);
        } else if (typeof key === 'number' && isNaN(key)) {
            return hasNaNKey;
        } else {
            var keyIndex = keys.indexOf(key);
            return map.hasOwnProperty(keyIndex);
        }
    };
    this.delete = function (key) {
        if (!this.has(key)) return;
        var val;
        if (typeof key === 'string') {
            val = store[key];
            delete store[key];
        } else if (typeof key === 'number' && isNaN(key)) {
            hasNaNKey = false;
            val = naNItemValue;
            naNItemValue = undefined;
        } else {
            var keyIndex = keys.indexOf(key),
                valIndex = map[keyIndex];
            delete map[keyIndex];
            keys.splice(keyIndex, 1);
            val = values.splice(valIndex, 1);
        }
        return val;
    };
    this.clear = function () {
        store = {};
        keys.length = 0;
        values.length = 0;
        map = {};
        hasNaNKey = false;
        naNItemValue = undefined;
    };
    this.forEach = function (cb, context) {
        if (typeof cb != 'function') return;
        var self = this;
        for (var key in store) {
            cb.call(context, store[key], key, self);
        }
        for (var keyIndex in map) {
            cb.call(context, values[map[keyIndex]], keys[keyIndex], self);
        }
    };
};

var isDom = function isDom(obj) {
    return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && (obj instanceof window.Node || isWindow(obj));
};
var isWindow = function isWindow(obj) {
    return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj.window === obj;
};

var bind = function bind(el, type, handler, useCapture) {
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
};

var unbind = function unbind(el, type, handler) {
    if (el.removeEventListener) {
        el.removeEventListener(type, handler);
    } else if (el.attachEvent) {
        el.detachEvent('on' + type, handler);
    } else {
        el['on' + type] = null;
    }
};



var query = function query(selector) {
    return document.querySelectorAll(selector);
};

var $map = new ShimMap();

var init = function init(obj) {
    $map.set(obj, {
        target: obj,
        ts: new Date().getTime(),
        handlers: {},
        realHandler: function realHandler(event) {
            return exec(this, obj, event.type, Array.from(arguments));
        }
    });
};

var exec = function exec(runtimeTarget, bindingTarget, type, eventArgs) {
    var binder = $map.get(bindingTarget),
        prop,
        handlerItem,
        result,
        ns;
    for (prop in binder.handlers) {
        if (prop === type) {
            var events = binder.handlers[type];
            if (events) {
                for (ns in binder.handlers[type]) {
                    handlerItem = events[ns];
                    if (Array.isArray(handlerItem)) {
                        handlerItem.forEach(function (item) {
                            var res = item.apply(runtimeTarget, eventArgs);
                            if (typeof res === 'boolean') {
                                result = typeof result === 'boolean' ? result && res : res;
                            }
                        });
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
    return result;
};

var on = function on(obj, type, handler) {
    var binder = $map.get(obj);
    if (!$map.has(obj)) {
        init(obj);
        binder = $map.get(obj);
        if (isDom(obj)) {
            bind(obj, type, binder.realHandler);
        }
    }

    var namespace = "___default___",
        index = type.indexOf('.');
    if (index != -1) {
        namespace = type.substr(index + 1, type.length);
        type = type.substr(0, index);
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
};

var off = function off(obj, type) {
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
            if (isDom(obj)) {
                unbind(obj, type, binder.realHandler);
            }
            $map.delete(obj);
        } else {
            delete binder.handlers[type][namespace];
        }
    }
};

var trigger = function trigger(obj, type) {};

var Binder = function () {
    function Binder(obj) {
        classCallCheck(this, Binder);

        this.length = 0;
        if (typeof obj === 'string') {
            var els = query(obj);
            if (els.length > 0) {
                var self = this;
                Array.prototype.forEach.call(els, function (el) {
                    self[self.length] = el;
                    self.length++;
                });
            }
        } else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
            this[0] = obj;
        } else {
            console.error('不支持对非object类型的数据进行事件绑定');
        }
    }

    createClass(Binder, [{
        key: 'on',
        value: function on$$1() {
            var args = Array.from(arguments),
                i,
                len = this.length;
            for (i = 0; i < len; i++) {
                on.apply(null, [this[i]].concat(args));
            }
        }
    }, {
        key: 'off',
        value: function off$$1() {
            var args = Array.from(arguments),
                i,
                len = this.length;
            for (i = 0; i < len; i++) {
                off.apply(null, [this[i]].concat(args));
            }
        }
    }, {
        key: 'trigger',
        value: function trigger$$1() {}
    }]);
    return Binder;
}();

function E(obj) {
    return new Binder(obj);
}
E.version = version;
E.on = on;
E.off = off;
E.trigger = trigger;

return E;

})));
//# sourceMappingURL=index.js.map
