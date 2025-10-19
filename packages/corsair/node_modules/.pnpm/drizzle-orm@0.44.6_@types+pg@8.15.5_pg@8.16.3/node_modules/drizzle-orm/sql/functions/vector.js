import { sql } from "../sql.js";
function toSql(value) {
  return JSON.stringify(value);
}
function l2Distance(column, value) {
  if (Array.isArray(value)) {
    return sql`${column} <-> ${toSql(value)}`;
  }
  return sql`${column} <-> ${value}`;
}
function l1Distance(column, value) {
  if (Array.isArray(value)) {
    return sql`${column} <+> ${toSql(value)}`;
  }
  return sql`${column} <+> ${value}`;
}
function innerProduct(column, value) {
  if (Array.isArray(value)) {
    return sql`${column} <#> ${toSql(value)}`;
  }
  return sql`${column} <#> ${value}`;
}
function cosineDistance(column, value) {
  if (Array.isArray(value)) {
    return sql`${column} <=> ${toSql(value)}`;
  }
  return sql`${column} <=> ${value}`;
}
function hammingDistance(column, value) {
  if (Array.isArray(value)) {
    return sql`${column} <~> ${toSql(value)}`;
  }
  return sql`${column} <~> ${value}`;
}
function jaccardDistance(column, value) {
  if (Array.isArray(value)) {
    return sql`${column} <%> ${toSql(value)}`;
  }
  return sql`${column} <%> ${value}`;
}
export {
  cosineDistance,
  hammingDistance,
  innerProduct,
  jaccardDistance,
  l1Distance,
  l2Distance
};
//# sourceMappingURL=vector.js.map