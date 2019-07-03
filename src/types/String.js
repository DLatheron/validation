'use strict';

const Any = require('./Any');

class _String extends Any {
    constructor() {
        super('string');

        this._defaultValue = '';

        return this.isString();
    }

    isString() {
        return this._register(
            (value) => {
                if (typeof value !== 'string') {
                    this._throwValidationFailure('Not a string');
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
        return this._register(
            (value) => {
                if (value.length === 0) {
                    this._throwValidationFailure('Cannot be empty');
                }
                return value;
            }
        );
    }

    minLength(minLength) {
        return this._register(
            (value) => {
                if (value.length < minLength) {
                    this._throwValidationFailure('Too short');
                }
                return value;
            }
        );
    }

    maxLength(maxLength) {
        return this._register(
            (value) => {
                if (value.length > maxLength) {
                    this._throwValidationFailure('Too long');
                }
                return value;
            }
        );
    }
}

module.exports = _String;
