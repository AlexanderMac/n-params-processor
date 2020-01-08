declare class ParamsProcessorError extends Error {}

declare class BaseBuilder {
  build(): object;
}

declare class DataBuilder extends BaseBuilder {}

declare class QueryBuilderData {
  filter: object;
  fields: string;
  pagination?: {
    page: number;
    count: number;
  };
}
declare class QueryBuilder extends BaseBuilder{}

declare class MongooseQueryBuilderData extends QueryBuilderData {
  sorting?: {
    sortyBy: string;
  }
}
declare class MongooseQueryBuilder extends QueryBuilder {
  build(): MongooseQueryBuilderData;
}

declare class SequelizeQueryData extends QueryBuilderData {
  sorting?: object[]; // TODO: incorrect declaration
}
declare class SequelizeQueryBuilder extends QueryBuilder {
  build(): SequelizeQueryData;
}

export class ParamsProcessor {
  ParamsProcessorError: ParamsProcessorError;
  DataBuilder: DataBuilder;
  MongooseQueryBuilder: MongooseQueryBuilder;
  SequelizeQueryBuilder: SequelizeQueryBuilder;
}
