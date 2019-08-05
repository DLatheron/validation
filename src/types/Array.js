'use strict';

const Any = require('./Any');

class _Array extends Any {
    constructor(elementSchema) {
        if (!elementSchema) {
            elementSchema = new Any();
        }

        super('array');

        this._defaultValue = [];
        this._elementSchema = elementSchema;

        return this.isArray();
    }

    isArray() {
        return this._register(
            (value, next) => {
                if (!Array.isArray(value)) {
                    if (!this._coerceValue) {
                        return this._throwValidationFailure('notAnArray');
                    } else {
                        value = [value];
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

    notEmpty() {
        return this._register(
            value => {
                if (value.length === 0) {
                    return (this._isCoercing
                        ? this._defaultValue
                        : this._throwValidationFailure('cannotBeEmpty')
                    );
                }
                return value;
            }
        );
    }

    minLength(minLength) {
        return this._register(
            value => {
                if (value.length < minLength) {
                    return (this._isCoercing
                        ? this._defaultValue
                        : this._throwValidationFailure('tooShort')
                    );
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
