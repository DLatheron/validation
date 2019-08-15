'use strict';

const SchemaErrorTypes = {
    optionalityAlreadyDefined: 'Schema attempts to define optionality more than once',
    missingSchema: 'A required schema is missing'
};

class SchemaError extends Error {
    constructor(errorType) {
        super(errorType);

        this.errorType = errorType;
        this.string = SchemaErrorTypes[errorType];
    }
}

module.exports = {
    SchemaError,
    SchemaErrorTypes
};
