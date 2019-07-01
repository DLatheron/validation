'use strict';

// AIMS:
// - Allows things such as type validation, range, matches, strictShape or shape;
// - Plugin architecture so that you can just add new validation functions;
// - Composable so that you can generate your own;
// - Server and client based so that it can be shared easily;
// -

const _Array = require('./types/Array');
const _Number = require('./types/Number');
const _Object = require('./types/Object');
const _OneOf = require('./types/OneOf');
const _String = require('./types/String');

const Validate = () => {
    return {
        Array: function() { return new _Array(...arguments); },
        Number: function() { return new _Number(...arguments); },
        Object: function() { return new _Object(...arguments); },
        OneOf: function() { return new _OneOf(...arguments); },
        String: function() { return new _String(...arguments); }
    };
};

module.exports = Validate();
