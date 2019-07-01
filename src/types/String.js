'use strict';

const Any = require('./Any');

class _String extends Any {
    constructor() {
        super('string');

        return this.isString();
    }

    isString() {
        return this.register(
            (value) => {
                if (typeof value !== 'string') {
                    this.throwValidationFailure('Not a string');
                }
                return value;
            },
            (coerce) => {
                // eslint-disable-next-line no-new-wrappers
                return new String(coerce).valueOf();
            }
        );
    }

    notEmpty() {
        return this.register(
            (value) => {
                if (value.length === 0) {
                    this.throwValidationFailure('Cannot be empty');
                }
                return value;
            }
        );
    }

    minLength(minLength) {
        return this.register(
            (value) => {
                if (value.length < minLength) {
                    this.throwValidationFailure('Too short');
                }
                return value;
            }
        );
    }

    maxLength(maxLength) {
        return this.register(
            (value) => {
                if (value.length > maxLength) {
                    this.throwValidationFailure('Too long');
                }
                return value;
            }
        );
    }
}

module.exports = _String;
