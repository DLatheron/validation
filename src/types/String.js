'use strict';

const Any = require('./Any');

// TODO:
// - base64;
// - creditCard;
// - dataUri;
// - domain;
// - email;
// - guid;
// - hex;
// - hexAligned(x) - Hex value must be aligned to x bytes;
// - hostname;
// - ipv4;
// - ipv6;
// - ipv(4|6);
// - isoDate;
// - isoDuration;
// - lowercase;
// - uppercase;
// - normalize???
// - token;
// - pattern;
// - truncate;
// x trim;
// - uri;
// - uriRelative;
// - uppercase;

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
                        return this._throwValidationError('notAString');
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
                                return this._throwValidationError('cannotConvertObjectToJSON');
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

    alpha() {
        return this._register(
            value => {
                const regex = /[^a-zA-Z]/;
                if (value.match(regex)) {
                    return (this._isCoercing
                        ? this._defaultValue
                        : this._throwValidationError('containsNonAlphaCharacters')
                    );
                }
                return value;
            }
        );
    }

    alphaNum() {
        return this._register(
            value => {
                const regex = /[^a-zA-Z0-9]/;
                if (value.match(regex)) {
                    return (this._isCoercing
                        ? this._defaultValue
                        : this._throwValidationError('containsNonAlphaNumericCharacters')
                    );
                }
                return value;
            }
        );
    }

    // TODO: Current behaviour is to coerce ANY string that needs trimming - ALWAYS.
    trim(coerce) {
        return this._register(
            value => {
                const trimmed = value.trim();
                if (trimmed !== value) {
                    return (this._isCoercing || coerce
                        ? trimmed
                        : this._throwValidationError('needsTrimming'));
                }
                return value.trim();
            }
        );
    }

    upperCase(coerce) {
        return this._register(
            value => {
                const upperCase = value.toUpperCase();
                if (value !== upperCase) {
                    return (this._isCoercing || coerce
                        ? upperCase
                        : this._throwValidationError('notUpperCase'));
                }
                return value;
            }
        );
    }

    lowerCase(coerce) {
        return this._register(
            value => {
                const lowerCase = value.toLowerCase();
                if (value !== lowerCase) {
                    return (this._isCoercing || coerce
                        ? lowerCase
                        : this._throwValidationError('notLowerCase'));
                }
                return value;
            }
        );
    }
}

module.exports = _String;
