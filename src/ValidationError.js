'use strict';

const ValidationErrorTypes = {
    unexpectedProperty: `Unexpected property "{propertyName}"`,
    tooLow: `"{propertyName}" is too low`
};

class ValidationError extends Error {
    constructor(errorType, { type, propertyName, errors } = {}) {
        super();

        this.errorType = errorType;
        this.type = type;

        this.propertyNames = [];
        if (propertyName) {
            this.propertyNames.push(propertyName);
        }

        this.errors = errors;

        this.resolve();
    }

    addPropertyName(propertyName) {
        this.propertyNames.unshift(propertyName);
        this.resolve();
    }

    get propertyName() {
        return this.propertyNames.join('.');
    }

    resolve() {
        this.message = this.message || ValidationErrorTypes[this.errorType] || '';
        if (this.propertyName) {
            this.message = this.message.replace('{propertyName}', this.propertyName);
        }
        this.message = this.message.replace('{type}', this.type);
    }
}

module.exports = {
    ValidationError,
    ValidationErrorTypes
};
