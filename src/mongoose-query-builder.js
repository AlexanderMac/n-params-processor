const _ = require('lodash')
const consts = require('./consts')
const QueryBuilder = require('./query-builder')

const MONGOOSE_OPS = consts.OPERATORS.MONGOOSE_OPS

class MongooseQueryBuilder extends QueryBuilder {
  _buildFilter() {
    return _.reduce(this.data._filter_, (res, paramVal, paramName) => {
      let criterion = _.find(this.filterCriteria, { name: paramName })
      let dbSpecificOp = criterion && criterion.op ? MONGOOSE_OPS[criterion.op] : null
      if (dbSpecificOp) {
        res[paramName] = {
          [dbSpecificOp]: paramVal
        }
      } else {
        res[paramName] = paramVal
      }
      return res
    }, {})
  }

  _buildFields() {
    return _.join(this.data._fields_.fields, ' ')
  }

  _buildPagination() {
    return _.isEmpty(this.data._pagination_) ? null : this.data._pagination_
  }

  _buildSorting() {
    let sorting = this.data._sorting_
    if (_.isEmpty(sorting)) {
      return null
    }
    return {
      [sorting.by]: sorting.direction || 'asc'
    }
  }
}

module.exports = MongooseQueryBuilder
