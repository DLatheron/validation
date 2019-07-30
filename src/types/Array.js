'use strict';

const Any = require('./Any');
const { ValidationErrorTypes } = require('../ValidationError');

class _Array extends Any {
    constructor(schema) {
        super('array');

        this._defaultValue = [];

        return this.isArray(schema);
    }

    // CanCoerce: cast existing value to array?
    isArray(schema) {
        return this._register(
            (value, next) => {
                if (!Array.isArray(value)) {
                    this._throwValidationFailure(ValidationErrorTypes.notAnArray);
                }

                value = next(value);

                value.forEach(v => {
                    schema._validate(v);
                });

                return value;
            },
            (value, next) => {
                if (!Array.isArray(value)) {
                    value = [];
                }

                value = next(value);

                value.forEach((v) => {
                    schema._validate(v);
                });

                return value;
            }
        );
    }

    // CanCoerce: empty array.
    notEmpty() {
        return this._register(
            (value) => {
                if (value.length === 0) {
                    this._throwValidationFailure(ValidationErrorTypes.cannotBeEmpty);
                }
                return value;
            },
            (coerce) => {
                return coerce || [];
            }
        );
    }

    // CanCoerce: Add any default objects?
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

    // CanCoerce: Remove additional elements?
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
}

module.exports = _Array;
