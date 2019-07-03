'use strict';

const Any = require('./Any');

class _Object extends Any {
    constructor(contents, options) {
        super('object');

        return this.isObject(contents, options);
    }

    isObject(contents, { allowAdditionalProperties = false } = {}) {
        return this.register(
            (value) => {
                if (!allowAdditionalProperties) {
                    for (const [propertyName] of Object.entries(value)) {
                        if (!contents[propertyName]) {
                            this.throwValidationFailure(
                                'Unexpected property',
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
