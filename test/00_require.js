var assert = require('assert');

global.test('require', function () {
    assert.ok(require('./../index'), 'require success');
});
