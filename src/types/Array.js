'use strict';

const Any = require('./Any');

class _Array extends Any {
    constructor(schema) {
        super('array');

        return this.isArray(schema);
    }

    isArray(schema) {
        return this.register(
            (value) => {
                if (!Array.isArray(value, next)) {
                    this.throwValidationFailure('Not an array');
                }

                // TODO: Do something with the contents...
                // TODO: It would be good if we could execute the lower level validation
                //       first...
                value.forEach((v) => {
                    schema._validate(v);
                });

                return value;
            }
        );
    }

    notEmpty() {
        return this.register(
            (value) => {
                if (value.length === 0) {
                    this.throwValidationFailure('Cannot be empty');
                }
                return value;
            },
            (coerce) => {
                return coerce || [];
            }
        );
    }

    minLength(minLength) {
        return this.register(
            (value) => {
                if (value.length < minLength) {
                    this.throwValidationFailure('Too short');
                }
                return value;
            }
        );
    }

    maxLength(maxLength) {
        return this.register(
            (value) => {
                if (value.length > maxLength) {
                    this.throwValidationFailure('Too long');
                }
                return value;
            }
        );
    }
}

module.exports = _Array;
