'use strict';

const _Number = require('../../src/types/Number');

describe('Number', () => {
    beforeEach(() => {
        jest.spyOn(_Number.prototype, 'isNumber');
        jest.spyOn(_Number.prototype, 'toNumber');
    });

    describe('constructor', () => {
        it('should set the type to be "number"', () => {
            const _number = new _Number();
            expect(_number._type).toEqual('number');
        });

        it('should set the default value to be 0', () => {
            const _number = new _Number();
            expect(_number._defaultValue).toEqual(0);
        });

        it('should default to strict mode', () => {
            const _number = new _Number();
            expect(_number.isNumber).toHaveBeenCalledTimes(1);
            expect(_number.toNumber).toHaveBeenCalledTimes(0);
        });

        it('should register the "isNumber" validation in strict mode', () => {
            const _number = new _Number(true);
            expect(_number.isNumber).toHaveBeenCalledTimes(1);
            expect(_number.toNumber).toHaveBeenCalledTimes(0);
        });

        it('should register the "toNumber" validation in coerce mode', () => {
            const _number = new _Number(false);
            expect(_number.isNumber).toHaveBeenCalledTimes(0);
            expect(_number.toNumber).toHaveBeenCalledTimes(1);
        });
    });

    describe('isNumber', () => {
        describe('validation', () => {
            it('should continue if passed a valid number', () => {
                const _number = new _Number();
                _number.validate(1234);
            });

            it('should throw if the value passed is not a valid number', () => {
                const _number = new _Number();
                expect(() => _number.validate('422')).toThrow('notANumber');
            });
        });
    });
});
