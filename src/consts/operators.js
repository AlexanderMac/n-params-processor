const ALIASES = {
  eq: 'eq',
  ne: 'ne',
  gt: 'gt',
  gte: 'gte',
  lt: 'lt',
  lte: 'lte',
  in: 'in',
  nin: 'nin',
  like: 'like'
};

const MONGOOSE_OPS = {
  [ALIASES.eq]: '$eq',
  [ALIASES.ne]: '$ne',
  [ALIASES.gt]: '$gt',
  [ALIASES.gte]: '$gte',
  [ALIASES.lt]: '$lte',
  [ALIASES.lte]: '$lte',
  [ALIASES.in]: '$in',
  [ALIASES.nin]: '$nin',
  [ALIASES.like]: '$eq' // TODO: use $text
};

const SEQUELIZE_OPS = {
  [ALIASES.eq]: '$eq',
  [ALIASES.ne]: '$ne',
  [ALIASES.gt]: '$gt',
  [ALIASES.gte]: '$gte',
  [ALIASES.lt]: '$lte',
  [ALIASES.lte]: '$lte',
  [ALIASES.in]: '$in',
  [ALIASES.nin]: '$notIn',
  [ALIASES.like]: '$like'
};

module.exports = {
  ALIASES,
  MONGOOSE_OPS,
  SEQUELIZE_OPS
};

/* eslint max-len: off */
// MONGOOSE:

/* Comparison:
$eq     - Matches values that are equal to a specified value.
$ne     - Matches all values that are not equal to a specified value.
$gt     - Matches values that are greater than a specified value.
$gte    - Matches values that are greater than or equal to a specified value.
$lt     - Matches values that are less than a specified value.
$lte    - Matches values that are less than or equal to a specified value.
$in     - Matches any of the values specified in an array.
$nin    - Matches none of the values specified in an array.
*/
/* Logical:
$and    - Joins query clauses with a logical AND returns all documents that match the conditions of both clauses.
$not    - Inverts the effect of a query expression and returns documents that do not match the query expression.
$nor    - Joins query clauses with a logical NOR returns all documents that fail to match both clauses.
$or     - Joins query clauses with a logical OR returns all documents that match the conditions of either clause.
*/
/* Element:
$exists - Matches documents that have the specified field.
$type   - Selects documents if a field is of the specified type.
*/
/* Geospatial:
$geoIntersects  - Selects geometries that intersect with a GeoJSON geometry. The 2dsphere index supports $geoIntersects.
$geoWithin  - Selects geometries within a bounding GeoJSON geometry. The 2dsphere and 2d indexes support $geoWithin.
$near  - Returns geospatial objects in proximity to a point. Requires a geospatial index. The 2dsphere and 2d indexes support $near.
$nearSphere  - Returns geospatial objects in proximity to a point on a sphere. Requires a geospatial index. The 2dsphere and 2d indexes support $nearSphere.
*/
/* Array:
$all  - Matches arrays that contain all elements specified in the query.
$elemMatch  - Selects documents if element in the array field matches all the specified $elemMatch conditions.
$size  - Selects documents if the array field is a specified size.
*/
/* Evaluation:
$mod  - Performs a modulo operation on the value of a field and selects documents with a specified result.
$regex  - Selects documents where values match a specified regular expression.
$text  - Performs text search.
$where  - Matches documents that satisfy a JavaScript expression.
*/


// SEQUELIZE:

/* Comparison:
$eq: 3,                // = 3
$ne: 20,               // != 20
$gt: 6,                // > 6
$gte: 6,               // >= 6
$lt: 10,               // < 10
$lte: 10,              // <= 10
$in: [1, 2],           // IN [1, 2]
$notIn: [1, 2],        // NOT IN [1, 2]
*/

/* Logical:
$and: {a: 5}           // AND (a = 5)
$not: true,            // IS NOT TRUE
$or: [{a: 5}, {a: 6}]  // (a = 5 OR a = 6)
*/

/*
$between: [6, 10],     // BETWEEN 6 AND 10
$notBetween: [11, 15], // NOT BETWEEN 11 AND 15

$like: '%hat',         // LIKE '%hat'
$notLike: '%hat'       // NOT LIKE '%hat'
$iLike: '%hat'         // ILIKE '%hat' (case insensitive) (PG only)
$notILike: '%hat'      // NOT ILIKE '%hat'  (PG only)

$regexp: '^[h|a|t]'    // REGEXP/~ '^[h|a|t]' (MySQL/PG only)
$notRegexp: '^[h|a|t]' // NOT REGEXP/!~ '^[h|a|t]' (MySQL/PG only)
$iRegexp: '^[h|a|t]'    // ~* '^[h|a|t]' (PG only)
$notIRegexp: '^[h|a|t]' // !~* '^[h|a|t]' (PG only)
$like: { $any: ['cat', 'hat']} // LIKE ANY ARRAY['cat', 'hat'] - also works for iLike and notLike
$overlap: [1, 2]       // && [1, 2] (PG array overlap operator)
$contains: [1, 2]      // @> [1, 2] (PG array contains operator)
$contained: [1, 2]     // <@ [1, 2] (PG array contained by operator)
$any: [2,3]            // ANY ARRAY[2, 3]:INTEGER (PG only)

$col: 'user.organization_id' // = "user"."organization_id", with dialect specific column identifiers, PG in this example
*/

/* range:
$contains: 2           // @> '2'::integer (PG range contains element operator)
$contains: [1, 2]      // @> [1, 2) (PG range contains range operator)
$contained: [1, 2]     // <@ [1, 2) (PG range is contained by operator)
$overlap: [1, 2]       // && [1, 2) (PG range overlap (have points in common) operator)
$adjacent: [1, 2]      // -|- [1, 2) (PG range is adjacent to operator)
$strictLeft: [1, 2]    // << [1, 2) (PG range strictly left of operator)
$strictRight: [1, 2]   // >> [1, 2) (PG range strictly right of operator)
$noExtendRight: [1, 2] // &< [1, 2) (PG range does not extend to the right of operator)
$noExtendLeft: [1, 2]  // &> [1, 2) (PG range does not extend to the left of operator)
*/
