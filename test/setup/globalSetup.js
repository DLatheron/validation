'use strict';

expect.extend({
    toThrowSubSchemaValidationError(fnToCall, expectedSubSchemaErrors) {
        if (typeof fnToCall !== 'function') {
            throw new Error(`expected a 'function' but received a ${typeof fnToCall}`);
        }

        try {
            fnToCall();

            return {
                message: () =>
                    `expected function to throw a 'subSchemaError', but it didn't`,
                pass: false
            };
        } catch (error) {
            if (error.errorType !== 'subSchemaFailure') {
                return {
                    message: () =>
                        `expected function to throw a 'subSchemaError', but it didn't`,
                    pass: false
                };
            }

            const { errorTypes } = error;

            expect(errorTypes).toMatchObject(expectedSubSchemaErrors);

            return {
                message: () =>
                    `expected function to not throw a 'subSchemaError' and it did`,
                pass: true
            };
        }
    }
});
