'use strict';

const Any = require('./Any');
const { isFinite } = require('lodash');

// TODO:
// - base();
// - lessThan();
// - greaterThan();
// - multiple();
// - port();
// - precision();
// - safe() ?!?!?!?!

class _Number extends Any {
    constructor() {
        super('number');

        this._defaultValue = 0;

        return this.isNumber();
    }

    isNumber() {
        return this._register(
            value => {
                if (!this._coerceValue) {
                    if (typeof value !== 'number') {
                        return this._throwValidationError('notANumber');
                    }
                    return value;
                } else {
                    switch (typeof value) {
                        case 'number':
                            return value;

                        case 'string':
                            if (value === '') {
                                return this._throwValidationError('notANumber');
                            }
                            const valueAsNumber = Number(value).valueOf();
                            if (!isFinite(valueAsNumber)) {
                                return this._throwValidationError('notANumber');
                            }
                            return valueAsNumber;

                        case 'boolean':
                            return value ? 1 : 0;

                        default:
                            this._throwValidationError('cannotConvertToNumber');
                    }
                }
            }
        );
    }

    min(min) {
        return this._register(
            value => {
                if (value < min) {
                    return (this._isCoercing
                        ? min
                        : this._throwValidationError('tooLow')
                    );
                }

                return value;
            }
        );
    }

    max(max) {
        return this._register(
            value => {
                if (value > max) {
                    return (this._isCoercing
                        ? max
                        : this._throwValidationError('tooHigh')
                    );
                }
                return value;
            }
        );
    }

    range({ min, max }) {
        return this._register(
            value => {
                if (min !== undefined && value < min) {
                    return (this._isCoercing
                        ? min
                        : this._throwValidationError('tooLow')
                    );
                } else if (max !== undefined && value > max) {
                    return (this._isCoercing
                        ? max
                        : this._throwValidationError('tooHigh')
                    );
                }
                return value;
            }
        );
    }

    port() {
        return this.range({ min: 1, max: 65535 });
    }

    positive() {
        return this._register(
            value => {
                if (value <= 0) {
                    return (this._isCoercing
                        ? 1
                        : this._throwValidationError('notPositive')
                    );
                }
                return value;
            }
        );
    }

    negative() {
        return this._register(
            value => {
                if (value >= 0) {
                    return (this._isCoercing
                        ? -1
                        : this._throwValidationError('notNegative')
                    );
                }
                return value;
            }
        );
    }

    nonZero() {
        return this._register(
            value => {
                if (value === 0) {
                    return (this._isCoercing
                        ? this._defaultValue
                        : this._throwValidationError('nonZero')
                    );
                }
                return value;
            }
        );
    }

    even() {
        return this._register(
            value => {
                if (value % 2 !== 0) {
                    return (this._isCoercing
                        ? value - Math.sign(value)
                        : this._throwValidationError('notEven')
                    );
                }
                return value;
            }
        );
    }

    odd() {
        return this._register(
            value => {
                if (value % 2 !== 1) {
                    return (this._isCoercing
                        ? value + (Math.sign(value) || 1)
                        : this._throwValidationError('notOdd')
                    );
                }
                return value;
            }
        );
    }
};

module.exports = _Number;
