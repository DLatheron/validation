'use strict';

const Any = require('./Any');

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
                    this._throwValidationFailure('Not a number');
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
                    this._throwValidationFailure('Too low');
                }

                return value;
            }
        );
    }

    max(max) {
        return this._register(
            (value) => {
                if (value > max) {
                    this._throwValidationFailure('Too high');
                }
                return value;
            }
        );
    }

    range({ min, max }) {
        return this._register(
            (value) => {
                if (min !== undefined && value < min) {
                    this._throwValidationFailure('Too low for range');
                } else if (max !== undefined && value > max) {
                    this._throwValidationFailure('Too high for range');
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
                    this._throwValidationFailure('Not in range');
                }
                return value;
            }
        );
    }

    positive() {
        return this._register(
            (value) => {
                if (value < 0) {
                    this._throwValidationFailure('Not positive');
                }
                return value;
            }
        );
    }

    negative() {
        return this._register(
            (value) => {
                if (value > 0) {
                    this._throwValidationFailure('Not negative');
                }
                return value;
            }
        );
    }

    nonZero() {
        return this._register(
            (value) => {
                if (value === 0) {
                    this._throwValidationFailure('Is zero');
                }
                return value;
            }
        );
    }

    even() {
        return this._register(
            (value) => {
                if (value % 2 !== 0) {
                    this._throwValidationFailure('Not even');
                }
                return value;
            }
        );
    }

    odd() {
        return this._register(
            (value) => {
                if (value % 2 !== 1) {
                    this._throwValidationFailure('Not odd');
                }
                return value;
            }
        );
    }
};

module.exports = _Number;
