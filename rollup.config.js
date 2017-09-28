import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import multiEntry from 'rollup-plugin-multi-entry';

var ops = {
    entry: {
        'bind-event-element': 'src/element.js',
        'bind-event-object': 'src/object.js'
    },
    dest: 'dist',
    sourceMap: true,
    format: "umd",
    moduleName: "E",
    plugins: [
        json(),
        babel({
            exclude: 'node_modules/**'
        }),
        multiEntry()
    ]
};
if (process.env.NODE_ENV === 'production') {
    ops.plugins.push(uglify());
}

export default ops;