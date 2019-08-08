'use strict';

const Any = require('./Any');

class _OneOf extends Any {
    constructor(options) {
        super('oneOf');

        this._defaultValue = options[0].defaultValue;

        return this.oneOf(options);
    }

    oneOf(schemaOptions) {
        // TODO: options must be an array.

        return this._register(
            value => {
                const errors = [];

                if (schemaOptions.every(schema => {
                    try {
                        schema.validate(value);
                        return false;
                    } catch (error) {
                        errors.push(error);
                        return true;
                    }
                })) {
                    return this._throwValidationError(
                        'aggregateError',
                        { errors }
                    );
                }

                return value;
            }
        );
    }
}

module.exports = _OneOf;
