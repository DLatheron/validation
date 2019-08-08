'use strict';

const { ValidationError } = require('../ValidationError');
const { merge } = require('lodash');
const { SchemaError } = require('../SchemaError');

class Any {
    constructor(type) {
        this._type = type;

        this._validations = [];
        this._required = undefined;
        this._defaultValue = undefined;
        this._coerceValue = false;
        this._coersionOptions = {};
    }

    /**
     * Validates the passed value and returns true if was valid, or false
     * otherwise.
     * @param {Any} value The value to validate.
     * @returns {Boolean} True if the value validates against the schema, otherwise
     * false.
     */
    validate(value) {
        const validationStack = [...this._validations];
        validationStack.reverse();

        function recurseValidations(value) {
            while (validationStack.length > 0) {
                const validation = validationStack.pop();

                value = validation(value, recurseValidations);
            }

            return value;
        }

        if (value === undefined || value === null) {
            if (!this._required) {
                return value;
            }
        }

        return recurseValidations(value);
    }

    _register(validation) {
        this._validations.push(validation);

        return this;
    }

    _registerFirst(validation) {
        this._validations.unshift(validation);

        return this;
    }

    isOptional() {
        if (this._required !== undefined) {
            return this._throwSchemaError('optionalityAlreadyDefined');
        }

        this._required = false;

        return this;
    }

    isRequired() {
        if (this._required !== undefined) {
            return this._throwSchemaError('optionalityAlreadyDefined');
        }

        this._required = true;

        return this._registerFirst(
            value => {
                if (value === undefined || value === null) {
                    if (this._coerceValue) {
                        return this._defaultValue;
                    } else {
                        return this._throwValidationError('required');
                    }
                }
                return value;
            }
        );
    }

    default(defaultValue) {
        this._defaultValue = defaultValue;
        return this;
    }

    coerce(options) {
        this._coerceValue = true;
        this._coersionOptions = merge(this._coersionOptions, options);
        return this;
    }

    _throwValidationError(reason, additionalProperties) {
        throw new ValidationError(reason, {
            type: this._type,
            ...additionalProperties
        });
    }

    _throwSchemaError(reason, additionalProperties) {
        throw new SchemaError(reason, {
            ...additionalProperties
        });
    }

    get _isCoercing() {
        return this._coerceValue;
    }
}

module.exports = Any;
