'use strict';

const Any = require('./Any');
const { ValidationErrorTypes } = require('../ValidationError');

class _Number extends Any {
    constructor() {
        super('number');

        this._defaultValue = 0;

        return this.isNumber();
    }

    isNumber() {
        return this._register(
            (value) => {
                if (typeof value !== 'number') {
                    this._throwValidationFailure(ValidationErrorTypes.notANumber);
                }
                return value;
            },
            (coerce) => {
                // eslint-disable-next-line no-new-wrappers
                return (new Number(coerce)).valueOf();
            }
        );
    }

    min(min) {
        return this._register(
            (value) => {
                if (value < min) {
                    this._throwValidationFailure(ValidationErrorTypes.tooLow);
                }

                return value;
            }
        );
    }

    max(max) {
        return this._register(
            (value) => {
                if (value > max) {
                    this._throwValidationFailure(ValidationErrorTypes.tooHigh);
                }
                return value;
            }
        );
    }

    range({ min, max }) {
        return this._register(
            (value) => {
                if (min !== undefined && value < min) {
                    this._throwValidationFailure(ValidationErrorTypes.tooLowForRange);
                } else if (max !== undefined && value > max) {
                    this._throwValidationFailure(ValidationErrorTypes.tooHighForRange);
                }
                return value;
            }
        );
    }

    ranges(ranges) {
        return this._register(
            (value) => {
                if (!ranges.some(range => {
                    if (range.min !== undefined && value < range.min) {
                        return false;
                    } else if (range.max !== undefined && value > range.max) {
                        return false;
                    }
                    return true;
                })) {
                    this._throwValidationFailure(ValidationErrorTypes.notInRange);
                }
                return value;
            }
        );
    }

    positive() {
        return this._register(
            (value) => {
                if (value < 0) {
                    this._throwValidationFailure(ValidationErrorTypes.notPositive);
                }
                return value;
            }
        );
    }

    negative() {
        return this._register(
            (value) => {
                if (value > 0) {
                    this._throwValidationFailure(ValidationErrorTypes.notNegative);
                }
                return value;
            }
        );
    }

    nonZero() {
        return this._register(
            (value) => {
                if (value === 0) {
                    this._throwValidationFailure(ValidationErrorTypes.nonZero);
                }
                return value;
            }
        );
    }

    even() {
        return this._register(
            (value) => {
                if (value % 2 !== 0) {
                    this._throwValidationFailure(ValidationErrorTypes.notEven);
                }
                return value;
            }
        );
    }

    odd() {
        return this._register(
            (value) => {
                if (value % 2 !== 1) {
                    this._throwValidationFailure(ValidationErrorTypes.notOdd);
                }
                return value;
            }
        );
    }
};

module.exports = _Number;
