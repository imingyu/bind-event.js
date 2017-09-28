var rollup = require('rollup'),
    json = require('rollup-plugin-json'),
    babel = require('rollup-plugin-babel'),
    uglify = require('rollup-plugin-uglify'),
    entrys = {
        'bind-event-dom': 'src/element.js',
        'bind-event-object': 'src/object.js'
    };

function createOptions(entryKey, entryValue, isProduction) {
    var ops = {
        entry: entryValue,
        dest: "dest/" + entryKey + ".js",
        sourceMap: true,
        format: "umd",
        moduleName: "E",
        plugins: [

        ]
    };

    return ops;
}


for (let prop in entrys) {
    var ops = {
        entry: entrys[prop],
        plugins: [
            json(),
            babel()
        ]
    };
    if (process.env.NODE_ENV == "production") {
        ops.plugins.push(uglify());
    }
    const bundle = await rollup.rollup(ops);

    await bundle.write({
        format: 'umd',
        moduleName: 'E',
        dest: `./dist/${prop}.js`,
        sourceMap: true
    });
}