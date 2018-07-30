# n-params-processor
Node.js parameters parser/validator and mongodb/sequelize query/data-object builder.

[![Build Status](https://travis-ci.org/AlexanderMac/n-params-processor.svg?branch=master)](https://travis-ci.org/AlexanderMac/n-params-processor)
[![Code Coverage](https://codecov.io/gh/AlexanderMac/n-params-processor/branch/master/graph/badge.svg)](https://codecov.io/gh/AlexanderMac/n-params-processor)
[![npm version](https://badge.fury.io/js/n-params-processor.svg)](https://badge.fury.io/js/n-params-processor)

## Installation
```bash
$ npm i n-params-processor
```

## Example of usage
```js
const MongooseQB  = require('n-params-processor').MongooseQB;
const DataBuilder = require('n-params-processor').DataBuilder;

/* Request:
- GET /api/users?role=user&fields=firstName%20lastName&users[]=1,2,3&page=5&count=10&sortBy=firstName
*/
exports.getUsers = async (req, res, next) => {
  try {
    const ALLOWED_FIELDS = 'id firstName lastName age';
    const DEFAULT_FIELDS = 'id firstName lastName';
    let queryBuilder = new MongooseQB({
      source: req.query
    });
    queryBuilder.parseString({ name: 'role', az: 'userRole', required: true });
    queryBuilder.parseArray({ name: 'users', az: 'userId', itemType: 'int', op: 'in' });
    queryBuilder.parseFields({ allowed: ALLOWED_FIELDS, def: DEFAULT_FIELDS });
    queryBuilder.parsePagination();
    queryBuilder.parseSorting();

    let query = queryBuilder.build();
    /* query is an object: {
      filter: {
        userRole: { $eq: 'user' },
        userId: { $in: [1, 2, 3] }
      },
      fields: 'firstName lastName',
      pagination: { page: 5, count: 10 },
      sorting: { sortBy: 'firstName', sortDirection: 'asc' }
    }*/
    let users = await usersSrvc.getUsers(query);
    res.send(users);
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
    let dataBuilder = new DataBuilder({
      source: req.body,
      data: { creator: req.user.userId }
    });
    dataBuilder.parseString({ name: 'firstName', max: 10, required: true });
    dataBuilder.parseString({ name: 'lastName', max: 20, def: 'not prodived' });
    dataBuilder.parseInt({ name: 'age', min: 18, max: 55, required: true });
    dataBuilder.parseArray({ name: 'roles', allowed: ['user', 'admin', 'owner'], itemType: 'string' });

    let userData = dataBuilder.build();
    /* userData is an object: {
      creator: '58ea5b07973ab04f88def3fa', // base value
      firstName: 'John',
      lastName: 'not prodived', // default value is used
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

## API

### consts
The constants objects. `OPERATORS` field contains all valid query operators.

### registerCustomErrorType(ErrorType)
Registers the custom error type. The error of this type will be trown in the case of invalid parameter.

  - `ErrorType`: error type, instance of `Error` object.

### DataBuilder
See [DataBuilder](#databuilder-api).

### MongooseQB
See [QueryBuilder](#querybuilder-api).

### SequelizeQB
See [QueryBuilder](#querybuilder-api).

## BaseBuilder API
- This is a base builder class, an object of this class shouldn't be used directly. Instead of this inherit of `QueryBuilder` or `DataBuilder` must be used.

### <a name="basebuilder"></a> constructor(params)

- `params` is an object with the following fields:
  - `source`: base source object, can be `req.body` for example. Parsers will use this source if custom is not provided, *optional*.
  - `data`: base data object, can include some common fields: `{ currentUser: req.user }` for example, *optional*.

### <a name="parsetype"></a> parseType(params)
Common parameters of `parseType` method.

- `params` is an object with the following fields:
  - `source`: source object, if not provided `instance.source` is used, *optional*.
  - `name`: parameter name. 
  - `az`: new name, *optional*.
  - `def`: default value, is used when parameter value is nil, *optional*.
  - `required` - indicates that parameter value is mandatory, *optional*.

### parseString(params)
Parses, converts to `String` and validates parameter value.

- `params` is an object with the same fields as for [parseType](#parsetype), except:
  - `min`: the lowest possible string length, *optional*.
  - `max`: the largest possible string length, *optional*.
  - `allowed` - validates that `allowed` array includes parameter value, *optional*.

### parseDate(params, output)
Parses, converts to `Date` and validates parameter value.

- `params` is an object with the same fields as for [parseType](#parsetype), except:
  - `format`: is date time format, if not provided `monent.defaultFormat` is used, *optional*.
  - `formatRes`: is a result object format, can be `Date` or format string, *optional*.
  - `min`: the lowest possible date, *optional*.
  - `max`: the largest possible date, *optional*.

### parseJson(params)
Parses, converts to `JSON` and validates parameter value.

- `params` is an object with the same fields as for [parseType](#parsetype).

### parseBool(params)
Parses, converts to `Boolean` and validates parameter value.

- `params` is an object with the same fields as for [parseType](#parsetype).

### <a name="parsenumber"></a> parseNumber(params)
Parses, converts to `Number` and validates parameter value.

- `params` is an object with the same fields as for [parseType](#parsetype), except:
  - `min`: the lowest possible value, *optional*.
  - `max`: the largest possible value, *optional*.
  - `allowed` - validates that `allowed` array includes parameter value, *optional*.

### parseInt(params)
Parses, converts to `IntegerNumber` and validates parameter.

- `params` is an object with the same fields as for [parseNumber](#parsenumber).

### parseFloat(params)
Parses, converts to `FloatNumber` and validates parameter.

- `params` is an object with the same fields as for [parseNumber](#parsenumber).

### parseRegexp(params)
Parses and validates parameter.

- `params` is an object with the same fields as for [parseType](#parsetype).

### parseObjectId(params)
Parses, converts to `ObjectId` and validates parameter.

- `params` is an object with the same fields as for [parseType](#parsetype).

### parseEmail(params)
Parses and validates email parameter.

- `params` is an object with the same fields as for [parseType](#parsetype).

### parseCustom(params)
Parses and validates parameters using custom handler.

- `params` is an object with the same fields as for [parseType](#parsetype), except:
  - `handler`: the function that accepts value and returns some result, *required*.

### parseArray(params)
Parses, converts to `itemType` and validates parameter.

- `params` is an object with the same fields as for [parseType](#parsetype), except:
  - `itemType` the array item type (on of the registered parser types: `Int`, `String`, `Bool`, etc).
  - `itemHandler` the handler for custom item type.
  - `allowed` - validates that parameter value is subset of `allowed` array, *optional*.

## <a name="databuilder-api"></a> DataBuilder API
Should be used for creating a plain data object, to use in create and update operations.

### constructor(params)

- `params` is an object with the same fields as for [BaseBuilder.constructor](#basebuilder).

### build()
Returns a final data object.

## <a name="querybuilder-api"></a> QueryBuilder (MongooseQueryBuilder, SequelizeQueryBuilder) API
Should be used for generating database query.

### constructor(params)

- `params` is an object with the same fields as for [BaseBuilder.constructor](#basebuilder), except:
  - `filter`: base filter, can include some common parameters, *optional*.

### parseFields(params)
Parses, converts and validates fields parameter. Validated parameter value must be space separated string of values.

- `params` is an object with the following fields:
  - `source`: source object, if not defined `instance.source` is used.
  - `fieldsName`: the name of `fields` parameter, if not provided `fields` is used, *optional*.
  - `allowed` - space separated string of allowed fields.
  - `def` - space separated string of default fields.

### parsePagination(params)
Parses, converts and validates pagination parameters. By default `page` set to 0, `count` to 10.

- `params` is an object with the following fields:
  - `source`: source object, if not defined `instance.source` is used.
  - `pageName`: the name of `page` parameter, if not provided `page` is used, *optional*.
  - `countName`: the name of `count` parameter, if not provided `count` is used, *optional*.

### parseSorting(params)
Parses, converts and validates sorting parameters. By default `sortBy` set to `id`, `sortDirection` to `asc`.

- `params` is an object with the following fields:
  - `source`: source object, if not defined `instance.source` is used.
  - `sortByName`: the name of `sortBy` parameter, if not provided `sortBy` is used, *optional*.
  - `sortDirName`: the name of `sortDirection` parameter, if not provided `sortDirection` is used, *optional*.

### Build()
Returns a final query with `filter`, `fields`, `pagination` and `sorting` fields.

## Author
Alexander Mac

## License
Licensed under the MIT license.
