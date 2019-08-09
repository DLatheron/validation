'use strict';

const Any = require('./Any');
const { isEmpty, keys, pick } = require('lodash');

class _Object extends Any {
    constructor(contents = {}, options = { allowAdditionalProperties: true, convertJSON: false }) {
        super('object');

        this._defaultValue = {};
        this._coersionOptions = {
            json: {
                convert: false
            }
        };

        return this.isObject(contents, options);
    }

    // CanCoerce: {} or defaultValue.
    isObject(contents, options) {
        return this._register(
            value => {
                if (!this._coerceValue) {
                    if (typeof value !== 'object') {
                        return this._throwValidationError('notAnObject');
                    }
                } else {
                    if (typeof value === 'string' && this._coersionOptions.json.convert) {
                        try {
                            value = JSON.parse(value);
                        } catch (error) {
                            return this._defaultValue;
                        }
                    } else if (typeof value !== 'object') {
                        return this._defaultValue;
                    }
                }

                if (!this._coerceValue && !options.allowAdditionalProperties) {
                    for (const [propertyName] of Object.entries(value)) {
                        if (!contents[propertyName]) {
                            return this._throwValidationError(
                                'unexpectedProperty',
                                { propertyName }
                            );
                        }
                    }
                }

                for (const [propertyName] of Object.entries(contents)) {
                    try {
                        contents[propertyName].validate(value[propertyName]);
                    } catch (error) {
                        error.addPropertyName(propertyName);
                        throw error;
                    }
                }

                if (this._coerceValue &&
                    !options.allowAdditionalProperties &&
                    !isEmpty(contents)) {
                    value = pick(value, keys(contents));
                }

                return value;
            }
        );
    }
}

module.exports = _Object;
