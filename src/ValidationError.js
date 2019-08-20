'use strict';

const { flatten } = require('lodash');

const ValidationErrorTypes = {
    notAString: 'Not a string',
    notAnArray: 'Not an array',
    notABoolean: 'Not a boolean',
    notANumber: 'Not a number',
    notAFunction: ' Not a function',
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
    containsNonAlphaNumericCharacters: 'Contains non-alpha-numeric characters',
    cannotConvertStringToBoolean: 'Cannot convert string into a boolean',
    unsupportedTypeForConversion: 'Unsupported type for conversion',
    notExpectedValue: 'Not equal to the expected value',
    cannotConvertObjectToJSON: 'Cannot convert object into JSON string',
    cannotConvertToString: 'Cannot convert value into a string',
    cannotConvertToNumber: 'Cannot convert value into a number',
    arityTooLow: 'Too few arguments',
    arityTooHigh: 'Too many arguments',
    needsTrimming: 'Needs trimming',
    notUpperCase: 'Not upper case',
    notLowerCase: 'Not lower case'
};

class ValidationError extends Error {
    constructor(errorType, { type, propertyName, errors } = {}) {
        super(errorType);

        this.errorType = errorType;
        this.type = type;
        this.string = ValidationErrorTypes[errorType];

        this.propertyNames = [];
        if (propertyName) {
            this.propertyNames.push(propertyName);
        }

        this.errors = errors;
    }

    addPropertyName(propertyName) {
        this.propertyNames.unshift(propertyName);
    }

    get propertyName() {
        return this.propertyNames.join('.');
    }

    get errorTypes() {
        if (this.errors) {
            return flatten(this.errors.map(subError => subError.errorTypes));
        } else {
            return [this.errorType];
        }
    }
}

module.exports = {
    ValidationError,
    ValidationErrorTypes
};
