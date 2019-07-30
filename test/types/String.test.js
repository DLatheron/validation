'use strict';

const _String = require('../../src/types/String');

describe('String', () => {
    beforeEach(() => {
        jest.spyOn(_String.prototype, 'isString');
        jest.spyOn(_String.prototype, 'toString');
    });

    describe('constructor', () => {
        it('should set the type to be "string"', () => {
            const _string = new _String();
            expect(_string._type).toEqual('string');
        });

        it('should set the default value to be the empty string', () => {
            const _string = new _String();
            expect(_string._defaultValue).toEqual('');
        });

        it('should default to strict mode', () => {
            const _string = new _String();
            expect(_string.isString).toHaveBeenCalledTimes(1);
            expect(_string.toString).toHaveBeenCalledTimes(0);
        });

        it('should register the "isString" validation in strict mode', () => {
            const _string = new _String(true);
            expect(_string.isString).toHaveBeenCalledTimes(1);
            expect(_string.toString).toHaveBeenCalledTimes(0);
        });

        it('should register the "toString" validation in coerce mode', () => {
            const _string = new _String(false);
            expect(_string.isString).toHaveBeenCalledTimes(0);
            expect(_string.toString).toHaveBeenCalledTimes(1);
        });
    });

    describe('isString', () => {
        describe('validation', () => {
            it('should continue if passed a valid string', () => {
                const _string = new _String();
                _string.validate('a valid string');
            });

            it('should throw if the value passed is not a valid string', () => {
                const _string = new _String();
                expect(() => _string.validate(12)).toThrow('notAString');
            });
        });

        describe.skip('coersion', () => {
            it('should convert a boolean to a string', () => {
                expect(_string.coerce(true)).toEqual('true');
            });

            it('should convert a number to a string', () => {
                expect(_string.coerce(1234)).toEqual('1234');
            });

            it('should convert an object to a stirng', () => {
                expect(_string.coerce({ name: 'Bill' })).toEqual('{"name":"Bill"}');
            });
        });
    });

    describe('notEmpty', () => {
        let _string;

        beforeEach(() => {
            _string = new _String();
            _string.notEmpty();
        });

        describe('validate', () => {
            it('should continue if passed a non-empty string', () => {
                _string.validate('not empty');
            });

            it('should throw if the valie passed is an empty string', () => {
                expect(() => _string.validate('')).toThrow('cannotBeEmpty');
            });
        });
    });
});
