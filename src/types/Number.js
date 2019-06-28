'use strict';

const Any = require('./Any');

class _Number extends Any {
    constructor() {
        super('number');

        return this.isNumber();
    }

    isNumber() {
        return this.register(
            (value) => {
                if (typeof value !== 'number') {
                    this.throwValidationFailure('Not a number');
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
        return this.register(
            (value) => {
                if (value < min) {
                    this.throwValidationFailure('Too low');
                }

                return value;
            }
        );
    }

    max(max) {
        return this.register(
            (value) => {
                if (value > max) {
                    this.throwValidationFailure('Too high');
                }
                return value;
            }
        );
    }

    range({ min, max }) {
        return this.register(
            (value) => {
                if (min !== undefined && value < min) {
                    this.throwValidationFailure('Too low for range');
                } else if (max !== undefined && value > max) {
                    this.throwValidationFailure('Too high for range');
                }
                return value;
            }
        );
    }

    ranges(ranges) {
        return this.register(
            (value) => {
                if (!ranges.some(range => {
                    if (range.min !== undefined && value < range.min) {
                        return false;
                    } else if (range.max !== undefined && value > range.max) {
                        return false;
                    }
                    return true;
                })) {
                    this.throwValidationFailure('Not in range');
                }
                return value;
            }
        );
    }

    positive() {
        return this.register(
            (value) => {
                if (value < 0) {
                    this.throwValidationFailure('Not positive');
                }
                return value;
            }
        );
    }

    negative() {
        return this.register(
            (value) => {
                if (value > 0) {
                    this.throwValidationFailure('Not negative');
                }
                return value;
            }
        );
    }

    nonZero() {
        return this.register(
            (value) => {
                if (value === 0) {
                    this.throwValidationFailure('Is zero');
                }
                return value;
            }
        );
    }

    even() {
        return this.register(
            (value) => {
                if (value % 2 !== 0) {
                    this.throwValidationFailure('Not even');
                }
                return value;
            }
        );
    }

    odd() {
        return this.register(
            (value) => {
                if (value % 2 !== 1) {
                    this.throwValidationFailure('Not odd');
                }
                return value;
            }
        );
    }
};

module.exports = _Number;
