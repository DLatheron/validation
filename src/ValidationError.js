'use strict';

const ValidationErrorTypes = {
    notAString: 'Not a string',
    notAnArray: 'Not an array',
    notABoolean: 'Not a boolean',
    notANumber: 'Not a number',
    cannotBeEmpty: 'Cannot be empty',
    tooShort: 'Too short',
    tooLong: 'Too long',
    unexpectedProperty: 'Unexpected property',
    tooLow: 'Too low',
    tooHigh: 'Too high',
    notInRange: 'Not in range',
    tooLowForRange: 'Too low for range',
    tooHighForRange: 'Too high for range',
    notPositive: 'Not positive',
    notNegative: 'Not negative',
    nonZero: 'Is zero',
    notEven: 'Not even',
    notOdd: 'Not odd',
    aggregateError: 'Aggregate Error',
    required: 'Required value not specified',
    containsNonAlphaCharacters: 'Contains non-alpha characters',
    containsNonAlphaNumericCharacters: 'Contains non-alphanumeric characters',
    cannotConvertStringToBoolean: 'Cannot convert string into a boolean',
    unsupportedTypeForConversion: 'Unsupported type for conversion',
    notExpectedValue: 'Not equal to the expected value',
    cannotConvertObjectToJSON: 'Cannot convert object into JSON string',
    cannotConvertToString: 'Cannot convert value into a string'
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
