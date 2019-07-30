'use strict';

const Any = require('./Any');
const { merge } = require('lodash');

const defaultOptions = {
    json: {
        indent: 0
    }
};

class _String extends Any {
    constructor(strict = true, options = {}) {
        super('string');

        this._defaultValue = '';
        this._options = merge({}, defaultOptions, options);

        return (strict
            ? this.isString()
            : this.toString()
        );
    }

    isString() {
        return this._register(
            value => {
                if (typeof value !== 'string') {
                    this._throwValidationFailure('notAString');
                }
                return value;
            }
        );
    }

    toString() {
        return this._register(
            value => {
                switch (typeof value) {
                    case 'string':
                        return value;

                    case 'object':
                        try {
                            return JSON.stringify(value, null, this._options.json.indent);
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
