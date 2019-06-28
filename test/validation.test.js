'use strict';

const Validate = require('../src/validation');

// TODO: How do we get the list of errors back???

describe('validation', () => {
    it('should allow the validation of number types', () => {
        const schema = Validate
            .Number()
            .min(18)
            .max(99);

        expect(schema.validate(17)).toStrictEqual(false);
        expect(schema.validate(18)).toStrictEqual(true);
        expect(schema.validate(50)).toStrictEqual(true);
        expect(schema.validate(99)).toStrictEqual(true);
        expect(schema.validate(100)).toStrictEqual(false);
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
        expect(schema.validate('01234567890123456789+')).toStrictEqual(false);
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

        expect(schema.validate({ name: 'Bob', age: 23 })).toStrictEqual(true);
        expect(schema.validate({ name: 'Alf', age: 75 })).toStrictEqual(true);
        expect(schema.validate({ name: 'Greta', age: 92 })).toStrictEqual(true);

        expect(schema.validate({ name: 'Liv', age: 17 })).toStrictEqual(false);
        expect(schema.validate({ name: '', age: 1 })).toStrictEqual(false);
        expect(schema.validate({ age: 5 })).toStrictEqual(false);
        expect(schema.validate({ name: 'Hi', age: 23, invalidProperty: false })).toStrictEqual(false);
    })
});