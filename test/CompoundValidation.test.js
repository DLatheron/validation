'use strict';

const Validate = require('../src/Validate');

describe('Compound Validation', () => {
    describe('String', () => {
        it('should allow compound validation of string', () => {
            const schema = Validate
                .String()
                .notEmpty()
                .maxLength(20);

            expect(schema.validate(' ')).toStrictEqual(' ');

            expect(() => schema.validate('')).toThrow('cannotBeEmpty');
            expect(() => schema.validate('01234567890123456789+')).toThrow('tooLong');
        });

        // it('what would per function coersion look like?', () => {
        //     const schema = Validate
        //         .String()
        //         .notEmpty({ defaultValue: ' ' })
        //         .maxLength({ coerce: true });

        //     expect(schema.valudate('').toStrictEqual(' '));
        // });
    });

    describe('OneOf', () => {
        it('should allow the validation of either types', () => {
            const schema = Validate
                .OneOf([
                    Validate.String().notEmpty(),
                    Validate.Number().max(10)
                ]);

            expect(schema.validate(' ')).toBe(' ');
            expect(schema.validate(8)).toBe(8);

            expect(() => schema.validate('')).toThrowSubSchemaValidationError([
                'cannotBeEmpty',
                'notANumber'
            ]);
            expect(() => schema.validate(11)).toThrowSubSchemaValidationError([
                'notAString',
                'tooHigh'
            ]);
            expect(() => schema.validate({})).toThrowSubSchemaValidationError([
                'notAString',
                'notANumber'
            ]);
        });
    });

    describe('Objects', () => {
        it('should not allow additional properties', () => {
            const schema = Validate
                .Object({
                    name: Validate.String().notEmpty().isRequired(),
                    age: Validate.Number().min(18)
                }, {
                    allowAdditionalProperties: false
                });

            expect(schema.validate({ name: 'Bob', age: 23 })).toStrictEqual({ name: 'Bob', age: 23 });
            expect(schema.validate({ name: 'Alf', age: 75 })).toStrictEqual({ name: 'Alf', age: 75 });
            expect(schema.validate({ name: 'Greta', age: 92 })).toStrictEqual({ name: 'Greta', age: 92 });

            expect(() => schema.validate({ name: 'Liv', age: 17 })).toThrow('tooLow');
            expect(() => schema.validate({ name: '', age: 1 })).toThrow('cannotBeEmpty');
            expect(() => schema.validate({ age: 5 })).toThrow('required');
            expect(() => schema.validate({ name: 'Hi', age: 23, invalidProperty: false })).toThrow('unexpectedProperty');
        });

        it('should allow additional properties', () => {
            const schema = Validate
                .Object({
                    name: Validate.String().notEmpty(),
                    age: Validate.Number().min(18)
                }, {
                    allowAdditionalProperties: true
                });

            expect(schema.validate({ name: 'Hi', age: 23, invalidProperty: false }))
                .toStrictEqual({ name: 'Hi', age: 23, invalidProperty: false });
        });

        it('should report the name of the property that to validate', () => {
            const schema = Validate
                .Object({
                    name: Validate.Object({
                        first: Validate.String().notEmpty(),
                        last: Validate.String().notEmpty().isRequired()
                    })
                });

            try {
                schema.validate({ name: { first: 'Dave' } });
            } catch (error) {
                expect(error.errorType).toBe('required');
                expect(error.propertyName).toBe('name.last');
            }
        });
    });

    describe('Arrays', () => {
        it('should validate', () => {
            const schema = Validate
                .Array(Validate.Object({ id: Validate.Number().positive().isRequired() }))
                .notEmpty()
                .maxLength(4);

            expect(schema.validate([{ id: 1 }])).toStrictEqual([{ id: 1 }]);

            expect(() => schema.validate([])).toThrow('cannotBeEmpty');
            expect(() => schema.validate([{}])).toThrow('required');
            expect(() => schema.validate([
                { id: 1 },
                { id: 2 },
                { id: 3 },
                { id: 4 },
                { id: 5 }
            ])).toThrow('tooLong');
        });

        it('should coerce', () => {
            const schema = Validate
                .Array()
                .maxLength(4)
                .coerce()
                .isRequired();

            expect(schema.validate()).toStrictEqual([]);
        });

        it('should work with complex schema', () => {
            const schema = Validate
                .Array(
                    Validate.Object({
                        name: Validate.Object({
                            first: Validate.String(),
                            last: Validate.String()
                        }),
                        age: Validate.Number().min(18).max(99),
                        occupation: Validate.String().notEmpty()
                    })
                        .isRequired()
                )
                .notEmpty()
                .maxLength(4)
                .isRequired();

            expect(schema.validate([{
                name: {
                    first: 'David',
                    last: 'Jones'
                },
                age: 57,
                occupation: 'Computer Programmer'
            }])).toStrictEqual([{
                name: {
                    first: 'David',
                    last: 'Jones'
                },
                age: 57,
                occupation: 'Computer Programmer'
            }]);

            expect(() => schema.validate([{
                name: { first: 'David', last: 'Jones' },
                age: 57,
                occupation: ''
            }])).toThrow('cannotBeEmpty');
            expect(() => schema.validate([{
                name: {
                    first: 'David', last: 'Jones'
                },
                age: 17,
                occupation: 'Computer Programmer'
            }])).toThrow('tooLow');
        });
    });
});
