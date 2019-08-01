'use strict';

const _String = require('../../src/types/String');

describe('String', () => {
    let _string;

    beforeEach(() => {
        jest.spyOn(_String.prototype, 'isString');

        _string = new _String();
    });

    describe('constructor', () => {
        it('should set the type to be "string"', () => {
            expect(_string._type).toEqual('string');
        });

        it('should set the default value to be the empty string', () => {
            expect(_string._defaultValue).toEqual('');
        });

        it('should default to strict mode', () => {
            expect(_string.isString).toHaveBeenCalledTimes(1);
        });

        it('should register the "isString" validation', () => {
            expect(_string.isString).toHaveBeenCalledTimes(1);
        });
    });

    describe('isString', () => {
        describe('validation', () => {
            it('should continue if passed a valid string', () => {
                _string.validate('a valid string');
            });

            it('should throw if the value passed is not a valid string', () => {
                expect(() => _string.validate(12)).toThrow('notAString');
            });
        });

        describe('coersion', () => {
            beforeEach(() => {
                _string = new _String().coerce();
            });

            it('should convert a boolean to a string', () => {
                expect(_string.validate(true)).toEqual('true');
            });

            it('should convert a number to a string', () => {
                expect(_string.validate(1234)).toEqual('1234');
            });

            it('should convert an object to a string', () => {
                expect(_string.validate({ name: 'Bill' })).toEqual('{"name":"Bill"}');
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
