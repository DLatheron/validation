'use strict';

const Any = require('./Any');

class _Function extends Any {
    constructor() {
        super('function');

        this._defaultValue = () => {};

        return this.isFunction();
    }

    isFunction() {
        return this._register(
            value => {
                if (typeof value !== 'function') {
                    return (this._isCoercing
                        ? this._defaultValue
                        : this._throwValidationError('notAFunction')
                    );
                }
                return value;
            }
        );
    }

    arity(arity) {
        return this._register(
            value => {
                const numArguments = value.length;

                if (numArguments < arity) {
                    return (this._isCoercing
                        ? this._defaultValue
                        : this._throwValidationError('arityTooLow')
                    );
                } else if (numArguments > arity) {
                    return (this._isCoercing
                        ? this._defaultValue
                        : this._throwValidationError('arityTooHigh')
                    );
                }

                return value;
            }
        );
    }

    minArity(minArity) {
        return this._register(
            value => {
                const numArguments = value.length;

                if (numArguments < minArity) {
                    return (this._isCoercing
                        ? this._defaultValue
                        : this._throwValidationError('arityTooLow')
                    );
                }
                return value;
            }
        );
    }

    maxArity(maxArity) {
        return this._register(
            value => {
                const numArguments = value.length;

                if (numArguments > maxArity) {
                    return (this._isCoercing
                        ? this._defaultValue
                        : this._throwValidationError('arityTooHigh')
                    );
                }
                return value;
            }
        );
    }
}

module.exports = _Function;
