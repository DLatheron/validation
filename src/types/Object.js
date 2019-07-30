'use strict';

const Any = require('./Any');
const { ValidationErrorTypes } = require('../ValidationError');

class _Object extends Any {
    constructor(contents, options) {
        super('object');

        this._defaultValue = {};

        return this.isObject(contents, options);
    }

    // CanCoerce: {} or defaultValue.
    isObject(contents, { allowAdditionalProperties = false } = {}) {
        return this._register(
            (value) => {
                if (!allowAdditionalProperties) {
                    for (const [propertyName] of Object.entries(value)) {
                        if (!contents[propertyName]) {
                            this._throwValidationFailure(
                                ValidationErrorTypes.unexpectedProperty,
                                { propertyName }
                            );
                        }
                    }
                }

                for (const [propertyName] of Object.entries(contents)) {
                    try {
                        contents[propertyName]._validate(value[propertyName]);
                    } catch (error) {
                        error.addPropertyName(propertyName);
                        throw error;
                    }
                }
                return value;
            }
        );
    }
}

module.exports = _Object;
