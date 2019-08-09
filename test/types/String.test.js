'use strict';

const _String = require('../../src/types/String');

describe('String', () => {
    beforeEach(() => {
        jest.spyOn(_String.prototype, 'isString');
    });

    describe('constructor', () => {
        it('should set the type to be "string"', () => {
            const _string = new _String();

            expect(_string._type).toBe('string');
        });

        it('should set the default value to be the empty string', () => {
            const _string = new _String();

            expect(_string._defaultValue).toBe('');
        });

        it('should register the "isString" validation', () => {
            const _string = new _String();

            expect(_string.isString).toHaveBeenCalledTimes(1);
        });
    });

    describe('isString', () => {
        describe('validation', () => {
            it('should continue if passed a valid string', () => {
                const _string = new _String();

                _string.validate('a valid string');
            });

            it('should throw if the value passed is not a string', () => {
                const _string = new _String();

                expect(() => _string.validate(12)).toThrow('notAString');
            });
        });

        describe('coersion', () => {
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
                        const _string = new _String()
                            .coerce();

                        expect(_string.validate(value)).toBe(expectedValue);
                    });
                });

            describe('JSON parsing', () => {
                let oldJSONStringify;

                beforeEach(() => {
                    oldJSONStringify = JSON.stringify;
                    JSON.stringify = jest.mock().fn();
                });

                afterEach(() => {
                    JSON.stringify = oldJSONStringify;
                });

                it('should throw an error if parsing fails', () => {
                    const _string = new _String()
                        .coerce();

                    JSON.stringify.mockImplementation(() => { throw Error('JSON parsing errored for some reason'); });

                    expect(() => _string.validate({})).toThrow('cannotConvertObjectToJSON');
                });
            });
        });
    });

    describe('notEmpty', () => {
        describe('validation', () => {
            it('should continue if passed a non-empty string', () => {
                const _string = new _String()
                    .notEmpty();

                _string.validate('not empty');
            });

            it('should throw if the value passed is an empty string', () => {
                const _string = new _String()
                    .notEmpty();

                expect(() => _string.validate('')).toThrow('cannotBeEmpty');
            });
        });

        describe('coersion', () => {
            it('should continue if passed a non-empty string', () => {
                const _string = new _String()
                    .notEmpty()
                    .coerce()
                    .default('defaultValue');

                expect(_string.validate('not empty')).toBe('not empty');
            });

            it('should coerce the value of an empty string by replacing it with the default value', () => {
                const _string = new _String()
                    .notEmpty()
                    .coerce()
                    .default('defaultValue');

                expect(_string.validate('')).toBe('defaultValue');
            });
        });
    });

    describe('minLength', () => {
        const correctLengthString = '0123';
        const tooShortString = '012';
        const longString = '01234';

        describe('validation', () => {
            it('should continue if the value is the minimum length', () => {
                const _string = new _String()
                    .minLength(4);

                expect(_string.validate(correctLengthString)).toBe(correctLengthString);
            });

            it('should continue if the value is longer than the minimum length', () => {
                const _string = new _String()
                    .minLength(4);

                expect(_string.validate(longString)).toBe(longString);
            });

            it('should throw if the value is shorter than the minimum length', () => {
                const _string = new _String()
                    .minLength(4);

                expect(() => _string.validate(tooShortString)).toThrow('tooShort');
            });
        });

        describe('coersion', () => {
            it('should continue if the value is the minimum length', () => {
                const _string = new _String()
                    .minLength(4)
                    .coerce()
                    .default('defaultValue');

                expect(_string.validate(correctLengthString)).toBe(correctLengthString);
            });

            it('should continue if the value is longer than the minimum length', () => {
                const _string = new _String()
                    .minLength(4)
                    .coerce()
                    .default('defaultValue');

                expect(_string.validate(longString)).toBe(longString);
            });

            it('should coerce the value that is too short by replacing it with the default value', () => {
                const _string = new _String()
                    .minLength(4)
                    .coerce()
                    .default('defaultValue');

                expect(_string.validate(tooShortString)).toBe('defaultValue');
            });
        });
    });

    describe('maxLength', () => {
        const correctLengthString = '0123';
        const shortString = '012';
        const tooLongString = '01234';

        describe('validation', () => {
            it('should continue if the value is the maximum length', () => {
                const _string = new _String()
                    .maxLength(4);

                expect(_string.validate(correctLengthString)).toBe(correctLengthString);
            });

            it('should continue if the value is shorter than the maximum length', () => {
                const _string = new _String()
                    .maxLength(4);

                expect(_string.validate(shortString)).toBe(shortString);
            });

            it('should throw if the value is longer the maximum length', () => {
                const _string = new _String()
                    .maxLength(4);

                expect(() => _string.validate(tooLongString)).toThrow('tooLong');
            });
        });

        describe('coersion', () => {
            it('should continue if the value is the maximum length', () => {
                const _string = new _String()
                    .maxLength(4)
                    .coerce()
                    .default('defaultValue');

                expect(_string.validate(correctLengthString)).toBe(correctLengthString);
            });

            it('should continue if the value is shorter than the maximum length', () => {
                const _string = new _String()
                    .maxLength(4)
                    .coerce()
                    .default('defaultValue');

                expect(_string.validate(shortString)).toBe(shortString);
            });

            it('should coerce the value that is too long by trimming it', () => {
                const _string = new _String()
                    .maxLength(4)
                    .coerce()
                    .default('defaultValue');

                expect(_string.validate(tooLongString)).toBe(correctLengthString);
            });
        });
    });

    describe('alpha', () => {
        const alphaCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nonAlphaCharacters = 'abcdef0123456789';

        describe('validation', () => {
            it('should continue if the value contains only alpha characters', () => {
                const _string = new _String()
                    .alpha();

                expect(_string.validate(alphaCharacters)).toBe(alphaCharacters);
            });

            it('should throw if the value contains non-alpha characters', () => {
                const _string = new _String()
                    .alpha();

                expect(() => _string.validate(nonAlphaCharacters)).toThrow('containsNonAlphaCharacters');
            });
        });

        describe('coersion', () => {
            it('should continue if the value contains only alpha characters', () => {
                const _string = new _String()
                    .alpha()
                    .coerce()
                    .default('defaultValue');

                expect(_string.validate(alphaCharacters)).toBe(alphaCharacters);
            });

            it('should coerce the value containing non-alpha characters by replacing it with the default value', () => {
                const _string = new _String()
                    .alpha()
                    .coerce()
                    .default('defaultValue');

                expect(_string.validate(nonAlphaCharacters)).toBe('defaultValue');
            });
        });
    });

    describe('alphanum', () => {
        const alphaNumCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const nonAlphaNumCharacters = 'aA0&*@';

        describe('validation', () => {
            it('should continue if the value contains only alpha numeric characters', () => {
                const _string = new _String()
                    .alphanum();

                expect(_string.validate(alphaNumCharacters)).toBe(alphaNumCharacters);
            });

            it('should throw if the value contains non-alpha numeric characters', () => {
                const _string = new _String()
                    .alphanum();

                expect(() => _string.validate(nonAlphaNumCharacters)).toThrow('containsNonAlphaNumericCharacters');
            });
        });

        describe('coersion', () => {
            it('should continue if the value contains only alpha numeric characters', () => {
                const _string = new _String()
                    .alphanum()
                    .coerce()
                    .default('defaultValue');

                expect(_string.validate(alphaNumCharacters)).toBe(alphaNumCharacters);
            });

            it('should coerce the value containing non-alpha numeric characters by replacing it with the default value', () => {
                const _string = new _String()
                    .alphanum()
                    .coerce()
                    .default('defaultValue');

                expect(_string.validate(nonAlphaNumCharacters)).toBe('defaultValue');
            });
        });
    });
});
