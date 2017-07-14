import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
export default {
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