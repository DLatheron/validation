'use strict';

const Any = require('./Any');
const { isArray } = require('lodash');

class _OneOf extends Any {
    constructor(subSchemas) {
        super('oneOf');

        if (!isArray(subSchemas)) {
            return this._throwSchemaError('notAnArrayOfSchemas');
        }
        if (!subSchemas.every(option =>
            option instanceof Any
        )) {
            return this._throwSchemaError('mustBeASchema');
        }

        this._defaultValue = subSchemas[0]._defaultValue;

        return this.isOneOf(subSchemas);
    }

    isOneOf(subSchemas) {
        return this._register(
            value => {
                const errors = [];

                if (subSchemas.every(schema => {
                    try {
                        schema.validate(value);
                        return false;
                    } catch (error) {
                        errors.push(error);
                        return true;
                    }
                })) {
                    return (this._isCoercing
                        ? this._defaultValue
                        : this._throwValidationError(
                            'subSchemaFailure',
                            { errors }
                        )
                    );
                }

                return value;
            }
        );
    }
}

module.exports = _OneOf;
