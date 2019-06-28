'use strict';

class ValidationError extends Error {
    constructor(message, { propertyName, errors } = {}) {
        super(message);

        this.errors = errors;
        this.propertyNames = [];
        if (propertyName) {
            this.propertyNames.push(propertyName);
        }
    }

    addPropertyName(propertyName) {
        this.propertyNames.unshift(propertyName);
    }

    get propertyName() {
        return this.propertyNames.join('.');
    }
}

module.exports = ValidationError;
