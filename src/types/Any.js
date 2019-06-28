'use strict';

class Any {
    constructor() {
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

    coerce(value) {
        try {
            return this._coerce(value);
        } catch (error) {
            return false;
        }
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
        throw new Error('Unable to coerse value with this type');
    }
}

module.exports = Any;
