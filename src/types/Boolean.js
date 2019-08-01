'use strict';

const Any = require('./Any');

class _Boolean extends Any {
    constructor() {
        super('boolean');

        this._defaultValue = false;

        return this.isBoolean();
    }

    isBoolean() {
        return this._register(
            value => {
                if (!this._coerceValue) {
                    if (typeof value !== 'boolean') {
                        this._throwValidationFailure('notABoolean');
                    }
                    return value;
                } else {
                    switch (typeof value) {
                        case 'boolean':
                            return value;

                        case 'number':
                            return value !== 0;

                        case 'string':
                            switch (value.toLowerCase().trim()) {
                                case 'true': case '1': case 'yes':
                                    return true;
                                case 'false': case '0': case 'no':
                                    return false;
                                default :
                                    return this._throwValidationFailure('cannotConvertStringToBoolean');
                            }

                        default:
                            return this._throwValidationFailure('unsupportedTypeForConversion');
                    }
                }
            }
        );
    }

    is(expectedValue) {
        return this._register(
            value => {
                if (value !== expectedValue) {
                    return this._throwValidationFailure('notExpectedValue');
                }
                return value;
            }
        );
    }
}

module.exports = _Boolean;
