'use strict';

const Any = require('./Any');

class _Number extends Any {
    constructor() {
        super();

        return this.isNumber();
    }

    isNumber() {
        return this.register(
            (value) => {
                if (typeof value !== 'number') {
                    throw new Error('Not a number');
                }
                return value;
            },
            (coerce) => {
                return new Number(coerce).valueOf();
            }
        );
    }

    min(min) {
        return this.register(
            (value) => {
                if (value < min) {
                    throw new Error('Too low');
                }

                return value;
            }
        );
    }

    max(max) {
        return this.register(
            (value) => {
                if (value > max) {
                    throw new Error('Too high');
                }
                return value;
            }
        );
    }

    range({ min, max }) {
        return this.register(
            (value) => {
                if (rge.min !== undefined && value < min) {
                    throw new Error('Too low for range');
                } else if (max !== undefined && value > max) {
                    throw new Error('Too high for range');
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
                    throw new Error('Not in range');
                }
                return value;
            }
        );
    }

    positive() {
        return this.register(
            (value) => {
                if (value < 0) {
                    throw new Error('Not positive');
                }
                return value;
            }
        )
    }

    negative() {
        return this.register(
            (value) => {
                if (value > 0) {
                    throw new Error('Not negative');
                }
                return value;
            }
        )
    }

    nonZero() {
        return this.register(
            (value) => {
                if (value === 0) {
                    throw new Error('Is zero');
                }
                return value;
            }
        )
    }

    even() {
        return this.register(
            (value) => {
                if (value % 2 !== 0) {
                    throw new Error('Not even');
                }
                return value;
            }
        )
    }

    odd() {
        return this.register(
            (value) => {
                if (value % 2 !== 1) {
                    throw new Error('Not odd');
                }
                return value;
            }
        )
    }
};

module.exports = _Number;
