'use strict';

const { ValidationError } = require('../src/ValidationError');

describe('ValidationError', () => {
    describe('constructor', () => {
        it('should set the error message', () => {
            const _error = new ValidationError('message');

            expect(_error.message).toBe('message');
        });

        it('should set the error type', () => {
            const _error = new ValidationError('message');

            expect(_error.errorType).toBe('message');
        });

        it('should set the type', () => {
            const _error = new ValidationError('message', { type: 'type' });

            expect(_error.type).toBe('type');
        });

        it('should lookup and store the text of the error type', () => {
            const _error = new ValidationError('cannotBeEmpty');

            expect(_error.string).toBe('Cannot be empty');
        });
    });

    describe('addPropertyName', () => {
        it('should add a property name to the front of the list', () => {
            const _error = new ValidationError();

            _error.addPropertyName('3');
            _error.addPropertyName('2');
            _error.addPropertyName('1');

            expect(_error.propertyNames).toMatchObject([
                '1',
                '2',
                '3'
            ]);
        });
    });

    describe('propertyName', () => {
        it('should reconstruct a hierarchical property name', () => {
            const _error = new ValidationError();

            _error.addPropertyName('3');
            _error.addPropertyName('2');
            _error.addPropertyName('1');

            expect(_error.propertyName).toBe('1.2.3');
        });
    });

    describe('errorTypes', () => {
        it("should return an array of the error's type, if no sub-error are recorded", () => {
            const _error = new ValidationError('someSimpleType');

            expect(_error.errorTypes).toStrictEqual(['someSimpleType']);
        });

        it('should return an array of the sub-errors recorded (if any)', () => {
            const _error = new ValidationError(
                'shouldNotBeInTheErrorTypeArray',
                {
                    errors: [
                        new ValidationError('subType1'),
                        new ValidationError('subType2'),
                        new ValidationError('subType3')
                    ]
                });

            expect(_error.errorTypes).toStrictEqual(['subType1', 'subType2', 'subType3']);
        });

        it('should return an array of the sub-errors recorded (if any) and process them recursively', () => {
            const _error = new ValidationError(
                'shouldNotBeInTheErrorTypeArray',
                {
                    errors: [
                        new ValidationError('subType:1', {
                            errors: [
                                new ValidationError('subType:1.1')
                            ]
                        }),
                        new ValidationError('subType:2'),
                        new ValidationError('subType:3', {
                            errors: [
                                new ValidationError('subType:3.1'),
                                new ValidationError('subType:3.2', {
                                    errors: [
                                        new ValidationError('subType:3.2.1')
                                    ]
                                })
                            ]
                        })
                    ]
                });

            expect(_error.errorTypes).toStrictEqual([
                'subType:1.1',
                'subType:2',
                'subType:3.1',
                'subType:3.2.1'
            ]);
        });
    });
});
