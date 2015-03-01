'use strict';

var MainStore = require('../../../js/stores/MainStore');
var assert = require('power-assert');
mocha.setup('bdd');

describe('main', function () {
    it('Count Up', function () {
        assert(MainStore.getText() === 'Hello World!!');
    });
});
