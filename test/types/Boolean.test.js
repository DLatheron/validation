'use strict';

const _Boolean = require('../../src/types/Boolean');

describe('Boolean', () => {
    beforeEach(() => {
        jest.spyOn(_Boolean.prototype, 'isBoolean');
    });

    describe('constructor', () => {
        it('should set the type to be "boolean"', () => {
            const _boolean = new _Boolean();

            expect(_boolean._type).toBe('boolean');
        });

        it('should set the default value to be false', () => {
            const _boolean = new _Boolean();

            expect(_boolean._defaultValue).toBe(false);
        });

        it('should register the "isBoolean" validation', () => {
            const _boolean = new _Boolean();

            expect(_boolean.isBoolean).toHaveBeenCalledTimes(1);
        });
    });

    describe('isBoolean', () => {
        describe('validation', () => {
            it('should continue if passed a valid boolean', () => {
                const _boolean = new _Boolean();

                expect(_boolean.validate(true)).toBe(true);
            });

            it('should throw if the value passed is not a boolean', () => {
                const _boolean = new _Boolean();

                expect(() => _boolean.validate(1)).toThrow('notABoolean');
            });
        });

        describe('coersion', () => {
            it('should continue if passed a valid boolean', () => {
                const _boolean = new _Boolean()
                    .coerce();

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
                        const _boolean = new _Boolean()
                            .coerce();

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
                        const _boolean = new _Boolean()
                            .coerce();

                        expect(() => _boolean.validate(value)).toThrow(expectedError);
                    });
                }
            );
        });
    });

    describe('is', () => {
        describe('validation', () => {
            describe.each([
                { value: true },
                { value: false }
            ])(
                'successful matches', ({ value }) => {
                    it(`should continue if value is ${value}`, () => {
                        const _boolean = new _Boolean()
                            .is(value);

                        expect(_boolean.validate(value)).toBe(value);
                    });
                }
            );

            describe.each([
                { value: true, is: false },
                { value: false, is: true }
            ])(
                'failed matches', ({ value, is }) => {
                    it(`should throw if value is not ${value}`, () => {
                        const _boolean = new _Boolean()
                            .is(is);

                        expect(() => _boolean.validate(value)).toThrow('notExpectedValue');
                    });
                }
            );
        });

        describe('coersion', () => {
            // TODO:
        });
    });

    describe('true', () => {
        describe('validation', () => {
            it(`should continue if value is true`, () => {
                const _boolean = new _Boolean()
                    .true();

                expect(_boolean.validate(true)).toBe(true);
            });

            it(`should throw if value is not true`, () => {
                const _boolean = new _Boolean()
                    .true();

                expect(() => _boolean.validate(false)).toThrow('notExpectedValue');
            });
        });

        describe('coersion', () => {
            it(`should continue if value is true`, () => {
                const _boolean = new _Boolean()
                    .true()
                    .coerce();

                expect(_boolean.validate(true)).toBe(true);
            });

            it(`should return true if the value is false`, () => {
                const _boolean = new _Boolean()
                    .true()
                    .coerce();

                expect(_boolean.validate(false)).toBe(true);
            });
        });
    });

    describe('false', () => {
        describe('validation', () => {
            it(`should continue if value is true`, () => {
                const _boolean = new _Boolean()
                    .false();

                expect(_boolean.validate(false)).toBe(false);
            });

            it(`should throw if value is not true`, () => {
                const _boolean = new _Boolean()
                    .false();

                expect(() => _boolean.validate(true)).toThrow('notExpectedValue');
            });
        });

        describe('coersion', () => {
            it(`should continue if value is false`, () => {
                const _boolean = new _Boolean()
                    .false()
                    .coerce();

                expect(_boolean.validate(false)).toBe(false);
            });

            it(`should return true if the value is false`, () => {
                const _boolean = new _Boolean()
                    .false()
                    .coerce();

                expect(_boolean.validate(true)).toBe(false);
            });
        });
    });
});
