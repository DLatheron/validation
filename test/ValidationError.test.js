'use strict';

const { ValidationError } = require('../src/ValidationError');

describe('ValidationError', () => {
    describe('constructor', () => {
        it('should set the error message', () => {
            const _error = new ValidationError('message');

            expect(_error.message).toBe('message');
        });

        it('should set the error type', () => {
            const _error = new ValidationError('message');

            expect(_error.errorType).toBe('message');
        });

        it('should set the type', () => {
            const _error = new ValidationError('message', { type: 'type' });

            expect(_error.type).toBe('type');
        });

        it('should lookup and store the text of the error type', () => {
            const _error = new ValidationError('cannotBeEmpty');

            expect(_error.string).toBe('Cannot be empty');
        });
    });
});
