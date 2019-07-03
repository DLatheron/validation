'use strict';

const Validate = require('../src/validation');

// TODO: How do we get the list of errors back???
// - Get back a list of properties that fail (depth-wise);

describe('validation', () => {
    it('should allow the validation of number types', () => {
        const schema = Validate
            .Number()
            .min(18)
            .max(99);

        expect(schema.validate(18)).toStrictEqual(true);
        expect(schema.validate(50)).toStrictEqual(true);
        expect(schema.validate(99)).toStrictEqual(true);

        expect(schema.validate(17)).toStrictEqual(false);
        expect(schema.validateWithErrors(17)).toMatchObject({ message: 'Too low' });

        expect(schema.validate(100)).toStrictEqual(false);
        expect(schema.validateWithErrors(100)).toMatchObject({ message: 'Too high' });
    });

    it('should allow the use of complex ranges', () => {
        const schema = Validate
            .Number()
            .ranges([{ max: 10 }, { min: 20, max: 30 }, { min: 40 }]);

        expect(schema.validate(-10)).toStrictEqual(true);
        expect(schema.validate(0)).toStrictEqual(true);
        expect(schema.validate(10)).toStrictEqual(true);
        expect(schema.validate(20)).toStrictEqual(true);
        expect(schema.validate(25)).toStrictEqual(true);
        expect(schema.validate(30)).toStrictEqual(true);
        expect(schema.validate(40)).toStrictEqual(true);
        expect(schema.validate(50)).toStrictEqual(true);

        expect(schema.validate(11)).toStrictEqual(false);
        expect(schema.validate(15)).toStrictEqual(false);
        expect(schema.validate(19)).toStrictEqual(false);
        expect(schema.validate(31)).toStrictEqual(false);
        expect(schema.validate(35)).toStrictEqual(false);
        expect(schema.validate(39)).toStrictEqual(false);
    });

    it('should coerce string into numbers', () => {
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

        expect(schema.validate(' ')).toStrictEqual(true);

        expect(schema.validate('')).toStrictEqual(false);
        expect(schema.validateWithErrors('')).toMatchObject({ message: 'Cannot be empty' });

        expect(schema.validate('01234567890123456789+')).toStrictEqual(false);
        expect(schema.validateWithErrors('01234567890123456789+')).toMatchObject({ message: 'Too long' });
    });

    it('should allow the validation of either types', () => {
        const schema = Validate
            .OneOf([
                Validate.String().notEmpty(),
                Validate.Number().max(10)
            ]);

        expect(schema.validate(' ')).toStrictEqual(true);
        expect(schema.validate(8)).toStrictEqual(true);

        expect(schema.validate('')).toStrictEqual(false);
        expect(schema.validate(11)).toStrictEqual(false);
        expect(schema.validate({})).toStrictEqual(false);
    });

    it('should allow the validation of objects', () => {
        const schema = Validate
            .Object({
                name: Validate.String().notEmpty(),
                age: Validate.Number().min(18)
            });

        // expect(schema.validate({ name: 'Bob', age: 23 })).toStrictEqual(true);
        // expect(schema.validate({ name: 'Alf', age: 75 })).toStrictEqual(true);
        // expect(schema.validate({ name: 'Greta', age: 92 })).toStrictEqual(true);

        expect(schema.validate({ name: 'Liv', age: 17 })).toStrictEqual(false);
        expect(schema.validateWithErrors(
            { name: 'Liv', age: 17 }
        )).toMatchObject(
            { message: 'Too low', propertyName: 'age' }
        );
        expect(schema.validate({ name: '', age: 1 })).toStrictEqual(false);
        expect(schema.validate({ age: 5 })).toStrictEqual(false);
        expect(schema.validate({ name: 'Hi', age: 23, invalidProperty: false })).toStrictEqual(false);
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

    it('should coerce arrays', () => {
        const schema = Validate
            .Array()
            .notEmpty()
            .maxLength(4);

        expect(schema.coerce()).toStrictEqual([]);
    });

    it('should value booleans', () => {
        const schema = Validate
            .Boolean()
            .is(true);

        expect(schema.validate(true)).toBe(true);
        expect(schema.coerce(23)).toBe(true);
        expect(schema.coerce('true')).toBe(true);
        expect(schema.coerce('1')).toBe(true);
        expect(schema.coerce('yes')).toBe(true);

        expect(schema.validate(false)).toBe(false);
        expect(schema.coerce('false')).toBe(undefined);
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

    it('should use defaultValue if coersion fails', () => {
        const schema = Validate
            .Number()
            .isRequired()
            .default(18);

        expect(schema.coerce(23)).toBe(23);
        expect(schema.coerce('37')).toBe(37);
        expect(schema.coerce(undefined)).toBe(18);
    });
});
