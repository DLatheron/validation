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
            (value) => {
                if (typeof value !== 'boolean') {
                    this._throwValidationFailure('Not a boolean');
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
                                this._throwValidationFailure('');
                                break;
                        }
                        break;

                    default:
                        this._throwValidationFailure('Unsupported type for coersion');
                        break;
                }
            }
        );
    }

    is(expectedValue) {
        return this._register(
            (value) => {
                if (value !== expectedValue) {
                    this._throwValidationFailure(`Not ${expectedValue}`);
                }
                return value;
            }
        );
    }
}

module.exports = _Boolean;
