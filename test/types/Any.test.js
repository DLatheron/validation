'use strict';

const _Any = require('../../src/types/Any');

describe('Any', () => {
    let _any;
    let trackedOrder;

    beforeEach(() => {
        _any = new _Any();
        trackedOrder = 0;
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
});
