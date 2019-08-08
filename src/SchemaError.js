'use strict';

const SchemaErrorTypes = {
    optionalityAlreadyDefined: 'Schema attempts to define optionality more than once',
    missingSchema: 'A required schema is missing'
};

class SchemaError extends Error {
    constructor(errorType, { type, propertyName, errors } = {}) {
        super(errorType);

        this.errorType = errorType;
        this.type = type;
        this.string = SchemaErrorTypes[errorType];

        this.propertyNames = [];
        if (propertyName) {
            this.propertyNames.push(propertyName);
        }

        this.errors = errors;
    }

    addPropertyName(propertyName) {
        this.propertyNames.unshift(propertyName);
        this.resolve();
    }

    get propertyName() {
        return this.propertyNames.join('.');
    }
}

module.exports = {
    SchemaError,
    SchemaErrorTypes
};
