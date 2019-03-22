module.exports = function(api) {
    var isTest = api && api.env('test');
    return {
        presets: ['@babel/preset-env'],
        plugins: ['babel-plugin-transform-es2015-modules-commonjs']
    };
};
