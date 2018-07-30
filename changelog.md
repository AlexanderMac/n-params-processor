# <sub>v2.4.0</sub>
#### Jul. 30, 2018_
  * Added `CustomParser` to parse parameters using custom handler.
  * Added support for `CustomParser` in `ArrayParser`, not it accepts an additional `itemType: custom` and `itemHandler: () => ...`.
  
# <sub>v2.3.0</sub>
#### _Mar. 27, 2018_
  * Added `parseEmail` method to parse and validate email address parameter.

# <sub>v2.2.0</sub>
#### _Feb. 22, 2018_
  * Fixed processing of undefined values in `BaseBuilder`, now `parse<Type>` method returns `null` when value is undefined and `def` parameter is not provided.
  * Created new UTs, increased code coverage up to 100%.

# <sub>v2.1.0</sub>
#### _Feb. 12, 2018_

  * Added `formatRes` parameter to `parseDate` method. If this parameter is provided final date result converted to `Date` object or to string.
  * Added support for `like` query operator. For mongoose queries it replaced to `$eq`, for sequelize to `$like`.
  * Changed `def` parameter behavior, it's used when this value is not undefined.
  * Added validation for mandatory `parse<Type>` parameters: `source` and `name`.

# <sub>v2.0.0</sub>
#### _Feb. 11, 2018_

  * Parameters processor class is devided into three classes: `BaseBuilder` and two its successors `QueryBuilder` and `DataBuilder`.
  * `QueryBuilder` has two successors `MongooseQueryBuilder` and `SequelizeQueryBuilder`. So in v2 `n-params-processor` can be used for creating queries for two databases.
  * All parsers moved to own classes.
  * All _parse_ methods renamed from _process<Type>_ to _parse<Type>_, `parseInt` for example.
  * No output parameters anymore. Builders contain internal `data` field, to return built data, `build` method should be used.
  * `QueryBuilder.parse<Type>` methods accepts `op` (operation) parameter.
  * Added `parseArray` for parsing array parameters.

# <sub>v1.1.1</sub>
#### _Nov. 26, 2017_

  * Fixed package.json, add `src` folder to `files` section.

# <sub>v1.1.0</sub>
#### _Nov. 25, 2017_

 * Created complete readme.
 * Covered by tests all functionality.
 * Refactored and improved a lot of things.
 
# <sub>v1.0.0</sub>
#### _Apr. 6, 2017_

 * Initial release.
