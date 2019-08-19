'use strict';

const _Function = require('../../src/types/Function');

describe('Function', () => {
    beforeEach(() => {
        jest.spyOn(_Function.prototype, 'isFunction');
    });

    describe('constructor', () => {
        it('should set the type to be "function"', () => {
            const _function = new _Function();

            expect(_function._type).toBe('function');
        });

        it('should set the default value to be a function', () => {
            const _function = new _Function();

            expect(_function._defaultValue).toStrictEqual(expect.any(Function));
        });

        it('should register the "isFunction" validation', () => {
            const _function = new _Function();

            expect(_function.isFunction).toHaveBeenCalledTimes(1);
        });
    });

    describe('isFunction', () => {
        const validFunction = () => {};

        describe('validation', () => {
            it('should continue if passed a valid function', () => {
                const _function = new _Function();

                expect(_function.validate(validFunction)).toBe(validFunction);
            });

            it('should throw if the value passed is not a function', () => {
                const _function = new _Function();

                expect(() => _function.validate(1)).toThrow('notAFunction');
            });
        });

        describe('coersion', () => {
            it('should continue if passed a valid function', () => {
                const _function = new _Function()
                    .coerce();

                expect(_function.validate(validFunction)).toBe(validFunction);
            });

            it('should return the default value if passed an invalid function', () => {
                const _function = new _Function()
                    .coerce()
                    .default('defaultValue');

                expect(_function.validate(4321)).toBe('defaultValue');
            });
        });
    });

    describe('arity', () => {
        const expectedArity = 3;
        const arityCorrect = (a1, a2, a3) => {};
        const arityTooLow = (a1, a2) => {};
        const arityTooHigh = (a1, a2, a3, a4) => {};

        describe('validation', () => {
            it('should continue if the arity is correct', () => {
                const _function = new _Function()
                    .arity(expectedArity);

                expect(_function.validate(arityCorrect)).toBe(arityCorrect);
            });

            it('should throw if the arity is too low', () => {
                const _function = new _Function()
                    .arity(expectedArity);

                expect(() => _function.validate(arityTooLow)).toThrow('arityTooLow');
            });

            it('should throw if the arity is too high', () => {
                const _function = new _Function()
                    .arity(expectedArity);

                expect(() => _function.validate(arityTooHigh)).toThrow('arityTooHigh');
            });
        });

        describe('coersion', () => {
            it('should continue if the arity is correct', () => {
                const _function = new _Function()
                    .arity(expectedArity)
                    .coerce();

                expect(_function.validate(arityCorrect)).toBe(arityCorrect);
            });

            it('should return the default value if the arity is too low', () => {
                const _function = new _Function()
                    .arity(expectedArity)
                    .coerce()
                    .default('defaultValue');

                expect(_function.validate(arityTooLow)).toBe('defaultValue');
            });

            it('should return the default value if the arity is too high', () => {
                const _function = new _Function()
                    .arity(expectedArity)
                    .coerce()
                    .default('defaultValue');

                expect(_function.validate(arityTooHigh)).toBe('defaultValue');
            });
        });
    });

    describe('minArity', () => {
        const expectedArity = 3;
        const arityCorrect = (a1, a2, a3) => {};
        const arityTooLow = (a1, a2) => {};
        const arityHigher = (a1, a2, a3, a4) => {};

        describe('validation', () => {
            it('should continue if the arity is correct', () => {
                const _function = new _Function()
                    .minArity(expectedArity);

                expect(_function.validate(arityCorrect)).toBe(arityCorrect);
            });

            it('should throw if the arity is too low', () => {
                const _function = new _Function()
                    .minArity(expectedArity);

                expect(() => _function.validate(arityTooLow)).toThrow('arityTooLow');
            });

            it('should continue if the arity is higher', () => {
                const _function = new _Function()
                    .minArity(expectedArity);

                expect(_function.validate(arityHigher)).toBe(arityHigher);
            });
        });

        describe('coersion', () => {
            it('should continue if the arity is correct', () => {
                const _function = new _Function()
                    .minArity(expectedArity)
                    .coerce();

                expect(_function.validate(arityCorrect)).toBe(arityCorrect);
            });

            it('should return the default value if the arity is too low', () => {
                const _function = new _Function()
                    .minArity(expectedArity)
                    .coerce()
                    .default('defaultValue');

                expect(_function.validate(arityTooLow)).toBe('defaultValue');
            });

            it('should continue if the arity is higher', () => {
                const _function = new _Function()
                    .minArity(expectedArity)
                    .coerce();

                expect(_function.validate(arityHigher)).toBe(arityHigher);
            });
        });
    });

    describe('maxArity', () => {
        const expectedArity = 3;
        const arityCorrect = (a1, a2, a3) => {};
        const arityLower = (a1, a2) => {};
        const arityTooHigh = (a1, a2, a3, a4) => {};

        describe('validation', () => {
            it('should continue if the arity is correct', () => {
                const _function = new _Function()
                    .maxArity(expectedArity);

                expect(_function.validate(arityCorrect)).toBe(arityCorrect);
            });

            it('should continue if the arity is lower', () => {
                const _function = new _Function()
                    .maxArity(expectedArity);

                expect(_function.validate(arityLower)).toBe(arityLower);
            });

            it('should throw if the arity is too high', () => {
                const _function = new _Function()
                    .maxArity(expectedArity);

                expect(() => _function.validate(arityTooHigh)).toThrow('arityTooHigh');
            });
        });

        describe('coersion', () => {
            it('should continue if the arity is correct', () => {
                const _function = new _Function()
                    .maxArity(expectedArity)
                    .coerce();

                expect(_function.validate(arityCorrect)).toBe(arityCorrect);
            });

            it('should continue if the arity is lower', () => {
                const _function = new _Function()
                    .maxArity(expectedArity)
                    .coerce();

                expect(_function.validate(arityLower)).toBe(arityLower);
            });

            it('should return the default value if the arity is too high', () => {
                const _function = new _Function()
                    .maxArity(expectedArity)
                    .coerce()
                    .default('defaultValue');

                expect(_function.validate(arityTooHigh)).toBe('defaultValue');
            });
        });
    });
});
