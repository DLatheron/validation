'use strict';

const Any = require('./Any');

class _OneOf extends Any {
    constructor(options) {
        super('oneOf');

        return this.oneOf(options);
    }

    oneOf(schemaOptions) {
        // TODO: options must be an array.

        return this.register(
            (value) => {
                const errors = [];

                if (schemaOptions.every(schema => {
                    try {
                        schema._validate(value);
                        return false;
                    } catch (error) {
                        errors.push(error);
                        return true;
                    }
                })) {
                    this.throwValidationFailure(
                        'Aggregate error',
                        { errors }
                    );
                }

                return value;
            }
        );
    }
}

module.exports = _OneOf;
