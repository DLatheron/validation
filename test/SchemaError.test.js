'use strict';

const { SchemaError } = require('../src/SchemaError');

describe('ValidationError', () => {
    describe('constructor', () => {
        it('should set the error message', () => {
            const _error = new SchemaError('message');

            expect(_error.message).toBe('message');
        });

        it('should set the error type', () => {
            const _error = new SchemaError('message');

            expect(_error.errorType).toBe('message');
        });

        it('should lookup and store the text of the error type', () => {
            const _error = new SchemaError('optionalityAlreadyDefined');

            expect(_error.string).toBe('Schema attempts to define optionality more than once');
        });
    });
});
