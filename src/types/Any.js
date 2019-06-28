'use strict';

const ValidationError = require('../ValidationError');

class Any {
    constructor(type) {
        this.type = type;

        this.validations = [];
        this.coersions = [];
    }

    validate(value) {
        try {
            this._validate(value);
            return true;
        } catch (error) {
            return false;
        }
    }

    validateNoCatch(value) {
        this._validate(value);
    }

    validateWithErrors(value) {
        try {
            this._validate(value);
        } catch (error) {
            return error;
        }
    }

    coerce(value) {
        try {
            return this._coerce(value);
        } catch (error) {
            return false;
        }
    }

    coerceNoCatch(value) {
        return this._coerce(value);
    }

    _validate(value) {
        this.validations.forEach(validation => {
            value = validation(value);
        });
    }

    _coerce(value) {
        this.coersions.forEach(coersion => {
            value = coersion(value);
        });
        return value;
    }

    register(validation, coersion) {
        this.validations.push(validation);
        this.coersions.push(coersion || validation);

        return this;
    }

    noCoersion() {
    }

    cannotCoerse() {
        this.throwValidationFailure('Unable to coerse value with this type');
    }

    throwValidationFailure(reason, additionalProperties) {
        throw new ValidationError(reason, {
            type: this.type,
            ...additionalProperties
        });
    }
}

module.exports = Any;
