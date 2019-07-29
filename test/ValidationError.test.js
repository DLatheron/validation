'use strict';

const { ValidationError, ValidationErrorTypes } = require('../src/ValidationError');

describe('ValidatioinError', () => {
    const errors = [
        { errorType: 'unexpectedProperty', propertyName: 'age', expectedMessage: 'Unexpected property "age"' }
    ];

    describe.each(errors)(
        'should generate an appropriate error message for',
        ({ errorType, type, propertyName, expectedMessage }) => {
            it(`${type}`, () => {
                const error = new ValidationError(errorType, {
                    type,
                    propertyName
                });

                expect(error.message).toStrictEqual(expectedMessage);
            });
        }
    );
});
