# <sub>v5.0.0</sub>
#### _Jan. 8, 2020_
  * Use an internal error object and throw it in the package instead of the object registered in `registerCustomErrorType`.
  * Create typings file.

# <sub>v4.1.1</sub>
#### _Sep. 24, 2019_
  * Fix bug in arrayParser, that prevented using the such items as `ObjectId`.

# <sub>v4.1.0</sub>
#### _Jun. 18, 2019_
  * Add `pattern` parameter in regexp parser.

# <sub>v4.0.2</sub>
#### _Apr. 6, 2019_
  * Update packages to the last versions.

# <sub>v4.0.1</sub>
#### Dec. 7, 2018_
  * Fix external `buildPagination` function, currently it returns `null` when pagination object is empty.

# <sub>v4.0.0</sub>
#### Dec. 7, 2018_
  * `parsePagination` and `parseSorting` don't return default objects by default.

# <sub>v3.1.0</sub>
#### Dec. 3, 2018_
  * Fix object schema for MongooseQB sorting.

# <sub>v3.0.1</sub>
#### Dec. 2, 2018_
  * Update email regexp.

# <sub>v3.0.0</sub>
#### Nov. 25, 2018_
  * Remove `$eq` operator by default from `QueryBuilder`.
  * Add `allowed` parameter (an array of allowed fields for sortBy).

# <sub>v2.5.1</sub>
#### _Sep. 5, 2018_
  * Minor fixes.

# <sub>v2.5.0</sub>
#### _Sep. 5, 2018_
  * Fix `buildSorting` method for Sequelize, currently it returns the correct value in `[[sortBy, sortDirection]]` format.

# <sub>v2.4.0</sub>
#### _Jul. 30, 2018_
  * Add `CustomParser` to parse parameters using custom handler.
  * Add support for `CustomParser` in `ArrayParser`, currently it accepts an additional `itemType: custom` and `itemHandler: () => ...`.

# <sub>v2.3.0</sub>
#### _Mar. 27, 2018_
  * Add `parseEmail` method to parse and validate email address parameter.

# <sub>v2.2.0</sub>
#### _Feb. 22, 2018_
  * Fix processing of undefined values in `BaseBuilder`. Currently `parse<Type>` method returns `null` when value is undefined and `def` parameter is not provided.
  * Create new UTs, increase the code coverage up to 100%.

# <sub>v2.1.0</sub>
#### _Feb. 12, 2018_

  * Add `formatRes` parameter to `parseDate` method. If this parameter is provided, the final date result converted to `Date` object or to string.
  * Add support for `like` query operator. For mongoose queries it's replacing to `$eq`, for sequelize to `$like`.
  * Change `def` parameter behavior, it's using when the value is not undefined.
  * Add validation for mandatory `parse<Type>` parameters: `source` and `name`.

# <sub>v2.0.0</sub>
#### _Feb. 11, 2018_

  * Devide parameters processor class into three classes: `BaseBuilder` and two its successors `QueryBuilder` and `DataBuilder`.
  * `QueryBuilder` has two successors `MongooseQueryBuilder` and `SequelizeQueryBuilder`. So in v2 `n-params-processor` can be used for creating queries for two databases.
  * Move all parsers to own classes.
  * Rename all _parse_ methods from _process<Type>_ to _parse<Type>_ (`parseInt` for example).
  * No output parameters anymore. Builders contain internal `data` field, to return built data, `build` method should be used.
  * `QueryBuilder.parse<Type>` methods accepts `op` (operation) parameter.
  * Add `parseArray` for parsing array parameters.

# <sub>v1.1.1</sub>
#### _Nov. 26, 2017_

  * Fix package.json, add `src` folder to `files` section.

# <sub>v1.1.0</sub>
#### _Nov. 25, 2017_

 * Create the complete readme.
 * Cover by tests all the functionality.
 * Refactor and improve a lot of things.
 
# <sub>v1.0.0</sub>
#### _Apr. 6, 2017_

 * Release the first version.
