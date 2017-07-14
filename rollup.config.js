import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
var ops = {
    entry: 'src/index.js',
    dest: 'dist/index.js',
    sourceMap: true,
    format: "umd",
    moduleName: "E",
    plugins: [
        json(),
        babel({
            exclude: 'node_modules/**'
        })
    ]
};
if (process.env.NODE_ENV === 'production') {
    ops.plugins.push(uglify());
}

export default ops;