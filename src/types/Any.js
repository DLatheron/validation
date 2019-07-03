'use strict';

const ValidationError = require('../ValidationError');

class Any {
    constructor(type) {
        this.type = type;

        this._validations = [];
        this._coersions = [];
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
        try {
            this._validate(value);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Validates the passed value and throws an error if it is not valid.
     * @param {Any} value The value to validate.
     */
    validateNoCatch(value) {
        this._validate(value);
    }

    /**
     * Validates the passed value and return undefined, or the reason that it
     * fails validation.
     * @param {Any} value The value to validate.
     * @returns {undefined|Error} Returns an Error if it fails validation.
     */
    validateWithErrors(value) {
        try {
            this._validate(value);
        } catch (error) {
            return error;
        }
    }

    /**
     * Validates the passed value and (if necessary) coerces it into being valid,
     * by any appropriate means, this might mean clamping a number or removing
     * elements from an array - if all else fails then it will replace the value
     * with its defaultValue.
     * @param {Any} value The value to coerce (mutates the original).
     * @returns {Any} The coerce value.
     */
    coerce(value) {
        try {
            return this._coerce(value);
        } catch (error) {
            return this._defaultValue;
        }
    }

    coerceNoCatch(value) {
        return this._coerce(value);
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

    _coerce(value) {
        const coersionStack = [...this._coersions];
        coersionStack.reverse();

        function recurseCoersions(value) {
            while (coersionStack.length > 0) {
                const coersion = coersionStack.pop();

                value = coersion(value, recurseCoersions);
            }

            return value;
        }

        if (value === undefined || value === null) {
            if (this._required) {
                return this._defaultValue || false;
            }
        }

        return recurseCoersions(value);
    }

    _register(validation, coersion) {
        this._validations.push(validation);
        this._coersions.push(coersion || validation);

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

    coerceValue() {
        this._coerceValue = true;
        return this;
    }

    noCoersion() {
    }

    cannotCoerse() {
        this._throwValidationFailure('Unable to coerse value with this type');
    }

    _throwValidationFailure(reason, additionalProperties) {
        throw new ValidationError(reason, {
            type: this.type,
            ...additionalProperties
        });
    }
}

module.exports = Any;
