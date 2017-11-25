# n-params-processor
Node.js parameters parser/validator mongodb/sequelize filter builder.

[![Build Status](https://travis-ci.org/AlexanderMac/n-params-processor.svg?branch=master)](https://travis-ci.org/AlexanderMac/n-params-processor)
[![npm version](https://badge.fury.io/js/n-params-processor.svg)](https://badge.fury.io/js/n-params-processor)

### Commands
```bash
# Add to project
$ npm i -S n-params-processor
# Run tests
$ npm test
# Run lint tool
$ npm run lint
# Run coverage tool
$ npm run coverage
```

### Usage
```js
// Create a new user
exports.createUser = async (req, res, next) => {
  try {
    let userData = paramsProc.getEmptyObjectData();
    paramsProc.processString({ from: req.body, name: 'firstName', required: true }, userData);
    paramsProc.processString({ from: req.body, name: 'lastName', required: true }, userData);
    paramsProc.processInt({ from: req.body, name: 'age', min: 0, required: true }, userData);

    let user = await usersSrvc.createUser(userData);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

// Get an existing user by id
exports.getPaymentById = async (req, res, next) => {
  try {
    const ALLOWED_FIELDS = 'id firstName lastName age';
    const DEFAULT_FIELDS = 'id firstName lastName';
    let filter = paramsProc.getEmptyParams();
    paramsProc.processId({ from: req.params, required: true }, params.filter);
    paramsProc.processFields({ from: req.query, def: DEFAULT_FIELDS, allowed: ALLOWED_FIELDS }, params);

    let user = await usersSrvc.getUser(params);
    res.send(user);
  } catch (err) {
    next(err);
  }
};
```

### API
- **registerCustomErrorType(CustomErrorType)**<br>
Registers the custom error type which should be thrown in the case of invalid parameres.

  - `CustomErrorType` - error type, instance of `Error` object.

- **getEmptyParams()**<br>
Returns empty object with two fields: `filter` and `fields`.

- **getEmptyObjectData(data)**<br>
Returns extended by data empty object.

  - `data` - object to extend.

- **parseObjectData(opts, data)**<br>
Takes allowed fields `opts.allowed` from `opts.from` and extends `data` by allowed fields.

  - `opts` - options (`from` - source object, `allowed` - an array of allowed fields).
  - `data` - object to extend.

- **processStringParam(opts, output)**<br>
Parses, converts to `String` and validates parameter. Adds output field to `output` object.

  - `opts` - options (`from` - source object, `name` - parameter name, `required` - indicates that parameter is mandatory, `allowed` - validates that parameter value is in `allowed` array).
  - `output` - output object.

- **processIntParam(opts, output)**<br>
Parses, converts to `IntegerNumber` and validates parameter. Adds output field to `output` object.

  - `opts` - options (`from` - source object, `name` - parameter name, `required` - indicates that parameter is mandatory, `min` - the lowest possible value, `max` - the largest possible value).
  - `output` - output object.

- **processFloatParam(opts, output)**<br>
Parses, converts to `FloatNumber` and validates parameter. Adds output field to `output` object.

  - `opts` - options (`from` - source object, `name` - parameter name, `required` - indicates that parameter is mandatory, `min` - the lowest possible value, `max` - the largest possible value).
  - `output` - output object.

- **processDateParam(opts, output)**<br>
Parses, converts to `Date` and validates parameter. Adds output field to `output` object.<br>
*The date must be in YYYY-MM-DD HH:mm:ss format.*

  - `opts` - options (`from` - source object, `name` - parameter name, `required` - indicates that parameter is mandatory).
  - `output` - output object.

- **processId(opts, output)**<br>
Parses, converts to `id` and validates parameter. Adds output field to `output` object.
*RDBMS record id - positive integer.*

  - `opts` - options (`from` - source object, `name` - parameter name (`id` be default), `required` - indicates that parameter is mandatory).
  - `output` - output object.

- **processIdList(opts, output)**<br>
Parses, converts to `IdList` and validates parameter. Adds output field to `output` object.
*RDBMS record id - positive integer.*

  - `opts` - options (`from` - source object, `name` - parameter name, `required` - indicates that parameter is mandatory).
  - `output` - output object.

- **processObjectId(opts, output)**<br>
Parses, converts to `ObjectId` and validates parameter. Adds output field to `output` object.
*MongoDb document objectId.*

  - `opts` - options (`from` - source object, `name` - parameter name, `required` - indicates that parameter is mandatory).
  - `output` - output object.

- **processIn(opts, output)**<br>
Parses, converts to `$in` query and validates parameter. Adds output field to `output` object.

  - `opts` - options (`from` - source object, `name` - parameter name (`in` by default), `required` - indicates that parameter is mandatory).
  - `output` - output object.

- **processNin(opts, output)**<br>
Parses, converts to `$notIn` query and validates parameter. Adds output field to `output` object.

  - `opts` - options (`from` - source object, `name` - parameter name (`nin` by default), `required` - indicates that parameter is mandatory).
  - `output` - output object.

- **processFields(opts, output)**<br>
Parses, converts and validates fields parameter. Adds output field to `output` object.

  - `opts` - options (`from.fields` - space separated string of parsing fields, `def` - space separated string of default fields, `allowed` - space separated string of allowed fields).
  - `output` - output object.

### Author
Alexander Mac

### License
Licensed under the MIT license.
