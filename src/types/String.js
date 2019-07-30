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
                        this._throwValidationFailure('notAString');
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
                                this._throwValidationFailure('cannotConvertObjectToJSON');
                            }
                            break;

                        default:
                            if (typeof value.toString === 'function') {
                                return value.toString();
                            } else {
                                this._throwValidationFailure('cannotConvertToString');
                            }
                            break;
                    }
                }
            }
        );
    }

    notEmpty() {
        return this._register(
            value => {
                if (value.length === 0) {
                    this._throwValidationFailure('cannotBeEmpty');
                }
                return value;
            }
        );
    }

    minLength(minLength) {
        return this._register(
            value => {
                if (value.length < minLength) {
                    this._throwValidationFailure('tooShort');
                }
                return value;
            }
        );
    }

    maxLength(maxLength) {
        return this._register(
            value => {
                if (value.length > maxLength) {
                    this._throwValidationFailure('tooLong');
                }
                return value;
            }
        );
    }

    alpha() {
        return this._register(
            value => {
                const regex = /^[a-zA-Z]$/;
                if (!value.match(regex)) {
                    this._throwValidationFailure('containsNonAlphaCharacters');
                }
            }
        );
    }

    alphanum() {
        return this._register(
            value => {
                const regex = /^[a-zA-Z0-9]$/;
                if (!value.match(regex)) {
                    this._throwValidationFailure('containsNonAlphaNumericCharacters');
                }
            }
        );
    }
}

module.exports = _String;
