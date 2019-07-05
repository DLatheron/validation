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
                if (typeof coerce === 'object') {
                    try {
                        return JSON.stringify(coerce);
                    } catch (error) {
                        this._throwValidationFailure('Unable to coerce value to a JSON string');
                    }
                } else if (typeof coerce.toString === 'function') {
                    return coerce.toString();
                } else {
                    this._throwValidationFailure('Unable to coerce value to a string');
                }
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

    alpha() {
        return this._register(
            (value) => {
                const regex = /^[a-zA-Z]$/;
                if (!value.match(regex)) {
                    this._throwValidationFailure('Contains non-alpha characters');
                }
            }
        );
    }

    alphanum() {
        return this._register(
            (value) => {
                const regex = /^[a-zA-Z0-9]$/;
                if (!value.match(regex)) {
                    this._throwValidationFailure('Contains non-alphanumeric characters');
                }
            }
        );
    }
}

module.exports = _String;
