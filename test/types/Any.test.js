'use strict';

const _Any = require('../../src/types/Any');
const { ValidationError } = require('../../src/ValidationError');
const { SchemaError } = require('../../src/SchemaError');

describe('Any', () => {
    let _any;

    beforeEach(() => {
        _any = new _Any();
    });

    describe('constructor', () => {
        it('should set the type to the passed value', () => {
            const type = 'someType';

            _any = new _Any(type);

            expect(_any._type).toBe(type);
        });

        it('should start we no validations', () => {
            expect(_any._validations).toStrictEqual([]);
        });

        it('should start with optional/required undefined', () => {
            expect(_any._required).toBe(undefined);
        });

        it('should start without a default value', () => {
            expect(_any._defaultValue).toBe(undefined);
        });

        it('should default to not coercing values', () => {
            expect(_any._coerceValue).toBe(false);
        });

        it('should default to no coersion options', () => {
            expect(_any._coersionOptions).toStrictEqual({});
        });
    });

    describe('validate', () => {
        let trackedOrder;

        beforeEach(() => {
            trackedOrder = 0;
        });

        function expectation({ order, inValue, outValue }) {
            _any._register(value => {
                expect(value).toBe(inValue);
                expect(trackedOrder++).toBe(order);
                return outValue;
            });
        }

        function expectationNext({ order, inValue, outValue }) {
            _any._register((value, next) => {
                expect(value).toBe(inValue);
                expect(trackedOrder++).toBe(order);
                return next(outValue);
            });
        }

        it('should process the validations in order, if next is not called', () => {
            expectation({ order: 0, inValue: 0, outValue: 1 });
            expectation({ order: 1, inValue: 1, outValue: 2 });
            expectation({ order: 2, inValue: 2, outValue: 3 });
            expectation({ order: 3, inValue: 3, outValue: 4 });

            expect(_any.validate(0)).toBe(4);
        });

        it('should process the validations in order, even if next is called', () => {
            expectationNext({ order: 0, inValue: 0, outValue: 1 });
            expectationNext({ order: 1, inValue: 1, outValue: 2 });
            expectationNext({ order: 2, inValue: 2, outValue: 3 });
            expectationNext({ order: 3, inValue: 3, outValue: 4 });

            expect(_any.validate(0)).toBe(4);
        });

        describe('missing values', () => {
            let mockValidation;

            beforeEach(() => {
                mockValidation = jest.fn().mockImplementation(() => {});

                _any._validations.push(mockValidation);
            });

            describe.each([
                undefined,
                null
            ])(
                'undefined/null values', value => {
                    describe(`${value}`, () => {
                        it('should continue validation if the value is required', () => {
                            _any._required = true;

                            _any.validate(undefined);

                            expect(mockValidation).toHaveBeenCalled();
                            expect(mockValidation).toBeCalledWith(undefined, expect.any(Function));
                        });

                        it('should continue if the value is optional', () => {
                            _any._required = false;

                            _any.validate(undefined);

                            expect(mockValidation).not.toHaveBeenCalled();
                        });
                    });
                });
        });
    });

    describe('optional/required', () => {
        it('should be optional by default', () => {
            expect(_any._required).toBe(undefined);
        });

        it('should define a schema as optional if "isOptional" is called', () => {
            _any = _any.isOptional();

            expect(_any._required).toBe(false);
        });

        it('should throw if "isOptional" is called more than once', () => {
            expect(() => _any.isOptional().isOptional()).toThrow('optionalityAlreadyDefined');
        });

        it('should define a schema as required if "isRequired" is called', () => {
            _any = _any.isRequired();

            expect(_any._required).toBe(true);
        });

        it('should register a function to check value is provided', () => {
            jest.spyOn(_any, '_registerFirst');

            _any = _any.isRequired();

            expect(_any._registerFirst).toHaveBeenCalledTimes(1);
            expect(_any._registerFirst).toHaveBeenCalledWith(expect.any(Function));
        });

        it('should throw if "isRequired" is called more than once', () => {
            expect(() => _any.isRequired().isRequired()).toThrow('optionalityAlreadyDefined');
        });

        describe('validation', () => {
            beforeEach(() => {
                _any = _any.isRequired();
            });

            it('should continue if the value is provided', () => {
                expect(_any.validate(1)).toBe(1);
            });

            it('should throw if the value is undefined', () => {
                expect(() => _any.validate()).toThrow('required');
            });

            it('should throw if the value is null', () => {
                expect(() => _any.validate(null)).toThrow('required');
            });
        });

        describe('coersion', () => {
            beforeEach(() => {
                _any = _any.coerce().isRequired().default('defaultValue');
            });

            it('should contine if the value is provided', () => {
                expect(_any.validate('hello')).toBe('hello');
            });

            it('should return the default value if the value is undefined', () => {
                expect(_any.validate()).toBe('defaultValue');
            });

            it('should return the default value if the value is null', () => {
                expect(_any.validate(null)).toBe('defaultValue');
            });
        });
    });

    describe('default', () => {
        it('should set the default value', () => {
            const defaultValue = 'a_new_default_value';

            _any = _any.default(defaultValue);

            expect(_any._defaultValue).toBe(defaultValue);
        });
    });

    describe('coerce', () => {
        it('should set the schema to coerce values', () => {
            _any = _any.coerce();

            expect(_any._isCoercing);
        });

        it('should allow setting of coersion options', () => {
            const options = {
                optionA: 'A',
                optionB: {
                    subOptionA: 'A1',
                    subOptionB: {
                        subSubOptionA: 'A1A'
                    }
                }
            };

            _any = _any.coerce(options);

            expect(_any._coersionOptions).toStrictEqual(options);
        });

        it('should merge multiple coersion options', () => {
            const optionsA = {
                optionA: 'A',
                optionB: {
                    subOptionA: 'A1',
                    subOptionB: {
                        subSubOptionA: 'A1A'
                    }
                },
                optionC: 'C'
            };

            const optionsB = {
                optionB: {
                    subOptionA: 'New-A1',
                    subOptionC: 'C1'
                },
                optionC: null,
                optionD: 'D'
            };

            _any = _any.coerce(optionsA).coerce().coerce(optionsB);

            expect(_any._coersionOptions).toStrictEqual({
                optionA: 'A',
                optionB: {
                    subOptionA: 'New-A1', // Replaced.
                    subOptionB: {
                        subSubOptionA: 'A1A'
                    },
                    subOptionC: 'C1' // Added.
                },
                optionC: null, // Replaced.
                optionD: 'D' // Added.
            });
        });
    });

    describe('_throwValidationError', () => {
        let reason;
        let additionalProperties;

        beforeEach(() => {
            reason = 'An error occurred';
            additionalProperties = {
                propertyName: 'propertyName',
                errors: ['Some sub-errors']
            };
        });

        it('should throw the passed reason', () => {
            expect(() => _any._throwValidationError(reason)).toThrow(reason);
        });

        it('should throw a "ValidationError"', () => {
            try {
                _any._throwValidationError(reason);
            } catch (error) {
                expect(error).toBeInstanceOf(ValidationError);
            }
        });

        it('should include any additional properties', () => {
            try {
                _any._throwValidationError(reason, additionalProperties);
            } catch (error) {
                expect(error).toMatchObject(additionalProperties);
            }
        });
    });

    describe('_throwSchemaError', () => {
        let reason;
        let additionalProperties;

        beforeEach(() => {
            reason = 'An error occurred';
            additionalProperties = {
                propertyName: 'propertyName',
                errors: ['Some sub-errors']
            };
        });

        it('should throw the passed reason', () => {
            expect(() => _any._throwSchemaError(reason)).toThrow(reason);
        });

        it('should throw a "SchemaError"', () => {
            try {
                _any._throwSchemaError(reason);
            } catch (error) {
                expect(error).toBeInstanceOf(SchemaError);
            }
        });

        it('should include any additional properties', () => {
            try {
                _any._throwSchemaError(reason, additionalProperties);
            } catch (error) {
                expect(error).toMatchObject(additionalProperties);
            }
        });
    });
});
