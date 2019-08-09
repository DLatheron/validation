'use strict';

const _Object = require('../../src/types/Object');
const _String = require('../../src/types/String');

describe.only('Object', () => {
    let _object;

    beforeEach(() => {
        _object = new _Object();
    });

    describe('constructor', () => {
        beforeEach(() => {
            jest.spyOn(_Object.prototype, 'isObject');
        });

        it('should set the type to be "object"', () => {
            _object = new _Object();

            expect(_object._type).toBe('object');
        });

        it('should set the default value to be the empty object', () => {
            _object = new _Object();

            expect(_object._defaultValue).toStrictEqual({});
        });

        it('should register the "isObject" validation', () => {
            _object = new _Object('argument1', 'argument2');

            expect(_object.isObject).toHaveBeenCalledTimes(1);
            expect(_object.isObject).toHaveBeenCalledWith('argument1', 'argument2');
        });
    });

    describe('isObject', () => {
        let calledMocks;
        let subObjectSchema;

        beforeEach(() => {
            calledMocks = [
                jest.fn(),
                jest.fn(),
                jest.fn()
            ];

            subObjectSchema = {
                0: { validate: calledMocks[0] },
                1: { validate: calledMocks[1] },
                2: { validate: calledMocks[2] }
            };
        });

        describe('validation', () => {
            it('should continue if passed a valid object', () => {
                expect(_object.validate({})).toStrictEqual({});
            });

            it('should throw if the value passed is not an object', () => {
                expect(() => _object.validate('')).toThrow('notAnObject');
            });

            describe('sub-object validation', () => {
                beforeEach(() => {
                    _object = new _Object(subObjectSchema);
                });

                it('should continue if passed a valid object', () => {
                    expect(_object.validate({})).toStrictEqual({});
                });

                it('should attempt to validate the properties in the object schema', () => {
                    _object.validate({
                        0: 'Property 0 Value',
                        1: 'Property 1 Value',
                        2: 'Property 2 Value'
                    });

                    calledMocks.forEach((calledMock, index) => {
                        expect(calledMock).toHaveBeenCalledTimes(1);
                        expect(calledMock).toHaveBeenCalledWith(`Property ${index} Value`);
                    });
                });

                it('should throw if sub-object validation fails', () => {
                    _object = new _Object({ string: new _String() });

                    expect(() => _object.validate({ string: 123 })).toThrow('notAString');
                });

                describe('if additional properties are allowed', () => {
                    beforeEach(() => {
                        _object = new _Object(subObjectSchema, { allowAdditionalProperties: true });
                    });

                    it('should continue if passed an object with additional properties', () => {
                        const value = {
                            0: 'Property 0 Value',
                            1: 'Property 1 Value',
                            2: 'Property 2 Value',
                            3: 'Additional property'
                        };

                        expect(_object.validate(value)).toBe(value);
                    });
                });

                describe('if additional properties are not allowed', () => {
                    beforeEach(() => {
                        _object = new _Object(subObjectSchema, { allowAdditionalProperties: false });
                    });

                    it('should throw if passed an object with additional properties', () => {
                        const value = {
                            0: 'Property 0 Value',
                            1: 'Property 1 Value',
                            2: 'Property 2 Value',
                            3: 'Additional property'
                        };

                        try {
                            _object.validate(value);
                            expect.fail();
                        } catch (error) {
                            expect(error.message).toBe('unexpectedProperty');
                            expect(error.propertyName).toBe('3');
                        }
                    });
                });
            });
        });

        describe('coersion', () => {
            beforeEach(() => {
                _object = _object.coerce().default('defaultValue');
            });

            it('should continue if passed a valid object', () => {
                expect(_object.validate({})).toStrictEqual({});
            });

            it('should return the default value if passed an invalid object', () => {
                expect(_object.validate(123)).toStrictEqual('defaultValue');
            });

            describe('JSON conversion', () => {
                let value;

                beforeEach(() => {
                    value = {
                        property: 'value',
                        number: 543,
                        bool: true
                    };
                });

                it('should allow conversion from a JSON string to an object', () => {
                    _object = _object.coerce({ json: { convert: true } });

                    expect(_object.validate(JSON.stringify(value))).toStrictEqual(value);
                });

                it('should not allow conversion from a JSON string if it is disabled', () => {
                    _object = _object.coerce({ json: { convert: false } }).default('defaultValue');

                    expect(_object.validate(JSON.stringify(value))).toBe('defaultValue');
                });

                it('should default to not allowing conversion from JSON', () => {
                    _object = _object.coerce();

                    expect(_object._coersionOptions.json.convert).toBe(false);
                });

                it('should throw an error if JSON parsing fails', () => {
                    _object = _object.coerce({ json: { convert: true } }).default('defaultValue');

                    expect(_object.validate('"invalid JSON')).toBe('defaultValue');
                });
            });

            describe('sub-object coersion', () => {
                describe('if additional properties are allowed', () => {
                    beforeEach(() => {
                        _object = new _Object(subObjectSchema, { allowAdditionalProperties: true }).coerce();
                    });

                    it('should continue if passed an object with additional properties', () => {
                        const value = {
                            0: 'Property 0 Value',
                            1: 'Property 1 Value',
                            2: 'Property 2 Value',
                            3: 'Additional property'
                        };

                        expect(_object.validate(value)).toStrictEqual(value);
                    });
                });

                describe('if additional properties are not allowed', () => {
                    beforeEach(() => {
                        _object = new _Object(subObjectSchema, { allowAdditionalProperties: false }).coerce();
                    });

                    it('should filter additional properties out', () => {
                        const value = {
                            0: 'Property 0 Value',
                            1: 'Property 1 Value',
                            2: 'Property 2 Value',
                            3: 'Additional property'
                        };

                        expect(_object.validate(value)).toStrictEqual({
                            0: 'Property 0 Value',
                            1: 'Property 1 Value',
                            2: 'Property 2 Value'
                        });
                    });
                });
            });
        });
    });
});
