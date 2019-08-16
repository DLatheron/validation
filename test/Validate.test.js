'use strict';

const Validate = require('../src/Validate');

const validationTypes = {
    _Array: require('../src/types/Array'),
    _Boolean: require('../src/types/Boolean'),
    _Number: require('../src/types/Number'),
    _Object: require('../src/types/Object'),
    _OneOf: require('../src/types/OneOf'),
    _String: require('../src/types/String')
};

jest.mock('../src/types/Array');
jest.mock('../src/types/Boolean');
jest.mock('../src/types/Number');
jest.mock('../src/types/Object');
jest.mock('../src/types/OneOf');
jest.mock('../src/types/String');

describe('Validate', () => {
    const args = [
        'argument1',
        'argument2',
        'argument3'
    ];

    describe.each([
        { name: 'Array', constructs: '_Array' },
        { name: 'Boolean', constructs: '_Boolean' },
        { name: 'Number', constructs: '_Number' },
        { name: 'Object', constructs: '_Object' },
        { name: 'Object', constructs: '_Object' },
        { name: 'OneOf', constructs: '_OneOf' },
        { name: 'String', constructs: '_String' }
    ])(
        'constructs', ({ name, constructs }) => {
            it(`should generate a '${constructs}' validator when calling 'Validate.${name}'`, () => {
                Validate[name](...args);

                expect(validationTypes[constructs]).toHaveBeenCalledTimes(1);
                expect(validationTypes[constructs]).toHaveBeenCalledWith(...args);
            });
        }
    );
});
