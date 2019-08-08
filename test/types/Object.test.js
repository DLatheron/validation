'use strict';

const _Object = require('../../src/types/Object');

describe.only('Object', () => {
    let _object;

    beforeEach(() => {
        _object = new _Object();
    });

    describe('constructor', () => {
        it('should set the type to "object"', () => {
            expect(_object._type).toBe('object');
        });
    });
});
