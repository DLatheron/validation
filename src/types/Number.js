'use strict';

const Any = require('./Any');

// TODO:
// - Support for conversion from a particular base.

class _Number extends Any {
    constructor(strict = true) {
        super('number');

        this._defaultValue = 0;

        return (strict
            ? this.isNumber()
            : this.toNumber()
        );
    }

    isNumber() {
        return this._register(
            value => {
                if (typeof value !== 'number') {
                    this._throwValidationFailure('notANumber');
                }
                return value;
            }
        );
    }

    toNumber() {
        return this._register(
            value => {
                switch (typeof value) {
                    case 'number':
                        return value;

                    case 'string':
                        return Number(value).valueOf();

                    case 'boolean':
                        return value ? 1 : 0;

                    default:
                        this._throwValidationFailure('cannotConvertToNumber');
                }
            }
        );
    }

    min(min) {
        return this._register(
            value => {
                if (value < min) {
                    this._throwValidationFailure('tooLow');
                }

                return value;
            }
        );
    }

    max(max) {
        return this._register(
            value => {
                if (value > max) {
                    this._throwValidationFailure('tooHigh');
                }
                return value;
            }
        );
    }

    range({ min, max }) {
        return this._register(
            value => {
                if (min !== undefined && value < min) {
                    this._throwValidationFailure('tooLowForRange');
                } else if (max !== undefined && value > max) {
                    this._throwValidationFailure('tooHighForRange');
                }
                return value;
            }
        );
    }

    ranges(ranges) {
        return this._register(
            value => {
                if (!ranges.some(range => {
                    if (range.min !== undefined && value < range.min) {
                        return false;
                    } else if (range.max !== undefined && value > range.max) {
                        return false;
                    }
                    return true;
                })) {
                    this._throwValidationFailure('notInRange');
                }
                return value;
            }
        );
    }

    positive() {
        return this._register(
            value => {
                if (value < 0) {
                    this._throwValidationFailure('notPositive');
                }
                return value;
            }
        );
    }

    negative() {
        return this._register(
            value => {
                if (value > 0) {
                    this._throwValidationFailure('notNegative');
                }
                return value;
            }
        );
    }

    nonZero() {
        return this._register(
            value => {
                if (value === 0) {
                    this._throwValidationFailure('nonZero');
                }
                return value;
            }
        );
    }

    even() {
        return this._register(
            value => {
                if (value % 2 !== 0) {
                    this._throwValidationFailure('notEven');
                }
                return value;
            }
        );
    }

    odd() {
        return this._register(
            value => {
                if (value % 2 !== 1) {
                    this._throwValidationFailure('notOdd');
                }
                return value;
            }
        );
    }
};

module.exports = _Number;
