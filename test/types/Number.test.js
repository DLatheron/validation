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
        describe('validation', () => {
            it('should continue if passed a valid number', () => {
                _number.validate(1234);
            });

            it('should throw if the value passed is not a valid number', () => {
                expect(() => _number.validate('422')).toThrow('notANumber');
            });
        });

        describe('coersion', () => {
            beforeEach(() => {
                _number = _number.coerce();
            });

            describe.each([
                // Numbers.
                { value: 1234, expectedValue: 1234 },

                // Strings.
                { value: '0', expectedValue: 0 },
                { value: '1', expectedValue: 1 },
                { value: '-1', expectedValue: -1 },
                { value: '25', expectedValue: 25 },

                // Booleans.
                { value: true, expectedValue: 1 },
                { value: false, expectedValue: 0 }
            ])(
                'successful coersions', ({ value, expectedValue }) => {
                    it(`should coerce ${typeof value} === "${value}" to a number === ${expectedValue}`, () => {
                        expect(_number.validate(value)).toBe(expectedValue);
                    });
                });

            describe.each([
                // Strings.
                { value: '', expectedError: 'notANumber' },
                { value: 'inf', expectedError: 'notANumber' },
                { value: '-inf', expectedError: 'notANumber' },
                { value: 'NaN', expectedError: 'notANumber' },
                { value: 'not a number', expectedError: 'notANumber' },

                // Objects.
                { value: { number: 12 }, expectedError: 'cannotConvertToNumber' }
            ])(
                'failed coersions', ({ value, expectedError }) => {
                    it(`should throw an error of ${expectedError} when trying to coerce ${typeof value} === "${value}" to a number`, () => {
                        expect(() => _number.validate(value)).toThrow(expectedError);
                    });
                });
        });
    });

    describe('min', () => {
        const minNumber = 12;
        const tooSmallNumber = 11;
        const largeNumber = 13;

        beforeEach(() => {
            _number = _number.min(minNumber);
        });

        describe('validation', () => {
            it('should continue if the value is the minimum', () => {
                expect(_number.validate(minNumber)).toBe(minNumber);
            });

            it('should continue if the value is greater than the minimum', () => {
                expect(_number.validate(largeNumber)).toBe(largeNumber);
            });

            it('should throw if the value is less than the minimum', () => {
                expect(() => _number.validate(tooSmallNumber)).toThrow('tooLow');
            });
        });

        describe('coersion', () => {
            beforeEach(() => {
                _number = _number.coerce().default('defaultValue');
            });

            it('should continue if the value is the minimum', () => {
                expect(_number.validate(minNumber)).toBe(minNumber);
            });

            it('should continue if the value is greater than the minimum', () => {
                expect(_number.validate(largeNumber)).toBe(largeNumber);
            });

            it('should coerce the value that is too small by replacing it with the minimum', () => {
                expect(_number.validate(tooSmallNumber)).toBe(minNumber);
            });
        });
    });

    describe('max', () => {
        const maxNumber = 20;
        const tooLargeNumber = 21;
        const smallNumber = 19;

        beforeEach(() => {
            _number = _number.max(maxNumber);
        });

        describe('validation', () => {
            it('should continue if the value is the maximum', () => {
                expect(_number.validate(maxNumber)).toBe(maxNumber);
            });

            it('should continue if the value is less than the maximum', () => {
                expect(_number.validate(smallNumber)).toBe(smallNumber);
            });

            it('should throw if the value is greater than the maximum', () => {
                expect(() => _number.validate(tooLargeNumber)).toThrow('tooHigh');
            });
        });

        describe('coersion', () => {
            beforeEach(() => {
                _number = _number.coerce().default('defaultValue');
            });

            it('should continue if the value is the maximum', () => {
                expect(_number.validate(maxNumber)).toBe(maxNumber);
            });

            it('should continue if the value is greater than the maximum', () => {
                expect(_number.validate(smallNumber)).toBe(smallNumber);
            });

            it('should coerce the value that is too small by replacing it with the maximum', () => {
                expect(_number.validate(tooLargeNumber)).toBe(maxNumber);
            });
        });
    });

    describe('range', () => {
        const min = 100;
        const max = 200;

        const closedRange = { min, max };
        const minOnlyRange = { min };
        const maxOnlyRange = { max };

        describe.each([
            // Closed range.
            { value: 0, range: closedRange, expectedError: 'tooLow' },
            { value: 99, range: closedRange, expectedError: 'tooLow' },
            { value: 100, range: closedRange },
            { value: 101, range: closedRange },
            { value: 150, range: closedRange },
            { value: 199, range: closedRange },
            { value: 200, range: closedRange },
            { value: 201, range: closedRange, expectedError: 'tooHigh' },

            // Min only range.
            { value: 0, range: minOnlyRange, expectedError: 'tooLow' },
            { value: 99, range: minOnlyRange, expectedError: 'tooLow' },
            { value: 100, range: minOnlyRange },
            { value: 101, range: minOnlyRange },
            { value: 150, range: minOnlyRange },
            { value: 199, range: minOnlyRange },
            { value: 200, range: minOnlyRange },
            { value: 201, range: minOnlyRange },
            { value: 300, range: minOnlyRange },

            // Max only range.
            { value: 0, range: maxOnlyRange },
            { value: 99, range: maxOnlyRange },
            { value: 100, range: maxOnlyRange },
            { value: 101, range: maxOnlyRange },
            { value: 150, range: maxOnlyRange },
            { value: 199, range: maxOnlyRange },
            { value: 200, range: maxOnlyRange },
            { value: 201, range: maxOnlyRange, expectedError: 'tooHigh' },
            { value: 300, range: maxOnlyRange, expectedError: 'tooHigh' }
        ])(
            'validations', ({ value, range, expectedError }) => {
                beforeEach(() => {
                    _number = _number.range(range);
                });

                it((expectedError
                    ? `should throw an error if passed a value of ${value} for a range of ${range.min} to ${range.max}`
                    : `should continue if passed a value of ${value} for a range of ${range.min} to ${range.max}`
                ), () => {
                    expectedError
                        ? expect(() => _number.validate(value)).toThrow(expectedError)
                        : expect(_number.validate(value)).toBe(value);
                });
            });
    });
});
