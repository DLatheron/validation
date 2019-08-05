'use strict';

const Any = require('../../src/types/Any');
const _Array = require('../../src/types/Array');
const _Number = require('../../src/types/Number');

describe('Array', () => {
    let _array;

    beforeEach(() => {
        jest.spyOn(_Array.prototype, 'isArray');

        _array = new _Array();
    });

    describe('constructor', () => {
        it('should set the type to be "array"', () => {
            expect(_array._type).toBe('array');
        });

        it('should set the default value to be []', () => {
            expect(_array._defaultValue).toStrictEqual([]);
        });

        it('should register the "isNumber" validation', () => {
            expect(_array.isArray).toHaveBeenCalledTimes(1);
        });

        it('should default the element schema to "Any"', () => {
            expect(_array._elementSchema).toStrictEqual(new Any());
        });

        it('should set the element schema is overridden', () => {
            const elementSchema = new Any();

            _array = new _Array(elementSchema);

            expect(_array._elementSchema).toBe(elementSchema);
        });
    });

    describe('isArray', () => {
        beforeEach(() => {
            _array = new _Array(new _Number());
        });

        describe('validation', () => {
            it('should continue if passed a valid array', () => {
                expect(_array.validate([])).toStrictEqual([]);
            });

            it('should continue if each item in the array validates against the element schema', () => {
                expect(_array.validate([1, 2, 3, 4])).toStrictEqual([1, 2, 3, 4]);
            });

            it('should throw if the value passed is not a valid array', () => {
                expect(() => _array.validate({})).toThrow('notAnArray');
            });

            it('should throw if any item fails the schema validation', () => {
                expect(() => _array.validate([1, 2, 3, 'notANumber'])).toThrow('notANumber');
            });
        });

        describe('coersion', () => {
            beforeEach(() => {
                _array = new _Array().coerce();
            });

            describe.each([
                // Numbers.
                { value: 0, expectedValue: [0] },
                { value: -7843.75, expectedValue: [-7843.75] },
                { value: 1234, expectedValue: [1234] },

                // Strings.
                { value: '', expectedValue: [''] },
                { value: 'aString', expectedValue: ['aString'] },

                // Booleans.
                { value: true, expectedValue: [true] },
                { value: false, expectedValue: [false] },

                // Objects.
                { value: {}, expectedValue: [{}] },
                { value: { prop: 4523 }, expectedValue: [{ prop: 4523 }] }
            ])(
                'successful coersions', ({ value, expectedValue }) => {
                    it(`should coerce ${typeof value} === "${value}" to a number === ${expectedValue}`, () => {
                        expect(_array.validate(value)).toStrictEqual(expectedValue);
                    });
                });
        });
    });

    describe('notEmpty', () => {
        beforeEach(() => {
            _array = _array.notEmpty();
        });

        describe('validation', () => {
            it('should continue if passed a non-empty array', () => {
                expect(_array.validate([0])).toStrictEqual([0]);
            });

            it('should throw if the passed is an empty array', () => {
                expect(() => _array.validate([])).toThrow('');
                expect(() => _array.validate([])).toThrow('');
            });
        });

        describe('coersion', () => {
            beforeEach(() => {
                _array = _array.coerce().default([1234, 5678]);
            });

            it('should continue if passed a non-empty array', () => {
                expect(_array.validate([56])).toStrictEqual([56]);
            });

            it('should coerce the value of an empty array by replacing it with the default value', () => {
                expect(_array.validate([])).toStrictEqual([1234, 5678]);
            });
        });
    });

    describe('minLength', () => {
        const correctLengthArray = [1, 2, 3, 4];
        const tooShortArray = [1, 2, 3];
        const longArray = [1, 2, 3, 4, 5];

        beforeEach(() => {
            _array = _array.minLength(4);
        });

        describe('validation', () => {
            it('should continue if the value is the minimum length', () => {
                expect(_array.validate(correctLengthArray)).toStrictEqual(correctLengthArray);
            });

            it('should continue if the value is longer than the minimum length', () => {
                expect(_array.validate(longArray)).toStrictEqual(longArray);
            });

            it('should throw if the value is shorter than the minimum length', () => {
                expect(() => _array.validate(tooShortArray)).toThrow('tooShort');
            });
        });

        describe('coersion', () => {
            beforeEach(() => {
                _array = _array.coerce().default(['defaultValue']);
            });

            it('should continue if the value is the minimum length', () => {
                expect(_array.validate(correctLengthArray)).toStrictEqual(correctLengthArray);
            });

            it('should continue if the value is longer than the minimum length', () => {
                expect(_array.validate(longArray)).toStrictEqual(longArray);
            });

            it('should coerce the value that is too short by replacing it with the default value', () => {
                expect(_array.validate(tooShortArray)).toStrictEqual(['defaultValue']);
            });
        });
    });
});
