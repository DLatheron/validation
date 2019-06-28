'use strict';

const Any = require('./Any');

class _Object extends Any {
    constructor(contents, options) {
        super();

        return this.isObject(contents, options);
    }

    isObject(contents, { allowAdditionalProperties = false } = {}) {
        return this.register(
            (value) => {
                if (!allowAdditionalProperties) {
                    for (let [key] of Object.entries(value)) {
                        if (!contents[key]) {
                            throw new Error('Unexpected property');
                        }
                    }
                }

                for (let [key] of Object.entries(contents)) {
                    try {
                        contents[key]._validate(value[key]);
                    } catch (error) {
                        throw error;
                    }
                }
                return true;
            }
        );
    }
}

module.exports = _Object;
