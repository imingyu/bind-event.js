export default Map ? Map : class ShimMap {
    constructor() {
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
        }
        this.get = function (key) {
            if (typeof key === 'string') {
                return store[key];
            } else if (typeof key === 'number' && isNaN(key)) {
                return naNItemValue;
            } else {
                var keyIndex = keys.indexOf(key);
                return keyIndex === -1 ? undefined : values[map[keyIndex]];
            }
        }
        this.has = function (key) {
            if (typeof key === 'string') {
                return store.hasOwnProperty(key);
            } else if (typeof key === 'number' && isNaN(key)) {
                return hasNaNKey;
            } else {
                var keyIndex = keys.indexOf(key);
                return map.hasOwnProperty(keyIndex);
            }
        }
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
        }
        /*
        this.clear = function () {
            store = {};
            keys.length = 0;
            values.length = 0;
            map = {};
            hasNaNKey = false;
            naNItemValue = undefined;
        }
        this.forEach = function (cb, context) {
            if (typeof cb != 'function') return;
            var self = this;
            for (var key in store) {
                cb.call(context, store[key], key, self);
            }
            for (var keyIndex in map) {
                cb.call(context, values[map[keyIndex]], keys[keyIndex], self);
            }
        }*/
    }
};