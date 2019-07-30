'use strict';

const Validate = require('../src/validation');
const { ValidationError, ValidationErrorTypes } = require('../src/ValidationError');

// TODO: How do we get the list of errors back???
// - Get back a list of properties that fail (depth-wise);

describe('validation', () => {
    it('should allow the validation of number types', () => {
        const schema = Validate
            .Number()
            .min(18)
            .max(99);

        expect(schema.validate(18)).toStrictEqual(18);
        expect(schema.validate(50)).toStrictEqual(50);
        expect(schema.validate(99)).toStrictEqual(99);

        expect(() => schema.validate(17)).toThrow(
            new ValidationError(
                ValidationErrorTypes.tooLow, {
                    type: 'number'
                }
            )
        );
        expect(() => schema.validate(100)).toThrow(
            new ValidationError(
                ValidationErrorTypes.tooHigh, {
                    type: 'number'
                }
            )
        );
    });

    it('should allow the use of complex ranges', () => {
        const schema = Validate
            .Number()
            .ranges([{ max: 10 }, { min: 20, max: 30 }, { min: 40 }]);

        expect(schema.validate(-10)).toStrictEqual(-10);
        expect(schema.validate(0)).toStrictEqual(0);
        expect(schema.validate(10)).toStrictEqual(10);
        expect(schema.validate(20)).toStrictEqual(20);
        expect(schema.validate(25)).toStrictEqual(25);
        expect(schema.validate(30)).toStrictEqual(30);
        expect(schema.validate(40)).toStrictEqual(40);
        expect(schema.validate(50)).toStrictEqual(50);

        expect(() => schema.validate(11)).toThrow(
            new ValidationError(
                ValidationErrorTypes.notInRange, {
                    type: 'number'
                }
            )
        );
        expect(() => schema.validate(15)).toThrow(
            new ValidationError(
                ValidationErrorTypes.notInRange, {
                    type: 'number'
                }
            )
        );
        expect(() => schema.validate(19)).toThrow(
            new ValidationError(
                ValidationErrorTypes.notInRange, {
                    type: 'number'
                }
            )
        );
        expect(() => schema.validate(31)).toThrow(
            new ValidationError(
                ValidationErrorTypes.notInRange, {
                    type: 'number'
                }
            )
        );
        expect(() => schema.validate(35)).toThrow(
            new ValidationError(
                ValidationErrorTypes.notInRange, {
                    type: 'number'
                }
            )
        );
        expect(() => schema.validate(39)).toThrow(
            new ValidationError(
                ValidationErrorTypes.notInRange, {
                    type: 'number'
                }
            )
        );
    });

    it.skip('should coerce string into numbers', () => {
        const schema = Validate
            .Number()
            .positive()
            .even();

        expect(schema.coerce('10')).toStrictEqual(10);
    });

    it('should allow the validation of string types', () => {
        const schema = Validate
            .String()
            .notEmpty()
            .maxLength(20);

        expect(schema.validate(' ')).toStrictEqual(' ');

        expect(() => schema.validate('')).toThrow(
            new ValidationError(
                ValidationErrorTypes.cannotBeEmpty, {
                    type: 'string'
                }
            )
        );
        expect(() => schema.validate('01234567890123456789+')).toThrow(
            new ValidationError(
                ValidationErrorTypes.tooLong, {
                    type: 'string'
                }
            )
        );
    });

    it('should allow the validation of either types', () => {
        const schema = Validate
            .OneOf([
                Validate.String().notEmpty(),
                Validate.Number().max(10)
            ]);

        expect(schema.validate(' ')).toStrictEqual(' ');
        expect(schema.validate(8)).toStrictEqual(8);

        expect(() => schema.validate('')).toThrow(
            new ValidationError(
                ValidationErrorTypes.aggregateError, {
                    type: 'string'
                }
            )
        );
        expect(() => schema.validate(11)).toThrow(
            new ValidationError(
                ValidationErrorTypes.aggregateError, {
                    type: 'number'
                }
            )
        );
        expect(() => schema.validate({})).toThrow(
            new ValidationError(
                ValidationErrorTypes.aggregateError, {
                    type: 'string'
                }
            )
        );
    });

    it.only('should allow the validation of objects', () => {
        const schema = Validate
            .Object({
                name: Validate.String().notEmpty().isRequired(),
                age: Validate.Number().min(18)
            });

        expect(schema.validate({ name: 'Bob', age: 23 })).toStrictEqual({ name: 'Bob', age: 23 });
        expect(schema.validate({ name: 'Alf', age: 75 })).toStrictEqual({ name: 'Alf', age: 75 });
        expect(schema.validate({ name: 'Greta', age: 92 })).toStrictEqual({ name: 'Greta', age: 92 });

        expect(() => schema.validate({ name: 'Liv', age: 17 })).toThrow('"age" is too low');
        expect(() => schema.validate({ name: '', age: 1 })).toThrow('Cannot be empty');
        expect(() => schema.validate({ age: 5 })).toThrow('Required value not specified');
        expect(() => schema.validate({ name: 'Hi', age: 23, invalidProperty: false })).toThrow('unexpectedProperty');
    });

    it('should allow the validation of objects with additional properties', () => {
        const schema = Validate
            .Object({
                name: Validate.String().notEmpty(),
                age: Validate.Number().min(18)
            }, { allowAdditionalProperties: true });

        expect(schema.validate({ name: 'Hi', age: 23, invalidProperty: false })).toStrictEqual(true);
    });

    it('should report the name of the property that fails', () => {
        const schema = Validate
            .Object({
                name: Validate.Object({
                    first: Validate.String().notEmpty(),
                    last: Validate.String().notEmpty().isRequired()
                })
            });

        expect(schema.validateWithErrors(
            { name: { first: 'Dave' } }
        )).toMatchObject(
            { message: 'Required value not specified', propertyName: 'name.last' }
        );
    });

    it('should evaluate arrays', () => {
        const schema = Validate
            .Array(Validate.Object({ id: Validate.Number().positive().isRequired() }))
            .notEmpty()
            .maxLength(4);

        expect(schema.validate([{ id: 1 }])).toStrictEqual(true);

        expect(schema.validate([])).toStrictEqual(false);
        expect(schema.validate([{}])).toStrictEqual(false);
        expect(schema.validate([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }])).toStrictEqual(false);
    });

    it.skip('should coerce arrays', () => {
        const schema = Validate
            .Array()
            .notEmpty()
            .maxLength(4);

        expect(schema.coerce()).toStrictEqual([]);
    });

    it.skip('should value booleans', () => {
        const schema = Validate
            .Boolean()
            .is(true);

        expect(schema.validate(true)).toBe(true);
        expect(schema.coerce(23)).toBe(true);
        expect(schema.coerce('true')).toBe(true);
        expect(schema.coerce('1')).toBe(true);
        expect(schema.coerce('yes')).toBe(true);

        expect(schema.validate(false)).toBe(false);
        expect(schema.coerce('false')).toBe(false);
    });

    it('should validate optional values', () => {
        const schema = Validate
            .Boolean()
            .isOptional();

        expect(schema.validate(true)).toBe(true);
        expect(schema.validate(false)).toBe(true);
        expect(schema.validate(null)).toBe(true);
        expect(schema.validate(undefined)).toBe(true);
    });

    it('should validate required values', () => {
        const schema = Validate
            .Boolean()
            .isRequired();

        expect(schema.validate(true)).toBe(true);
        expect(schema.validate(false)).toBe(true);

        expect(schema.validate(null)).toBe(false);
        expect(schema.validate(undefined)).toBe(false);
    });

    it.skip('should use the value specified as a default if coersion fails', () => {
        const schema = Validate
            .Number()
            .isRequired()
            .default(18);

        expect(schema.coerce(23)).toBe(23);
        expect(schema.coerce('37')).toBe(37);
        expect(schema.coerce(undefined)).toBe(18);
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
        }])).toBe(true);

        expect(schema.validate([{
            name: { first: 'David', last: 'Jones' },
            age: 57,
            occupation: ''
        }])).toBe(false);
        expect(schema.validate([{
            name: {
                first: 'David', last: 'Jones'
            },
            age: 17,
            occupation: 'Computer Programmer'
        }])).toBe(false);
    });
});

// IDEA:
// - Can we unify validation and coersion?
//   - It will mean that we add mutation to the original value... (could deepClone before hand???)
//   - Have a default value per type... that sets the default and then proceeds to validate... so:

/*

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

If it fails validation then we should just throw an error.
In the case of coersion that error is caught at the Validate.xxxx level and
turned into a valid value.

Validation then continues until it can't coerce or it completes...

So:

name: Validation.String()[.isOptional()]                // Must be a string, null or undefined.
name: Validation.String().isRequired()                  // Must be a string.
name: Validation.String().default('a')[.isOptional()]   // Optional, but replaced with 'a' if not rovided
name: Validation.String().default('a').isRequired()     // Makes no sense.
name: Validation.String().default(defaultValue = '')    // Sets default to default for a string (empty string).

That works fine - but how do we coerce a range?
- Have different operations?
  e.g.
  - range({ min, max }) and clampRange({ min, max })?
  - positive() and makePositive()?
  - generically transform(value => value)?
  -

*/
