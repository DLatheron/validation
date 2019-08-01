'use strict';

const _Boolean = require('../../src/types/Boolean');

describe('Boolean', () => {
    let _boolean;

    beforeEach(() => {
        jest.spyOn(_Boolean.prototype, 'isBoolean');

        _boolean = new _Boolean();
    });

    describe('constructor', () => {
        it('should set the type to be "boolean"', () => {
            expect(_boolean._type).toBe('boolean');
        });

        it('should set the default value to be false', () => {
            expect(_boolean._defaultValue).toBe(false);
        });

        it('should register the "isBoolean" validation', () => {
            expect(_boolean.isBoolean).toHaveBeenCalledTimes(1);
        });
    });

    describe('isBoolean', () => {
        describe('validation', () => {
            it('should continue if passed a valid boolean', () => {
                expect(_boolean.validate(true)).toBe(true);
            });

            it('should throw if the value passed is not a boolean', () => {
                expect(() => _boolean.validate(1)).toThrow('notABoolean');
            });
        });

        describe('coersion', () => {
            beforeEach(() => {
                _boolean = new _Boolean().coerce();
            });

            it('should continue if passed a valid boolean', () => {
                expect(_boolean.validate(false)).toBe(false);
            });

            describe.each([
                // Numbers.
                { value: 0, expectedValue: false },
                { value: 1, expectedValue: true },
                { value: -1, expectedValue: true },
                { value: 25, expectedValue: true },

                // Strings.
                { value: 'true', expectedValue: true },
                { value: 'TRUE', expectedValue: true },
                { value: 'TrUe', expectedValue: true },
                { value: 'yes', expectedValue: true },
                { value: 'YES', expectedValue: true },
                { value: 'YeS', expectedValue: true },
                { value: '1', expectedValue: true },
                { value: 'false', expectedValue: false },
                { value: 'FALSE', expectedValue: false },
                { value: 'FaLsE', expectedValue: false },
                { value: 'no', expectedValue: false },
                { value: 'NO', expectedValue: false },
                { value: 'No', expectedValue: false },
                { value: '0', expectedValue: false }
            ])(
                'successful coersions', ({ value, expectedValue }) => {
                    it(`should coerce ${typeof value} === "${value}" to a boolean === ${expectedValue}`, () => {
                        expect(_boolean.validate(value)).toBe(expectedValue);
                    });
                });

            describe.each([
                // Strings.
                { value: 'notABoolean', expectedError: 'cannotConvertStringToBoolean' },

                // Objects.
                { value: {}, expectedError: 'unsupportedTypeForConversion' }
            ])(
                'failed coersions', ({ value, expectedError }) => {
                    it(`should not coerce ${typeof value} === "${value}"`, () => {
                        expect(() => _boolean.validate(value)).toThrow(expectedError);
                    });
                }
            );
        });
    });

    describe('is', () => {
        describe.each([
            { value: true },
            { value: false }
        ])(
            'successful matches', ({ value }) => {
                beforeEach(() => {
                    _boolean = new _Boolean().is(value);
                });

                it(`should continue if value is ${value}`, () => {
                    expect(_boolean.validate(value)).toBe(value);
                });
            }
        );

        describe.each([
            { value: true, is: false },
            { value: false, is: true }
        ])(
            'failed matches', ({ value, is }) => {
                beforeEach(() => {
                    _boolean = new _Boolean().is(is);
                });

                it(`should throw if value is not ${value}`, () => {
                    expect(() => _boolean.validate(value)).toThrow('notExpectedValue');
                });
            }
        );
    });
});
