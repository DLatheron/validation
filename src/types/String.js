'use strict';

const Any = require('./Any');

class _String extends Any {
    constructor() {
        super('string');

        this._defaultValue = '';
        this._coersionOptions = {
            json: {
                indent: 0
            }
        };

        return this.isString();
    }

    isString() {
        return this._register(
            value => {
                if (!this._coerceValue) {
                    if (typeof value !== 'string') {
                        return this._throwValidationFailure('notAString');
                    }
                    return value;
                } else {
                    switch (typeof value) {
                        case 'string':
                            return value;

                        case 'object':
                            try {
                                return JSON.stringify(value, null, this._coersionOptions.json.indent);
                            } catch (error) {
                                return this._throwValidationFailure('cannotConvertObjectToJSON');
                            }

                        default:
                            return value.toString();
                    }
                }
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

    maxLength(maxLength) {
        return this._register(
            value => {
                if (value.length > maxLength) {
                    return (this._isCoercing
                        ? value.slice(0, maxLength)
                        : this._throwValidationFailure('tooLong')
                    );
                }
                return value;
            }
        );
    }

    alpha() {
        return this._register(
            value => {
                const regex = /[^a-zA-Z]/;
                if (value.match(regex)) {
                    return (this._isCoercing
                        ? this._defaultValue
                        : this._throwValidationFailure('containsNonAlphaCharacters')
                    );
                }
                return value;
            }
        );
    }

    // TODO: alphanum or alphaNum?
    alphanum() {
        return this._register(
            value => {
                const regex = /[^a-zA-Z0-9]/;
                if (value.match(regex)) {
                    return (this._isCoercing
                        ? this._defaultValue
                        : this._throwValidationFailure('containsNonAlphaNumericCharacters')
                    );
                }
                return value;
            }
        );
    }
}

module.exports = _String;
