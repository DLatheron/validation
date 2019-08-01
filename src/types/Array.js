'use strict';

const Any = require('./Any');

class _Array extends Any {
    constructor(elementSchema = new Any()) {
        super('array');

        if (!elementSchema) {
            return this._throwSchemaError('missingSchema');
        }

        this._defaultValue = [];
        this._elementSchema = elementSchema;

        return this.isArray();
    }

    // CanCoerce: cast existing value to array?
    isArray() {
        return this._register(
            (value, next) => {
                if (!Array.isArray(value)) {
                    if (!this._coerceValue) {
                        return this._throwValidationFailure('notAnArray');
                    } else {
                        value = [];
                    }
                }

                value = next(value);

                value.forEach(v => {
                    this._elementSchema._validate(v);
                });

                return value;
            }
        );
    }

    // TODO: How do we coerce an non-empty array???
    notEmpty() {
        return this._register(
            value => {
                if (value.length === 0) {
                    if (this._coerceValue) {
                        value.push(this._elementSchema._defaultValue);
                    } else {
                        return this._throwValidationFailure('cannotBeEmpty');
                    }
                }
                return value;
            }
        );
    }

    // CanCoerce: Add any default objects?
    minLength(minLength) {
        return this._register(
            value => {
                if (value.length < minLength) {
                    return this._throwValidationFailure('tooShort');
                }
                return value;
            }
        );
    }

    // CanCoerce: Remove additional elements?
    maxLength(maxLength) {
        return this._register(
            value => {
                if (value.length > maxLength) {
                    return this._throwValidationFailure('tooLong');
                }
                return value;
            }
        );
    }
}

module.exports = _Array;
