## Migration from v1.x to v2.x

- Instead of `paramsProc.getEmptyParams`, use an instance of `QueryBuilder` child: `MongooseQueryBuilder` or `SequelizeQueryBuilder` (dependent on used database). Pass base `filter` object to constructor.
- Instead of `paramsProc.getEmptyObjectData`, use an instance of `DataBuilder`. Pass base `data` object to constructor.
- To build query or data object, use `instance.build` method. 
- Replace all calls of `paramsProc.process<Type>Param` to `instance.parse<Type>`. Remove second `output` parameter.
- Replace all `from` paramers to `source` in `process<Type>Param` (`parse<Type>`) methods.
- In v2 `QueryBuilder.parse<Type>` accepts query operator: `op` field, if it's not provided `eq` operator is used by default.
- Instead of `processId`, use `parseId`.
- Instead of `processIdList`, use `parseArray` with `itemType: 'id'`.
- Instead of `processIn`, use `parseArray` with `itemType: 'id'` and `op: in`.
- Instead of `processNin`, use `parseArray` with `itemType: 'id'` and `op: nin`.
