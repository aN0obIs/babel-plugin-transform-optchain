import pluginTester from 'babel-plugin-tester';
import babelPluginTransformOptchain from '../src';
import { join } from 'path';

pluginTester({
    plugin: babelPluginTransformOptchain,
    fixtures: join(__dirname, '__fixtures__'),
    tests: [{
        code: 'const safeState = oc(state).foo.bar;',
        error: true
    }, {
        code: 'return oc(state);',
        error: true
    }]
});
