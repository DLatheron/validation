'use strict';

const _OneOf = require('../../src/types/OneOf');
const _String = require('../../src/types/String');
const _Number = require('../../src/types/Number');

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
});
