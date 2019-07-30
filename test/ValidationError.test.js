'use strict';

const { ValidationError } = require('../src/ValidationError');

describe('ValidationError', () => {
    const errors = [
        { errorType: 'unexpectedProperty', propertyName: 'age', expectedMessage: 'Unexpected property' }
    ];

    describe.each(errors)(
        'should generate an appropriate error message for',
        ({ errorType, type, propertyName, expectedMessage }) => {
            it(`${type}`, () => {
                const error = new ValidationError(errorType, {
                    type,
                    propertyName
                });

                expect(error.string).toStrictEqual(expectedMessage);
            });
        }
    );
});
