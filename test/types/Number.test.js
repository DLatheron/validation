'use strict';

const _Number = require('../../src/types/Number');

describe('Number', () => {
    let _number;

    beforeEach(() => {
        jest.spyOn(_Number.prototype, 'isNumber');

        _number = new _Number();
    });

    describe('constructor', () => {
        it('should set the type to be "number"', () => {
            expect(_number._type).toEqual('number');
        });

        it('should set the default value to be 0', () => {
            expect(_number._defaultValue).toEqual(0);
        });

        it('should register the "isNumber" validation', () => {
            expect(_number.isNumber).toHaveBeenCalledTimes(1);
        });
    });

    describe('isNumber', () => {
        it('should continue if passed a valid number', () => {
            _number.validate(1234);
        });

        it('should throw if the value passed is not a valid number', () => {
            expect(() => _number.validate('422')).toThrow('notANumber');
        });
    });
});
