'use strict';

const _String = require('../../src/types/String');

describe('String', () => {
    beforeEach(() => {
        jest.spyOn(_String.prototype, 'isString');
    });

    describe('constructor', () => {
        it('should set the type to be "string"', () => {
            const _schema = new _String();

            expect(_schema._type).toBe('string');
        });

        it('should set the default value to be the empty string', () => {
            const _schema = new _String();

            expect(_schema._defaultValue).toBe('');
        });

        it('should register the "isString" validation', () => {
            const _schema = new _String();

            expect(_schema.isString).toHaveBeenCalledTimes(1);
        });
    });

    describe('isString', () => {
        describe('validation', () => {
            it('should continue if passed a valid string', () => {
                const _schema = new _String();

                _schema.validate('a valid string');
            });

            it('should throw if the value passed is not a string', () => {
                const _schema = new _String();

                expect(() => _schema.validate(12)).toThrow('notAString');
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
                        const _schema = new _String()
                            .coerce();

                        expect(_schema.validate(value)).toBe(expectedValue);
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
                    const _schema = new _String()
                        .coerce();

                    JSON.stringify.mockImplementation(() => { throw Error('JSON parsing errored for some reason'); });

                    expect(() => _schema.validate({})).toThrow('cannotConvertObjectToJSON');
                });
            });
        });
    });

    describe('notEmpty', () => {
        describe('validation', () => {
            it('should continue if passed a non-empty string', () => {
                const _schema = new _String()
                    .notEmpty();

                _schema.validate('not empty');
            });

            it('should throw if the value passed is an empty string', () => {
                const _schema = new _String()
                    .notEmpty();

                expect(() => _schema.validate('')).toThrow('cannotBeEmpty');
            });
        });

        describe('coersion', () => {
            it('should continue if passed a non-empty string', () => {
                const _schema = new _String()
                    .notEmpty()
                    .coerce()
                    .default('defaultValue');

                expect(_schema.validate('not empty')).toBe('not empty');
            });

            it('should coerce the value of an empty string by replacing it with the default value', () => {
                const _schema = new _String()
                    .notEmpty()
                    .coerce()
                    .default('defaultValue');

                expect(_schema.validate('')).toBe('defaultValue');
            });
        });
    });

    describe('minLength', () => {
        const correctLengthString = '0123';
        const tooShortString = '012';
        const longString = '01234';

        describe('validation', () => {
            it('should continue if the value is the minimum length', () => {
                const _schema = new _String()
                    .minLength(4);

                expect(_schema.validate(correctLengthString)).toBe(correctLengthString);
            });

            it('should continue if the value is longer than the minimum length', () => {
                const _schema = new _String()
                    .minLength(4);

                expect(_schema.validate(longString)).toBe(longString);
            });

            it('should throw if the value is shorter than the minimum length', () => {
                const _schema = new _String()
                    .minLength(4);

                expect(() => _schema.validate(tooShortString)).toThrow('tooShort');
            });
        });

        describe('coersion', () => {
            it('should continue if the value is the minimum length', () => {
                const _schema = new _String()
                    .minLength(4)
                    .coerce()
                    .default('defaultValue');

                expect(_schema.validate(correctLengthString)).toBe(correctLengthString);
            });

            it('should continue if the value is longer than the minimum length', () => {
                const _schema = new _String()
                    .minLength(4)
                    .coerce()
                    .default('defaultValue');

                expect(_schema.validate(longString)).toBe(longString);
            });

            it('should coerce the value that is too short by replacing it with the default value', () => {
                const _schema = new _String()
                    .minLength(4)
                    .coerce()
                    .default('defaultValue');

                expect(_schema.validate(tooShortString)).toBe('defaultValue');
            });
        });
    });

    describe('maxLength', () => {
        const correctLengthString = '0123';
        const shortString = '012';
        const tooLongString = '01234';

        describe('validation', () => {
            it('should continue if the value is the maximum length', () => {
                const _schema = new _String()
                    .maxLength(4);

                expect(_schema.validate(correctLengthString)).toBe(correctLengthString);
            });

            it('should continue if the value is shorter than the maximum length', () => {
                const _schema = new _String()
                    .maxLength(4);

                expect(_schema.validate(shortString)).toBe(shortString);
            });

            it('should throw if the value is longer the maximum length', () => {
                const _schema = new _String()
                    .maxLength(4);

                expect(() => _schema.validate(tooLongString)).toThrow('tooLong');
            });
        });

        describe('coersion', () => {
            it('should continue if the value is the maximum length', () => {
                const _schema = new _String()
                    .maxLength(4)
                    .coerce()
                    .default('defaultValue');

                expect(_schema.validate(correctLengthString)).toBe(correctLengthString);
            });

            it('should continue if the value is shorter than the maximum length', () => {
                const _schema = new _String()
                    .maxLength(4)
                    .coerce()
                    .default('defaultValue');

                expect(_schema.validate(shortString)).toBe(shortString);
            });

            it('should coerce the value that is too long by trimming it', () => {
                const _schema = new _String()
                    .maxLength(4)
                    .coerce()
                    .default('defaultValue');

                expect(_schema.validate(tooLongString)).toBe(correctLengthString);
            });
        });
    });

    describe('alpha', () => {
        const alphaCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nonAlphaCharacters = 'abcdef0123456789';

        describe('validation', () => {
            it('should continue if the value contains only alpha characters', () => {
                const _schema = new _String()
                    .alpha();

                expect(_schema.validate(alphaCharacters)).toBe(alphaCharacters);
            });

            it('should throw if the value contains non-alpha characters', () => {
                const _schema = new _String()
                    .alpha();

                expect(() => _schema.validate(nonAlphaCharacters)).toThrow('containsNonAlphaCharacters');
            });
        });

        describe('coersion', () => {
            it('should continue if the value contains only alpha characters', () => {
                const _schema = new _String()
                    .alpha()
                    .coerce()
                    .default('defaultValue');

                expect(_schema.validate(alphaCharacters)).toBe(alphaCharacters);
            });

            it('should coerce the value containing non-alpha characters by replacing it with the default value', () => {
                const _schema = new _String()
                    .alpha()
                    .coerce()
                    .default('defaultValue');

                expect(_schema.validate(nonAlphaCharacters)).toBe('defaultValue');
            });
        });
    });

    describe('alphaNum', () => {
        const alphaNumCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const nonAlphaNumCharacters = 'aA0&*@';

        describe('validation', () => {
            it('should continue if the value contains only alpha numeric characters', () => {
                const _schema = new _String()
                    .alphaNum();

                expect(_schema.validate(alphaNumCharacters)).toBe(alphaNumCharacters);
            });

            it('should throw if the value contains non-alpha numeric characters', () => {
                const _schema = new _String()
                    .alphaNum();

                expect(() => _schema.validate(nonAlphaNumCharacters)).toThrow('containsNonAlphaNumericCharacters');
            });
        });

        describe('coersion', () => {
            it('should continue if the value contains only alpha numeric characters', () => {
                const _schema = new _String()
                    .alphaNum()
                    .coerce()
                    .default('defaultValue');

                expect(_schema.validate(alphaNumCharacters)).toBe(alphaNumCharacters);
            });

            it('should coerce the value containing non-alpha numeric characters by replacing it with the default value', () => {
                const _schema = new _String()
                    .alphaNum()
                    .coerce()
                    .default('defaultValue');

                expect(_schema.validate(nonAlphaNumCharacters)).toBe('defaultValue');
            });
        });
    });

    describe('trim', () => {
        const noTrimming = 'A string that does not need trimming';
        const requiresTrimming = '  A string that does require trimming    ';
        const trimmedString = requiresTrimming.trim();

        describe('validation', () => {
            it('should continue if the value does not require trimming', () => {
                const _schema = new _String()
                    .trim();

                expect(_schema.validate(noTrimming)).toBe(noTrimming);
            });

            it('should throw if the value requires trimmning', () => {
                const _schema = new _String()
                    .trim();

                expect(() => _schema.validate(requiresTrimming)).toThrow('needsTrimming');
            });

            it('should trim the value if it required trimming and coerce is specified locally', () => {
                const _schema = new _String()
                    .trim(true);

                expect(_schema.validate(requiresTrimming)).toBe(trimmedString);
            });
        });

        describe('coersion', () => {
            it('should continue if the value does not require trimming', () => {
                const _schema = new _String()
                    .trim()
                    .coerce();

                expect(_schema.validate(noTrimming)).toBe(noTrimming);
            });

            it('should trim the value if it requires trimmning', () => {
                const _schema = new _String()
                    .trim()
                    .coerce();

                expect(_schema.validate(requiresTrimming)).toBe(trimmedString);
            });
        });
    });

    describe('upperCase', () => {
        const allUppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@£$%^&*()-_=+';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz0123456789!@£$%^&*()-_=+';

        describe('validation', () => {
            it('should continue if the value is all upper case', () => {
                const _schema = new _String()
                    .upperCase();

                expect(_schema.validate(allUppercase)).toBe(allUppercase);
            });

            it('should throw if the value is not all upper case', () => {
                const _schema = new _String()
                    .upperCase();

                expect(() => _schema.validate(lowercase)).toThrow('notUpperCase');
            });

            it('should make the value upper case if it is not already if coerce is specified locally', () => {
                const _schema = new _String()
                    .upperCase(true);

                expect(_schema.validate(lowercase)).toBe(allUppercase);
            });
        });

        describe('cohersion', () => {
            it('should continue if the value is all upper case', () => {
                const _schema = new _String()
                    .upperCase()
                    .coerce();

                expect(_schema.validate(allUppercase)).toBe(allUppercase);
            });

            it('should make the value uppercase if it is not already', () => {
                const _schema = new _String()
                    .upperCase()
                    .coerce();

                expect(_schema.validate(lowercase)).toBe(allUppercase);
            });
        });
    });

    describe('lowerCase', () => {
        const allLowerCase = 'abcdefghijklmnopqrstuvwxyz0123456789!@£$%^&*()-_=+';
        const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@£$%^&*()-_=+';

        describe('validation', () => {
            it('should continue if the value is all lower case', () => {
                const _schema = new _String()
                    .lowerCase();

                expect(_schema.validate(allLowerCase)).toBe(allLowerCase);
            });

            it('should throw if the value is not all lower case', () => {
                const _schema = new _String()
                    .lowerCase();

                expect(() => _schema.validate(upperCase)).toThrow('notLowerCase');
            });

            it('should make the value lower case if it is not already if coerce is specified locally', () => {
                const _schema = new _String()
                    .lowerCase(true);

                expect(_schema.validate(upperCase)).toBe(allLowerCase);
            });
        });

        describe('cohersion', () => {
            it('should continue if the value is all lower case', () => {
                const _schema = new _String()
                    .lowerCase()
                    .coerce();

                expect(_schema.validate(allLowerCase)).toBe(allLowerCase);
            });

            it('should make the value lower case if it is not already', () => {
                const _schema = new _String()
                    .lowerCase()
                    .coerce();

                expect(_schema.validate(upperCase)).toBe(allLowerCase);
            });
        });
    });
});
