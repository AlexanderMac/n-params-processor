# <sub>v2.0.0-alpha</sub>
#### _Feb. 10, 2018_

  * Parameters processor class is devided into three classes: `BaseBuilder` and two its successors `QueryBuilder` and `DataBuilder`.
  * `QueryBuilder` has two successors `MongooseQueryBuilder` and `SequelizeQueryBuilder`. So in v2 `n-params-processor` can be used for creating queries for two databases.
  * All parsers moved to own classes.
  * All _parse_ methods renamed from _process<Type>_ to _parse<Type>_, `parseInt` for example.
  * No output parameters anymore. Builders contain internal `data` field, to return built data, `build` method should be used.
  * `QueryBuilder.parse<Type>` methods accepts `op` (operation) parameter.
  * Added `parseArray` for parsing array parameters.

# <sub>v1.1.1</sub>
#### _Nov. 26, 2017_

  * Fix package.json, add `src` folder to `files` section.

# <sub>v1.1.0</sub>
#### _Nov. 25, 2017_

 * Create complete readme.
 * Cover by tests all functionality.
 * Refactor and improve a lot of things.
 
# <sub>v1.0.0</sub>
#### _Apr. 6, 2017_

 * Initial release.
