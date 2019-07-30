'use strict';

const Any = require('./Any');
const { ValidationErrorTypes } = require('../ValidationError');

class _Boolean extends Any {
    constructor() {
        super('boolean');

        this._defaultValue = false;

        return this.isBoolean();
    }

    isBoolean() {
        return this._register(
            (value) => {
                if (typeof value !== 'boolean') {
                    this._throwValidationFailure(ValidationErrorTypes.notABoolean);
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
                                this._throwValidationFailure(ValidationErrorTypes.cannotConvertStringToBoolean);
                                break;
                        }
                        break;

                    default:
                        this._throwValidationFailure(ValidationErrorTypes.unsupportedTypeForConversion);
                        break;
                }
            }
        );
    }

    is(expectedValue) {
        return this._register(
            (value) => {
                if (value !== expectedValue) {
                    this._throwValidationFailure(ValidationErrorTypes.notExpectedValue);
                }
                return value;
            }
        );
    }
}

module.exports = _Boolean;
