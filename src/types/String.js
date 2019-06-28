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

    minLength(minLen) {
        return this.register(
            (value) => {
                if (value.length < minLen) {
                    this.throwValidationFailure('Too short');
                }
                return value;
            }
        );
    }

    maxLength(maxLen) {
        return this.register(
            (value) => {
                if (value.length > maxLen) {
                    this.throwValidationFailure('Too long');
                }
                return value;
            }
        );
    }
}

module.exports = _String;
