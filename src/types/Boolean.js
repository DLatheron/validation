'use strict';

const Any = require('./Any');
const { } = require('../ValidationError');

class _Boolean extends Any {
    constructor() {
        super('boolean');

        this._defaultValue = false;

        return this.isBoolean();
    }

    isBoolean() {
        return this._register(
            value => {
                if (typeof value !== 'boolean') {
                    this._throwValidationFailure('notABoolean');
                }
                return value;
            },
            (coerce) => {
                switch (typeof coerce) {
                    case 'boolean':
                        return coerce;

                    case 'number':
                        return coerce !== 0;

                    case 'string':
                        switch (coerce.toLowerCase().trim()) {
                            case 'true': case '1': case 'yes':
                                return true;
                            case 'false': case '0': case 'no': case null:
                                return false;
                            default :
                                this._throwValidationFailure('cannotConvertStringToBoolean');
                                break;
                        }
                        break;

                    default:
                        this._throwValidationFailure('unsupportedTypeForConversion');
                        break;
                }
            }
        );
    }

    is(expectedValue) {
        return this._register(
            value => {
                if (value !== expectedValue) {
                    this._throwValidationFailure('notExpectedValue');
                }
                return value;
            }
        );
    }
}

module.exports = _Boolean;
