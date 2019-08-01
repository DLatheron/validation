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
            expect(_string._type).toBe('string');
        });

        it('should set the default value to be the empty string', () => {
            expect(_string._defaultValue).toBe('');
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

            it('should throw if the value passed is not a string', () => {
                expect(() => _string.validate(12)).toThrow('notAString');
            });
        });

        describe('coersion', () => {
            beforeEach(() => {
                _string = new _String().coerce();
            });

            describe.each([
                // Numbers.
                { value: 0, expectedValue: '0' },
                { value: 1, expectedValue: '1' },
                { value: -1, expectedValue: '-1' },
                { value: 25, expectedValue: '25' },

                // Booleans.
                { value: true, expectedValue: 'true' },
                { value: false, expectedValue: 'false' },

                // Objects.
                { value: { name: 'Bill' }, expectedValue: '{"name":"Bill"}' }

            ])(
                'successful coersions', ({ value, expectedValue }) => {
                    it(`should coerce ${typeof value} === "${value}" to a string === ${expectedValue}`, () => {
                        expect(_string.validate(value)).toBe(expectedValue);
                    });
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
