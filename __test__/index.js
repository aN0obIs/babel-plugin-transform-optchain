import pluginTester from 'babel-plugin-tester';
import babelPluginTransformOptchain from '../src/index';
import { join } from 'path';

pluginTester({
    plugin: babelPluginTransformOptchain,
    snapshot: true,
    fixtures: join(__dirname, '__fixtures__')
});
