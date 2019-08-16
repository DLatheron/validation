'use strict';

const Any = require('./Any');

// TODO:
// - length(x);
// - ordered(byProperty);
// - unique();
// - excludes();
// - known();
// - unknown();
// - notSparse();

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
                        return this._throwValidationError('notAnArray');
                    } else {
                        value = [value];
                    }
                }

                value = next(value);

                value.forEach(v => {
                    this._elementSchema.validate(v);
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
                        : this._throwValidationError('cannotBeEmpty')
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
                        : this._throwValidationError('tooShort')
                    );
                }
                return value;
            }
        );
    }

    maxLength(maxLength) {
        return this._register(
            value => {
                if (value.length > maxLength) {
                    return (this._isCoercing
                        ? value.slice(0, maxLength)
                        : this._throwValidationError('tooLong')
                    );
                }
                return value;
            }
        );
    }
}

module.exports = _Array;
