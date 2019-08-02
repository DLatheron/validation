'use strict';

const Validate = require('../src/validation');

// TODO: How do we get the list of errors back???
// - Get back a list of properties that fail (depth-wise);
// - Make required pull a validator in a position 0... then it will be
//   required UNLESS coersion is enabled...

describe('validation', () => {
    it('should allow the validation of number types', () => {
        const schema = Validate
            .Number()
            .min(18)
            .max(99);

        expect(schema.validate(18)).toStrictEqual(18);
        expect(schema.validate(50)).toStrictEqual(50);
        expect(schema.validate(99)).toStrictEqual(99);

        expect(() => schema.validate(17)).toThrow('tooLow');
        expect(() => schema.validate(100)).toThrow('tooHigh');
    });

    // it('should allow the use of complex ranges', () => {
    //     const schema = Validate
    //         .Number()
    //         .ranges([{ max: 10 }, { min: 20, max: 30 }, { min: 40 }]);

    //     expect(schema.validate(-10)).toStrictEqual(-10);
    //     expect(schema.validate(0)).toStrictEqual(0);
    //     expect(schema.validate(10)).toStrictEqual(10);
    //     expect(schema.validate(20)).toStrictEqual(20);
    //     expect(schema.validate(25)).toStrictEqual(25);
    //     expect(schema.validate(30)).toStrictEqual(30);
    //     expect(schema.validate(40)).toStrictEqual(40);
    //     expect(schema.validate(50)).toStrictEqual(50);

    //     expect(() => schema.validate(11)).toThrow('notInRange');
    //     expect(() => schema.validate(15)).toThrow('notInRange');
    //     expect(() => schema.validate(19)).toThrow('notInRange');
    //     expect(() => schema.validate(31)).toThrow('notInRange');
    //     expect(() => schema.validate(35)).toThrow('notInRange');
    //     expect(() => schema.validate(39)).toThrow('notInRange');
    // });

    it('should coerce a string into numbers', () => {
        const schema = Validate
            .Number()
            .positive()
            .even()
            .coerce();

        expect(schema.validate('10')).toStrictEqual(10);
    });

    it('should coerce objects into strings', () => {
        const schema = Validate
            .String()
            .coerce();

        expect(schema.validate({ bool: true })).toStrictEqual('{"bool":true}');
    });

    it('should coerce objects into strings', () => {
        const schema = Validate
            .String()
            .coerce({ json: { indent: 4 } });

        expect(schema.validate({ bool: true })).toStrictEqual('{\n    "bool": true\n}');
    });

    it('should allow the validation of string types', () => {
        const schema = Validate
            .String()
            .notEmpty()
            .maxLength(20);

        expect(schema.validate(' ')).toStrictEqual(' ');

        expect(() => schema.validate('')).toThrow('cannotBeEmpty');
        expect(() => schema.validate('01234567890123456789+')).toThrow('tooLong');
    });

    it('should allow the validation of either types', () => {
        const schema = Validate
            .OneOf([
                Validate.String().notEmpty(),
                Validate.Number().max(10)
            ]);

        expect(schema.validate(' ')).toStrictEqual(' ');
        expect(schema.validate(8)).toStrictEqual(8);

        expect(() => schema.validate('')).toThrow('aggregateError');
        expect(() => schema.validate(11)).toThrow('aggregateError');
        expect(() => schema.validate({})).toThrow('aggregateError');
    });

    it('should allow the validation of objects', () => {
        const schema = Validate
            .Object({
                name: Validate.String().notEmpty().isRequired(),
                age: Validate.Number().min(18)
            });

        expect(schema.validate({ name: 'Bob', age: 23 })).toStrictEqual({ name: 'Bob', age: 23 });
        expect(schema.validate({ name: 'Alf', age: 75 })).toStrictEqual({ name: 'Alf', age: 75 });
        expect(schema.validate({ name: 'Greta', age: 92 })).toStrictEqual({ name: 'Greta', age: 92 });

        expect(() => schema.validate({ name: 'Liv', age: 17 })).toThrow('tooLow');
        expect(() => schema.validate({ name: '', age: 1 })).toThrow('cannotBeEmpty');
        expect(() => schema.validate({ age: 5 })).toThrow('required');
        expect(() => schema.validate({ name: 'Hi', age: 23, invalidProperty: false })).toThrow('unexpectedProperty');
    });

    it('should allow the validation of objects with additional properties', () => {
        const schema = Validate
            .Object({
                name: Validate.String().notEmpty(),
                age: Validate.Number().min(18)
            }, { allowAdditionalProperties: true });

        expect(schema.validate({
            name: 'Hi',
            age: 23,
            invalidProperty: false
        })).toStrictEqual({
            name: 'Hi',
            age: 23,
            invalidProperty: false
        });
    });

    it('should report the name of the property that fails', () => {
        const schema = Validate
            .Object({
                name: Validate.Object({
                    first: Validate.String().notEmpty(),
                    last: Validate.String().notEmpty().isRequired()
                })
            });

        expect(() => schema.validate({ name: { first: 'Dave' } })).toThrow('required');
    });

    it('should evaluate arrays', () => {
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

    it('should coerce arrays', () => {
        const schema = Validate
            .Array()
            .maxLength(4)
            .coerce()
            .isRequired();

        expect(schema.validate()).toStrictEqual([]);
    });

    it('should coerce arrays (even if the array is not empty)?', () => {
        const schema = Validate
            .Array(Validate.String().default('*Empty*'))
            .notEmpty()
            .maxLength(4)
            .coerce()
            .isRequired();

        expect(schema.validate()).toStrictEqual(['*Empty*']);
    });

    it('should coerce value to booleans', () => {
        const schema = Validate
            .Boolean()
            .coerce();

        expect(schema.validate(true)).toBe(true);
        expect(schema.validate(23)).toBe(true);
        expect(schema.validate('true')).toBe(true);
        expect(schema.validate('1')).toBe(true);
        expect(schema.validate('yes')).toBe(true);

        expect(schema.validate(false)).toBe(false);
        expect(schema.validate('false')).toBe(false);
    });

    it('should validate optional values', () => {
        const schema = Validate
            .Boolean()
            .isOptional();

        expect(schema.validate(true)).toBe(true);
        expect(schema.validate(false)).toBe(false);
        expect(schema.validate(null)).toBe(null);
        expect(schema.validate(undefined)).toBe(undefined);
    });

    it('should validate required values', () => {
        const schema = Validate
            .Boolean()
            .isRequired();

        expect(schema.validate(true)).toBe(true);
        expect(schema.validate(false)).toBe(false);

        expect(() => schema.validate(null)).toThrow('required');
        expect(() => schema.validate(undefined)).toThrow('required');
    });

    it('should use the value specified as a default if coersion fails', () => {
        const schema = Validate
            .Number()
            .isRequired()
            .coerce()
            .default(18);

        expect(schema.validate(23)).toBe(23);
        expect(schema.validate('37')).toBe(37);
        expect(schema.validate(undefined)).toBe(18);
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
