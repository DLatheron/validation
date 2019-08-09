'use strict';

const _OneOf = require('../../src/types/OneOf');
const _Any = require('../../src/types/Any');
const _String = require('../../src/types/String');
const _Number = require('../../src/types/Number');
const { ValidationError } = require('../../src/ValidationError');

describe('OneOf', () => {
    let subSchema;

    beforeEach(() => {
        subSchema = [
            new _String().default('defaultValue'),
            new _Number().default(1234)
        ];
    });

    describe('constructor', () => {
        beforeEach(() => {
            jest.spyOn(_OneOf.prototype, 'isOneOf');
        });

        it('should set the type to be "oneOf"', () => {
            const _oneOf = new _OneOf(subSchema);

            expect(_oneOf._type).toBe('oneOf');
        });

        it('should set the default value to be the first default entry in the subSchema', () => {
            const _oneOf = new _OneOf(subSchema);

            expect(_oneOf._defaultValue).toBe(subSchema[0]._defaultValue);
        });

        it('should throw if the sub schemas are not provided', () => {
            expect(() => new _OneOf()).toThrow('notAnArrayOfSchemas');
        });

        it('should throw if the sub schemas are an array', () => {
            expect(() => new _OneOf(new _String())).toThrow('notAnArrayOfSchemas');
        });

        it('should throw if the sub schemas is not an array of schema', () => {
            expect(() => new _OneOf([
                new _String(),
                'not a schema'
            ])).toThrow('mustBeASchema');
        });

        it('should register the "isOneOf" validation', () => {
            const _oneOf = new _OneOf(subSchema);

            expect(_oneOf.isOneOf).toHaveBeenCalledTimes(1);
            expect(_oneOf.isOneOf).toHaveBeenCalledWith(subSchema);
        });
    });

    describe('isOneOf', () => {
        let mockSubSchema;

        class MockSchema extends _Any {
            constructor() {
                super('mockSchema');
                this._mock = jest.fn(() => this._throwValidationError('mockError'));
                this._registerFirst(this._mock);
                return this;
            }
        }

        beforeEach(() => {
            mockSubSchema = [
                new MockSchema(),
                new MockSchema(),
                new MockSchema()
            ];
        });

        describe('validation', () => {
            it('should contine if passed a valid value', () => {
                const _oneOf = new _OneOf(subSchema);

                expect(_oneOf.validate('Hello')).toBe('Hello');
                expect(_oneOf.validate(342)).toBe(342);
            });

            it('should throw if the value passed is not one of the allow schemas', () => {
                const _oneOf = new _OneOf(subSchema);

                expect(() => _oneOf.validate(true)).toThrow('subSchemaFailure');
            });

            it('should throw details of the sub schema failure', () => {
                const _oneOf = new _OneOf(subSchema);

                try {
                    _oneOf.validate(true);
                    expect.fail();
                } catch (error) {
                    expect(error).toBeInstanceOf(ValidationError);
                    expect(error.message).toBe('subSchemaFailure');
                    expect(error.errors[0].message).toStrictEqual('notAString');
                    expect(error.errors[1].message).toStrictEqual('notANumber');
                }
            });

            describe('sub schema evaluation', () => {
                it('should continue if the first sub schema validates it as true', () => {
                    mockSubSchema[0]._mock.mockImplementation(value => value);
                    mockSubSchema[1]._mock.mockImplementation(value => value);
                    mockSubSchema[2]._mock.mockImplementation(value => value);

                    const _oneOf = new _OneOf(mockSubSchema);

                    expect(_oneOf.validate('value')).toBe('value');

                    expect(mockSubSchema[0]._mock).toHaveBeenCalledTimes(1);
                    expect(mockSubSchema[1]._mock).not.toHaveBeenCalled();
                    expect(mockSubSchema[2]._mock).not.toHaveBeenCalled();
                });

                it('should continue if the second sub schema validates it as true', () => {
                    mockSubSchema[1]._mock.mockImplementation(value => value);
                    mockSubSchema[2]._mock.mockImplementation(value => value);

                    const _oneOf = new _OneOf(mockSubSchema);

                    expect(_oneOf.validate('value')).toBe('value');

                    expect(mockSubSchema[0]._mock).toHaveBeenCalledTimes(1);
                    expect(mockSubSchema[1]._mock).toHaveBeenCalledTimes(1);
                    expect(mockSubSchema[2]._mock).not.toHaveBeenCalled();
                });

                it('should continue if the third sub schema validates it as true', () => {
                    mockSubSchema[2]._mock.mockImplementation(value => value);

                    const _oneOf = new _OneOf(mockSubSchema);

                    expect(_oneOf.validate('value')).toBe('value');

                    expect(mockSubSchema[0]._mock).toHaveBeenCalledTimes(1);
                    expect(mockSubSchema[1]._mock).toHaveBeenCalledTimes(1);
                    expect(mockSubSchema[2]._mock).toHaveBeenCalledTimes(1);
                });

                it('should throw if none of the sub schemas validate it as true', () => {
                    const _oneOf = new _OneOf(mockSubSchema);

                    expect(() => _oneOf.validate('value')).toThrow('subSchemaFailure');

                    expect(mockSubSchema[0]._mock).toHaveBeenCalledTimes(1);
                    expect(mockSubSchema[1]._mock).toHaveBeenCalledTimes(1);
                    expect(mockSubSchema[2]._mock).toHaveBeenCalledTimes(1);
                });
            });
        });

        describe('coersion', () => {
            it('should contine if passed a valid value', () => {
                const _oneOf = new _OneOf(subSchema)
                    .coerce();

                expect(_oneOf.validate('Hello')).toBe('Hello');
                expect(_oneOf.validate(342)).toBe(342);
            });

            it('should return the default value from the first schema if passed an invalid value', () => {
                const _oneOf = new _OneOf(subSchema)
                    .coerce();

                expect(_oneOf.validate(true)).toBe('defaultValue');
            });

            describe('sub schema evaluation', () => {
                it('should continue if the first sub schema validates it as true', () => {
                    mockSubSchema[0]._mock.mockImplementation(value => value);
                    mockSubSchema[1]._mock.mockImplementation(value => value);
                    mockSubSchema[2]._mock.mockImplementation(value => value);

                    const _oneOf = new _OneOf(mockSubSchema)
                        .coerce();

                    expect(_oneOf.validate('value')).toBe('value');

                    expect(mockSubSchema[0]._mock).toHaveBeenCalledTimes(1);
                    expect(mockSubSchema[1]._mock).not.toHaveBeenCalled();
                    expect(mockSubSchema[2]._mock).not.toHaveBeenCalled();
                });

                it('should continue if the second sub schema validates it as true', () => {
                    mockSubSchema[1]._mock.mockImplementation(value => value);
                    mockSubSchema[2]._mock.mockImplementation(value => value);

                    const _oneOf = new _OneOf(mockSubSchema)
                        .coerce();

                    expect(_oneOf.validate('value')).toBe('value');

                    expect(mockSubSchema[0]._mock).toHaveBeenCalledTimes(1);
                    expect(mockSubSchema[1]._mock).toHaveBeenCalledTimes(1);
                    expect(mockSubSchema[2]._mock).not.toHaveBeenCalled();
                });

                it('should continue if the third sub schema validates it as true', () => {
                    mockSubSchema[2]._mock.mockImplementation(value => value);

                    const _oneOf = new _OneOf(mockSubSchema)
                        .coerce();

                    expect(_oneOf.validate('value')).toBe('value');

                    expect(mockSubSchema[0]._mock).toHaveBeenCalledTimes(1);
                    expect(mockSubSchema[1]._mock).toHaveBeenCalledTimes(1);
                    expect(mockSubSchema[2]._mock).toHaveBeenCalledTimes(1);
                });

                it('should return the default value of the first schema if none of the sub schemas validate it as true', () => {
                    mockSubSchema[0]._defaultValue = 'mock default value';
                    mockSubSchema[1]._defaultValue = 'not the expected mock default value';
                    mockSubSchema[2]._defaultValue = 'not the expected mock default value';

                    const _oneOf = new _OneOf(mockSubSchema)
                        .coerce();

                    expect(_oneOf.validate('value')).toBe('mock default value');

                    expect(mockSubSchema[0]._mock).toHaveBeenCalledTimes(1);
                    expect(mockSubSchema[1]._mock).toHaveBeenCalledTimes(1);
                    expect(mockSubSchema[2]._mock).toHaveBeenCalledTimes(1);
                });
            });
        });
    });
});
