'use strict';

const _Number = require('../../src/types/Number');

describe('Number', () => {
    beforeEach(() => {
        jest.spyOn(_Number.prototype, 'isNumber');
    });

    describe('constructor', () => {
        it('should set the type to be "number"', () => {
            const _number = new _Number();

            expect(_number._type).toBe('number');
        });

        it('should set the default value to be 0', () => {
            const _number = new _Number();

            expect(_number._defaultValue).toBe(0);
        });

        it('should register the "isNumber" validation', () => {
            const _number = new _Number();

            expect(_number.isNumber).toHaveBeenCalledTimes(1);
        });
    });

    describe('isNumber', () => {
        describe('validation', () => {
            it('should continue if passed a valid number', () => {
                const _number = new _Number();

                expect(_number.validate(1234)).toBe(1234);
            });

            it('should throw if the value passed is not a valid number', () => {
                const _number = new _Number();

                expect(() => _number.validate('422')).toThrow('notANumber');
            });
        });

        describe('coersion', () => {
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
                        const _number = new _Number()
                            .coerce();

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
                        const _number = new _Number().coerce();

                        expect(() => _number.validate(value)).toThrow(expectedError);
                    });
                });
        });
    });

    describe('min', () => {
        const minNumber = 12;
        const tooSmallNumber = 11;
        const largeNumber = 13;

        describe('validation', () => {
            it('should continue if the value is the minimum', () => {
                const _number = new _Number()
                    .min(minNumber);

                expect(_number.validate(minNumber)).toBe(minNumber);
            });

            it('should continue if the value is greater than the minimum', () => {
                const _number = new _Number()
                    .min(minNumber);

                expect(_number.validate(largeNumber)).toBe(largeNumber);
            });

            it('should throw if the value is less than the minimum', () => {
                const _number = new _Number()
                    .min(minNumber);

                expect(() => _number.validate(tooSmallNumber)).toThrow('tooLow');
            });
        });

        describe('coersion', () => {
            it('should continue if the value is the minimum', () => {
                const _number = new _Number()
                    .min(minNumber)
                    .coerce()
                    .default('defaultValue');

                expect(_number.validate(minNumber)).toBe(minNumber);
            });

            it('should continue if the value is greater than the minimum', () => {
                const _number = new _Number()
                    .min(minNumber)
                    .coerce()
                    .default('defaultValue');

                expect(_number.validate(largeNumber)).toBe(largeNumber);
            });

            it('should coerce the value that is too small by replacing it with the minimum', () => {
                const _number = new _Number()
                    .min(minNumber)
                    .coerce()
                    .default('defaultValue');

                expect(_number.validate(tooSmallNumber)).toBe(minNumber);
            });
        });
    });

    describe('max', () => {
        const maxNumber = 20;
        const tooLargeNumber = 21;
        const smallNumber = 19;

        describe('validation', () => {
            it('should continue if the value is the maximum', () => {
                const _number = new _Number()
                    .max(maxNumber);

                expect(_number.validate(maxNumber)).toBe(maxNumber);
            });

            it('should continue if the value is less than the maximum', () => {
                const _number = new _Number()
                    .max(maxNumber);

                expect(_number.validate(smallNumber)).toBe(smallNumber);
            });

            it('should throw if the value is greater than the maximum', () => {
                const _number = new _Number()
                    .max(maxNumber);

                expect(() => _number.validate(tooLargeNumber)).toThrow('tooHigh');
            });
        });

        describe('coersion', () => {
            it('should continue if the value is the maximum', () => {
                const _number = new _Number()
                    .max(maxNumber)
                    .coerce()
                    .default('defaultValue');

                expect(_number.validate(maxNumber)).toBe(maxNumber);
            });

            it('should continue if the value is greater than the maximum', () => {
                const _number = new _Number()
                    .max(maxNumber)
                    .coerce()
                    .default('defaultValue');

                expect(_number.validate(smallNumber)).toBe(smallNumber);
            });

            it('should coerce the value that is too small by replacing it with the maximum', () => {
                const _number = new _Number()
                    .max(maxNumber)
                    .coerce()
                    .default('defaultValue');

                expect(_number.validate(tooLargeNumber)).toBe(maxNumber);
            });
        });
    });

    describe('greaterThan', () => {
        const minValue = 12;
        const equalTo = minValue;
        const lessThan = 11;
        const greaterThan = 13;
        const threshold = 0.01;

        describe('validation', () => {
            it('should continue if the value is greater than the number', () => {
                const _number = new _Number()
                    .greaterThan(minValue);

                expect(_number.validate(greaterThan)).toBe(greaterThan);
            });

            it('should throw if the value is equal to the number', () => {
                const _number = new _Number()
                    .greaterThan(minValue);

                expect(() => _number.validate(equalTo)).toThrow('tooLow');
            });

            it('should throw if the value is less than the number', () => {
                const _number = new _Number()
                    .greaterThan(minValue);

                expect(() => _number.validate(lessThan)).toThrow('tooLow');
            });
        });

        describe('coersion', () => {
            it('should continue if the value is greater than the number', () => {
                const _number = new _Number()
                    .greaterThan(minValue)
                    .coerce();

                expect(_number.validate(greaterThan)).toBe(greaterThan);
            });

            it('should return the default value if the value is equal to the number', () => {
                const _number = new _Number()
                    .greaterThan(minValue, threshold)
                    .coerce();

                expect(_number.validate(equalTo)).toBe(minValue + threshold);
            });

            it('should return the default value if the value is less than the number', () => {
                const _number = new _Number()
                    .greaterThan(minValue, threshold)
                    .coerce();

                expect(_number.validate(lessThan)).toBe(minValue + threshold);
            });

            describe.each([
                { value: lessThan, threshold: 10, expectedValue: minValue + 10 },
                { value: lessThan, threshold: 1, expectedValue: minValue + 1 },
                { value: lessThan, expectedValue: minValue + 0.1 },
                { value: lessThan, threshold: 0.01, expectedValue: minValue + 0.01 },
                { value: lessThan, threshold: 0.001, expectedValue: minValue + 0.001 }
            ])(
                'variable thresholding',
                ({ value, threshold, expectedValue }) => {
                    it(`should clamp the value appropriately when threshold is ${threshold || 'default'}`, () => {
                        const _number = new _Number()
                            .greaterThan(minValue, threshold)
                            .coerce();

                        expect(_number.validate(value)).toBe(expectedValue);
                    });
                });
        });
    });

    describe('lessThan', () => {
        const maxValue = 12;
        const equalTo = maxValue;
        const lessThan = 11;
        const greaterThan = 13;
        const threshold = 0.01;

        describe('validation', () => {
            it('should continue if the value is less than the number', () => {
                const _number = new _Number()
                    .lessThan(maxValue);

                expect(_number.validate(lessThan)).toBe(lessThan);
            });

            it('should throw if the value is equal to the number', () => {
                const _number = new _Number()
                    .lessThan(maxValue);

                expect(() => _number.validate(equalTo)).toThrow('tooHigh');
            });

            it('should throw if the value is greater than the number', () => {
                const _number = new _Number()
                    .lessThan(maxValue);

                expect(() => _number.validate(greaterThan)).toThrow('tooHigh');
            });
        });

        describe('coersion', () => {
            it('should continue if the value is less than the number', () => {
                const _number = new _Number()
                    .lessThan(maxValue, threshold)
                    .coerce();

                expect(_number.validate(lessThan)).toBe(lessThan);
            });

            it('should return the clamped value if the value is equal to the number', () => {
                const _number = new _Number()
                    .lessThan(maxValue, threshold)
                    .coerce();

                expect(_number.validate(equalTo)).toBe(maxValue - threshold);
            });

            describe.each([
                { value: greaterThan, threshold: 10, expectedValue: maxValue - 10 },
                { value: greaterThan, threshold: 1, expectedValue: maxValue - 1 },
                { value: greaterThan, expectedValue: maxValue - 0.1 },
                { value: greaterThan, threshold: 0.01, expectedValue: maxValue - 0.01 },
                { value: greaterThan, threshold: 0.001, expectedValue: maxValue - 0.001 }
            ])(
                'variable thresholding',
                ({ value, threshold, expectedValue }) => {
                    it(`should clamp the value appropriately when threshold is ${threshold || 'default'}`, () => {
                        const _number = new _Number()
                            .lessThan(maxValue, threshold)
                            .coerce();

                        expect(_number.validate(value)).toBe(expectedValue);
                    });
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
                it((expectedError
                    ? `should throw an error if passed a value of ${value} for a range of ${range.min} to ${range.max}`
                    : `should continue if passed a value of ${value} for a range of ${range.min} to ${range.max}`
                ), () => {
                    const _number = new _Number()
                        .range(range);

                    expectedError
                        ? expect(() => _number.validate(value)).toThrow(expectedError)
                        : expect(_number.validate(value)).toBe(value);
                });
            });

        describe.each([
            // Closed range.
            { value: 0, range: closedRange, expectedValue: 100 },
            { value: 99, range: closedRange, expectedValue: 100 },
            { value: 100, range: closedRange },
            { value: 101, range: closedRange },
            { value: 150, range: closedRange },
            { value: 199, range: closedRange },
            { value: 200, range: closedRange },
            { value: 201, range: closedRange, expectedValue: 200 },

            // Min only range.
            { value: 0, range: minOnlyRange, expectedValue: 100 },
            { value: 99, range: minOnlyRange, expectedValue: 100 },
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
            { value: 201, range: maxOnlyRange, expectedValue: 200 },
            { value: 300, range: maxOnlyRange, expectedValue: 200 }
        ])(
            'coersions', ({ value, range, expectedValue }) => {
                it((expectedValue
                    ? `should clamp the passed value of ${value} into the range of ${range.min} to ${range.max}`
                    : `should continue if passed a value of ${value} for a range of ${range.min} to ${range.max}`
                ), () => {
                    const _number = new _Number()
                        .range(range)
                        .coerce();

                    expect(_number.validate(value)).toBe(expectedValue || value);
                });
            });
    });

    describe('port', () => {
        describe.each([
            { value: 0, expectedError: 'tooLow' },
            { value: 65536, expectedError: 'tooHigh' },
            { value: 1 },
            { value: 32768 },
            { value: 65535 }
        ])(
            'validations', ({ value, expectedError }) => {
                it((expectedError
                    ? `should throw an error if passed a value of ${value}`
                    : `should continue if passed a value of ${value}`
                ), () => {
                    const _number = new _Number()
                        .port();

                    expectedError
                        ? expect(() => _number.validate(value)).toThrow(expectedError)
                        : expect(_number.validate(value)).toBe(value);
                });
            });

        describe.each([
            { value: 0, expectedValue: 1 },
            { value: 65536, expectedValue: 65535 },
            { value: 1 },
            { value: 32768 },
            { value: 65535 }
        ])(
            'coersions', ({ value, expectedValue }) => {
                it((expectedValue
                    ? `should clamp the passed value of ${value}`
                    : `should continue if passed a value of ${value}`
                ), () => {
                    const _number = new _Number()
                        .port()
                        .coerce();

                    expect(_number.validate(value)).toBe(expectedValue || value);
                });
            });
    });

    describe('positive', () => {
        describe('validation', () => {
            it('should continue if the value is positive', () => {
                const _number = new _Number()
                    .positive();

                expect(_number.validate(1)).toBe(1);
            });

            it('should throw an error if the value is negative', () => {
                const _number = new _Number()
                    .positive();

                expect(() => _number.validate(-1)).toThrow('notPositive');
            });

            it('should throw an error if the value is zero', () => {
                const _number = new _Number()
                    .positive();

                expect(() => _number.validate(0)).toThrow('notPositive');
            });
        });

        describe('cohersion', () => {
            it('should continue if the value is positive', () => {
                const _number = new _Number()
                    .positive()
                    .coerce();

                expect(_number.validate(1)).toBe(1);
            });

            it('should coerce the value to be positive if the value is negative', () => {
                const _number = new _Number()
                    .positive()
                    .coerce();

                expect(_number.validate(-1)).toBe(1);
            });

            it('should coerce the value to be positive if the value is zero', () => {
                const _number = new _Number()
                    .positive()
                    .coerce();

                expect(_number.validate(0)).toBe(1);
            });
        });
    });

    describe('negative', () => {
        describe('validation', () => {
            it('should continue if the value is negative', () => {
                const _number = new _Number()
                    .negative();

                expect(_number.validate(-1)).toBe(-1);
            });

            it('should throw an error if the value is positive', () => {
                const _number = new _Number()
                    .negative();

                expect(() => _number.validate(1)).toThrow('notNegative');
            });

            it('should throw an error if the value is zero', () => {
                const _number = new _Number()
                    .negative();

                expect(() => _number.validate(0)).toThrow('notNegative');
            });
        });

        describe('cohersion', () => {
            it('should continue if the value is negative', () => {
                const _number = new _Number()
                    .negative()
                    .coerce();

                expect(_number.validate(-1)).toBe(-1);
            });

            it('should coerce the value to be negative if the value is positive', () => {
                const _number = new _Number()
                    .negative()
                    .coerce();

                expect(_number.validate(1)).toBe(-1);
            });

            it('should coerce the value to be negative if the value is zero', () => {
                const _number = new _Number()
                    .negative()
                    .coerce();

                expect(_number.validate(0)).toBe(-1);
            });
        });
    });

    describe('nonZero', () => {
        describe('validation', () => {
            it('should continue if the value is non-zero', () => {
                const _number = new _Number()
                    .nonZero();

                expect(_number.validate(1)).toBe(1);
            });

            it('should throw an error if the value is zero', () => {
                const _number = new _Number()
                    .nonZero();

                expect(() => _number.validate(0)).toThrow('nonZero');
            });
        });

        describe('coersion', () => {
            it('should continue if the value is non-zero', () => {
                const _number = new _Number()
                    .nonZero()
                    .coerce()
                    .default('defaultValue');

                expect(_number.validate(1)).toBe(1);
            });

            it('should coerce a zero value by making it the default value', () => {
                const _number = new _Number()
                    .nonZero()
                    .coerce()
                    .default('defaultValue');

                expect(_number.validate(0)).toBe('defaultValue');
            });
        });
    });

    describe('even', () => {
        describe('validation', () => {
            it('should continue if the value is even', () => {
                const _number = new _Number()
                    .even();

                expect(_number.validate(2)).toBe(2);
            });

            it('should throw an error if the value is odd', () => {
                const _number = new _Number()
                    .even();

                expect(() => _number.validate(1)).toThrow('notEven');
            });
        });

        describe('coersion', () => {
            beforeEach(() => {
            });

            it('should continue if the value is even', () => {
                const _number = new _Number()
                    .even()
                    .coerce();

                expect(_number.validate(4)).toBe(4);
            });

            it('should coerce an odd value to become even by moving it towards zero', () => {
                const _number = new _Number()
                    .even()
                    .coerce();

                expect(_number.validate(5)).toBe(4);
                expect(_number.validate(-5)).toBe(-4);
            });
        });
    });

    describe('odd', () => {
        describe('validation', () => {
            it('should continue if the value is odd', () => {
                const _number = new _Number()
                    .odd();

                expect(_number.validate(3)).toBe(3);
            });

            it('should throw an error if the value is even', () => {
                const _number = new _Number()
                    .odd();

                expect(() => _number.validate(6)).toThrow('notOdd');
            });
        });

        describe('coersion', () => {
            it('should continue if the value is odd', () => {
                const _number = new _Number()
                    .odd()
                    .coerce();

                expect(_number.validate(7)).toBe(7);
            });

            it('should coerce an even value to become odd by moving it away from zero', () => {
                const _number = new _Number()
                    .odd()
                    .coerce();

                expect(_number.validate(4)).toBe(5);
                expect(_number.validate(-4)).toBe(-5);
            });

            it('should coerce zero to become odd by added 1 to it', () => {
                const _number = new _Number()
                    .odd()
                    .coerce();

                expect(_number.validate(0)).toBe(1);
            });
        });
    });
});
