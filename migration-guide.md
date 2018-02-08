## Migration from v1.x to v2.x

- Instead of `paramsProc.getEmptyParams`, create an instance of `QueryBuilder` child: `MongooseQueryBuilder` or `SequelizeQueryBuilder` (dependent on used database). Pass base `filter` object to constructor.
- Instead of `paramsProc.getEmptyObjectData`, create an instance of `DataBuilder`. Pass base `data` object to constructor.
- To build query or data object, use `instance.build` method. 
- Replace all calls of `paramsProc.process<Type>Param` to `instance.parse<Type>`. Remove second `output` parameter.
- In v2 `QueryBuilder.parse<Type>` accepts query operator `op` field, if it's not provided `eq` operator is used by default.
- Instead of `processId`, use `parseInt` with `min: 0`.
- Instead of `processIdList`, use `parseArray` with `itemType: 'int'`.
- Instead of `processIn`, use `parseArray` with `itemType: 'int'` and `op: in`.
- Instead of `processNin`, use `parseArray` with `itemType: 'int'` and `op: nin`.
