'use strict';

const Any = require('./Any');
const { ValidationErrorTypes } = require('../ValidationError');

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
                    this._throwValidationFailure(ValidationErrorTypes.notAString);
                }
                return value;
            },
            (coerce) => {
                if (typeof coerce === 'object') {
                    try {
                        return JSON.stringify(coerce);
                    } catch (error) {
                        this._throwValidationFailure(ValidationErrorTypes.cannotConvertObjectToJSON);
                    }
                } else if (typeof coerce.toString === 'function') {
                    return coerce.toString();
                } else {
                    this._throwValidationFailure(ValidationErrorTypes.cannotConvertToString);
                }
            }
        );
    }

    notEmpty() {
        return this._register(
            (value) => {
                if (value.length === 0) {
                    this._throwValidationFailure(ValidationErrorTypes.cannotBeEmpty);
                }
                return value;
            }
        );
    }

    minLength(minLength) {
        return this._register(
            (value) => {
                if (value.length < minLength) {
                    this._throwValidationFailure(ValidationErrorTypes.tooShort);
                }
                return value;
            }
        );
    }

    maxLength(maxLength) {
        return this._register(
            (value) => {
                if (value.length > maxLength) {
                    this._throwValidationFailure(ValidationErrorTypes.tooLong);
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
                    this._throwValidationFailure(ValidationErrorTypes.containsNonAlphaCharacters);
                }
            }
        );
    }

    alphanum() {
        return this._register(
            (value) => {
                const regex = /^[a-zA-Z0-9]$/;
                if (!value.match(regex)) {
                    this._throwValidationFailure(ValidationErrorTypes.containsNonAlphaNumericCharacters);
                }
            }
        );
    }
}

module.exports = _String;
