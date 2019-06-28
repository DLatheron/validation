'use strict';

const Any = require('./Any');

class _String extends Any {
    constructor() {
        super();

        return this.isString();
    }

    isString() {
        return this.register(
            (value) => {
                if (typeof value !== 'string') {
                    throw new Error('Not a string');
                }
                return value;
            },
            (coerce) => {
                return new String(coerce).valueOf();
            }
        );
    }

    notEmpty() {
        return this.register(
            (value) => {
                if (value.length === 0) {
                    throw new Error('Cannot be empty');
                }
                return value;
            }
        )
    }

    minLength(minLen) {
        return this.register(
            (value) => {
                if (value.length < minLen) {
                    throw new Error('Too short');
                }
                return value;
            }
        )
    }

    maxLength(maxLen) {
        return this.register(
            (value) => {
                if (value.length > maxLen) {
                    throw new Error('Too long');
                }
                return value;
            }
        )
    }
}

module.exports = _String;
