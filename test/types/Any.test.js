'use strict';

const Any = require('../../src/types/Any');

describe('Any', () => {
    let any;
    let trackedOrder;

    beforeEach(() => {
        any = new Any();
        trackedOrder = 0;
    });

    function expectation({ order, inValue, outValue }) {
        any._register(value => {
            expect(value).toBe(inValue);
            expect(trackedOrder++).toBe(order);
            return outValue;
        });
    }

    function expectationNext({ order, inValue, outValue }) {
        any._register((value, next) => {
            expect(value).toBe(inValue);
            expect(trackedOrder++).toBe(order);
            return next(outValue);
        });
    }

    it('should process the validation in order, if next is not called', () => {
        expectation({ order: 0, inValue: 0, outValue: 1 });
        expectation({ order: 1, inValue: 1, outValue: 2 });
        expectation({ order: 2, inValue: 2, outValue: 3 });
        expectation({ order: 3, inValue: 3, outValue: 4 });

        expect(any._validate(0)).toBe(4);
    });

    it('should process the validation in order, even if next is called', () => {
        expectationNext({ order: 0, inValue: 0, outValue: 1 });
        expectationNext({ order: 1, inValue: 1, outValue: 2 });
        expectationNext({ order: 2, inValue: 2, outValue: 3 });
        expectationNext({ order: 3, inValue: 3, outValue: 4 });

        expect(any._validate(0)).toBe(4);
    });
});
