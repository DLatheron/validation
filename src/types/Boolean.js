'use strict';

const Any = require('./Any');

class _Boolean extends Any {
    constructor() {
        super('boolean');

        return this.isBoolean();
    }

    isBoolean() {
        return this.register(
            (value) => {
                if (typeof value !== 'boolean') {
                    this.throwValidationFailure('Not a boolean');
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
                                this.throwValidationFailure('');
                                break;
                        }
                        break;

                    default:
                        this.throwValidationFailure('Unsupported type for coersion');
                        break;
                }
            }
        );
    }

    is(expectedValue) {
        return this.register(
            (value) => {
                if (value !== expectedValue) {
                    this.throwValidationFailure(`Not ${expectedValue}`);
                }
                return value;
            }
        );
    }
}

module.exports = _Boolean;
