'use strict';

const _           = require('lodash');
const BaseBuilder = require('./base-builder');

class QueryBuilder extends BaseBuilder {
  constructor({ source, filter } = {}) {
    super({ source });
    this.data._filter_ = filter || {};
    this.data._fields_ = {};
    this.data._pagination_ = {};
    this.data._sorting_ = {};
    this.filterCriteria = [];
  }

  parseFields({ source, fieldsName, allowed, def }) {
    fieldsName = fieldsName || 'fields';

    // convert val to string or use default when val is nil
    let res = this.parseString({ source, name: fieldsName, az: 'fields', to: '_fields_', def });
    // init new source, with fields array value
    source = {
      'fields': _.split(res.val, ' ')
    };
    allowed = _.split(allowed, ' ');
    // use ArrayParser to validate fields
    this.parseArray({ source, name: 'fields', to: '_fields_', allowed, itemType: 'string' });

    return this.data._fields_;
  }

  parsePagination({ source, pageName, countName }) {
    pageName = pageName || 'page';
    countName = countName || 'count';
    let to = '_pagination_';

    this.parseInt({ source, name: pageName, az: 'page', to, min: 0, def: 0 });
    this.parseInt({ source, name: countName, az: 'count', to, min: 1, max: 50, def: 10 });

    return this.data._pagination_;
  }

  parseSorting({ source, sortByName, sortDirName }) {
    sortByName = sortByName || 'sortBy';
    sortDirName = sortDirName || 'sortDirection';
    let to = '_sorting_';

    this.parseString({ source, name: sortByName, az: 'sortBy', to, def: 'id' });
    this.parseString({ source, name: sortDirName, az: 'sortDirection', to, allowed: ['asc', 'desc'], def: 'asc' });

    return this.data._sorting_;
  }

  build() {
    return {
      filter: this._buildFilter(),
      fields: this._buildFields() ,
      pagination: this._buildPagination(),
      sorting: this._buildSorting()
    };
  }

  _registerOneParseFunction(parserName) {
    let parseFnName = super._registerOneParseFunction(parserName);

    this[parseFnName] = (params) => {
      if (_.isNil(params.to)) {
        params.to = '_filter_';
      }
      let res = super[parseFnName](params);
      if (params.to === '_filter_') {
        this.filterCriteria.push({
          name: res.name,
          op: params.op
        });
      }
      return res;
    };

    return parseFnName;
  }
}

module.exports = QueryBuilder;
