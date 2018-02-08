# n-params-processor
Node.js parameters parser/validator and mongodb/sequelize query/data object builder.

[![Build Status](https://travis-ci.org/AlexanderMac/n-params-processor.svg?branch=master)](https://travis-ci.org/AlexanderMac/n-params-processor)
[![npm version](https://badge.fury.io/js/n-params-processor.svg)](https://badge.fury.io/js/n-params-processor)

### Commands
```bash
# Add to project
$ npm i n-params-processor
```

### Usage
```js
const MongooseQB  = require('n-params-processor').MongooseQB;
const DataBuilder = require('n-params-processor').DataBuilder;

/* Request:
- GET /api/users/58ea5b07973ab04f88def3fa?fields=firstName,lastName&page=5&count=10&sortBy=firstName
*/
exports.getUserById = async (req, res, next) => {
  try {
    const ALLOWED_FIELDS = 'id firstName lastName age';
    const DEFAULT_FIELDS = 'id firstName lastName';
    let builder = new MongooseQB({
      source: req.query
    });
    builder.parseId({ from: req.params, name: 'userId', az: '_id', required: true });
    builder.parseFields({ def: DEFAULT_FIELDS, allowed: ALLOWED_FIELDS });
    builder.parsePagination();
    builder.parseSorting();

    let query = builder.build();
    /* query is an object: {
      filter: {
        _id: '58ea5b07973ab04f88def3fa'
      },
      fields: 'firstName lastName',
      pagination: { page: 5, count: 10 },
      sorting: { sortBy: 'firstName', sortDirection: 'asc' }
    }*/
    let user = await usersSrvc.getUser(query);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

/* Request:
- POST /api/users
  BODY: {
    firstName: 'John',
    age: '25',
    roles: ['user']
  }
*/
exports.createUser = async (req, res, next) => {
  try {
    let builder = new DataBuilder({
      source: req.body,
      data: { creator: req.user.userId }
    });
    builder.parseString({ name: 'firstName', max: 10, required: true });
    builder.parseString({ name: 'lastName', max: 20, def: 'not prodived' });
    builder.parseInt({ name: 'age', min: 18, max: 55, required: true });
    builder.parseArray({ name: 'roles', allowed: ['user', 'admin', 'owner'], itemType: 'string' });

    let userData = builder.build();
    /* userData is an object: {
      creator: '58ea5b07973ab04f88def3fa', // base value
      firstName: 'John',
      lastName: 'not prodived', // used default value
      age: 25, // age converted to Number
      roles: ['user']
    }*/
    let user = await usersSrvc.createUser(userData);
    res.send(user);
  } catch (err) {
    next(err);
  }
};
```

### BaseBuilder API
- **static registerCustomErrorType(ErrorType)**<br>
Registers the custom error type. The error of this type will be trown in the case of invalid parameres.

  - `ErrorType`: error type, instance of `Error` object.

- **parse<Type>(params)**<br>
Common parameters of `parse<Type>` method.

  - `source`: source object, if not defined `instance.source` is used.
  - `name`: parameter name. 
  - `az`: new name.
  - `def`: default value, is used when parameter value is nil.
  - `required` - indicates that parameter value is mandatory.
  - `min`: minimum parameter value length.
  - `max`: maximum parameter value length.
  - `allowed` - validates that `allowed` array includes parameter value.

- **parseString(params)**<br>
Parses, converts to `String` and validates parameter value.

where `params` is an object with the following fields:

  - `source`: source object, if not defined `instance.source` is used.
  - `name`: parameter name. 
  - `az`: new name.
  - `def`: default value, is used when parameter value is nil.
  - `required` - indicates that parameter value is mandatory.
  - `min`: minimum parameter value length.
  - `max`: maximum parameter value length.
  - `allowed` - validates that `allowed` array includes parameter value.

- **parseDate(params, output)**<br>
Parses, converts to `Date` and validates parameter value.
TODO

- **parseJson(params)**<br>
Parses, converts to `JSON` and validates parameter value.
TODO

- **parseBool(params)**<br>
Parses, converts to `Boolean` and validates parameter value.
TODO

- **parseNumber(params)**<br>
Parses, converts to `Number` and validates parameter value.
TODO

- **parseInt(params)**<br>
Parses, converts to `IntegerNumber` and validates parameter.

  - `min` - the lowest possible value.
  - `max` - the largest possible value).
  TODO

- **parseFloat(params)**<br>
Parses, converts to `FloatNumber` and validates parameter.
  TODO

- **parseRegexp(params)**<br>
Parses and validates parameter.
TODO

- **parseObjectId(params)**<br>
Parses, converts to `ObjectId` and validates parameter.
TODO

- **parseArray**
Parses, converts to `itemType` and validates parameter.
TODO

### DataBuilder API
TODO

### QueryBuilder (MongooseQueryBuilder, SequelizeQueryBuilder) API
TODO

- **parseFields(params, output)**<br>
Parses, converts and validates fields parameter.

   - `from.fields` - space separated string of parsing fields.
   - `def` - space separated string of default fields.
   - `allowed` - space separated string of allowed fields.

- **parsePagination(params, output)**<br>
TODO

- **parseSorting(params, output)**<br>
TODO

- **Build(params, output)**<br>


### Author
Alexander Mac

### License
Licensed under the MIT license.
