'use strict';

const Any = require('../../src/types/Any');
const _Array = require('../../src/types/Array');
const _Number = require('../../src/types/Number');

describe('Array', () => {
    beforeEach(() => {
        jest.spyOn(_Array.prototype, 'isArray');
    });

    describe('constructor', () => {
        it('should set the type to be "array"', () => {
            const _array = new _Array();

            expect(_array._type).toBe('array');
        });

        it('should set the default value to be []', () => {
            const _array = new _Array();

            expect(_array._defaultValue).toStrictEqual([]);
        });

        it('should register the "isNumber" validation', () => {
            const _array = new _Array();

            expect(_array.isArray).toHaveBeenCalledTimes(1);
        });

        it('should default the element schema to "Any"', () => {
            const _array = new _Array();

            expect(_array._elementSchema).toStrictEqual(new Any());
        });

        it('should set the element schema is overridden', () => {
            const elementSchema = new Any();
            const _array = new _Array(elementSchema);

            expect(_array._elementSchema).toBe(elementSchema);
        });
    });

    describe('isArray', () => {
        describe('validation', () => {
            it('should continue if passed a valid array', () => {
                const _array = new _Array(new _Number());

                expect(_array.validate([])).toStrictEqual([]);
            });

            it('should continue if each item in the array validates against the element schema', () => {
                const _array = new _Array(new _Number());

                expect(_array.validate([1, 2, 3, 4])).toStrictEqual([1, 2, 3, 4]);
            });

            it('should throw if the value passed is not a valid array', () => {
                const _array = new _Array(new _Number());

                expect(() => _array.validate({})).toThrow('notAnArray');
            });

            it('should throw if any item fails the schema validation', () => {
                const _array = new _Array(new _Number());

                expect(() => _array.validate([1, 2, 3, 'notANumber'])).toThrow('notANumber');
            });
        });

        describe('coersion', () => {
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
                        const _array = new _Array()
                            .coerce();

                        expect(_array.validate(value)).toStrictEqual(expectedValue);
                    });
                });
        });
    });

    describe('notEmpty', () => {
        describe('validation', () => {
            it('should continue if passed a non-empty array', () => {
                const _array = new _Array()
                    .notEmpty();

                expect(_array.validate([0])).toStrictEqual([0]);
            });

            it('should throw if the passed is an empty array', () => {
                const _array = new _Array()
                    .notEmpty();

                expect(() => _array.validate([])).toThrow('');
                expect(() => _array.validate([])).toThrow('');
            });
        });

        describe('coersion', () => {
            it('should continue if passed a non-empty array', () => {
                const _array = new _Array()
                    .notEmpty()
                    .coerce()
                    .default([1234, 5678]);

                expect(_array.validate([56])).toStrictEqual([56]);
            });

            it('should coerce the value of an empty array by replacing it with the default value', () => {
                const _array = new _Array()
                    .notEmpty()
                    .coerce()
                    .default([1234, 5678]);

                expect(_array.validate([])).toStrictEqual([1234, 5678]);
            });
        });
    });

    describe('minLength', () => {
        const correctLengthArray = [1, 2, 3, 4];
        const tooShortArray = [1, 2, 3];
        const longArray = [1, 2, 3, 4, 5];

        describe('validation', () => {
            it('should continue if the value is the minimum length', () => {
                const _array = new _Array()
                    .minLength(4);

                expect(_array.validate(correctLengthArray)).toStrictEqual(correctLengthArray);
            });

            it('should continue if the value is longer than the minimum length', () => {
                const _array = new _Array()
                    .minLength(4);

                expect(_array.validate(longArray)).toStrictEqual(longArray);
            });

            it('should throw if the value is shorter than the minimum length', () => {
                const _array = new _Array()
                    .minLength(4);

                expect(() => _array.validate(tooShortArray)).toThrow('tooShort');
            });
        });

        describe('coersion', () => {
            it('should continue if the value is the minimum length', () => {
                const _array = new _Array()
                    .minLength(4)
                    .coerce()
                    .default(['defaultValue']);

                expect(_array.validate(correctLengthArray)).toStrictEqual(correctLengthArray);
            });

            it('should continue if the value is longer than the minimum length', () => {
                const _array = new _Array()
                    .minLength(4)
                    .coerce()
                    .default(['defaultValue']);

                expect(_array.validate(longArray)).toStrictEqual(longArray);
            });

            it('should coerce the value that is too short by replacing it with the default value', () => {
                const _array = new _Array()
                    .minLength(4)
                    .coerce()
                    .default(['defaultValue']);

                expect(_array.validate(tooShortArray)).toStrictEqual(['defaultValue']);
            });
        });
    });

    describe('maxLength', () => {
        const correctLengthArray = [1, 2, 3, 4];
        const shortArray = [1, 2, 3];
        const tooLongArray = [1, 2, 3, 4, 5];

        describe('validation', () => {
            it('should continue if the value is the maximum length', () => {
                const _array = new _Array()
                    .maxLength(4);

                expect(_array.validate(correctLengthArray)).toStrictEqual(correctLengthArray);
            });

            it('should continue if the value is shorter than the maximum length', () => {
                const _array = new _Array()
                    .maxLength(4);

                expect(_array.validate(shortArray)).toStrictEqual(shortArray);
            });

            it('should throw if the value is shorter than the maximum length', () => {
                const _array = new _Array()
                    .maxLength(4);

                expect(() => _array.validate(tooLongArray)).toThrow('tooLong');
            });
        });

        describe('coersion', () => {
            it('should continue if the value is the maximum length', () => {
                const _array = new _Array()
                    .maxLength(4)
                    .coerce()
                    .default(['defaultValue']);

                expect(_array.validate(correctLengthArray)).toStrictEqual(correctLengthArray);
            });

            it('should continue if the value is shorter than the maximum length', () => {
                const _array = new _Array()
                    .maxLength(4)
                    .coerce()
                    .default(['defaultValue']);

                expect(_array.validate(shortArray)).toStrictEqual(shortArray);
            });

            it('should coerce the value that is too long by trimming it', () => {
                const _array = new _Array()
                    .maxLength(4)
                    .coerce()
                    .default(['defaultValue']);

                expect(_array.validate(tooLongArray)).toStrictEqual(correctLengthArray);
            });
        });
    });
});
