'use strict';

const ValidationError = require('../ValidationError');

class Any {
    constructor(type) {
        this._type = type;

        this._validations = [];
        this._required = false;
        this._defaultValue = undefined;
        this._coerceValue = false;
    }

    /**
     * Validates the passed value and returns true if was valid, or false
     * otherwise.
     * @param {Any} value The value to validate.
     * @returns {Boolean} True if the value validates against the schema, otherwise
     * false.
     */
    validate(value) {
        return this._validate(value);
    }

    _validate(value) {
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
            if (this._required) {
                this._throwValidationFailure('Required value not specified');
            } else {
                return value;
            }
        }

        return recurseValidations(value);
    }

    _register(validation) {
        this._validations.push(validation);

        return this;
    }

    isOptional() {
        this._required = false;
        return this;
    }

    isRequired() {
        this._required = true;
        return this;
    }

    default(defaultValue) {
        this._defaultValue = defaultValue;
        return this;
    }

    _throwValidationFailure(reason, additionalProperties) {
        throw new ValidationError(reason, {
            type: this._type,
            ...additionalProperties
        });
    }
}

module.exports = Any;
