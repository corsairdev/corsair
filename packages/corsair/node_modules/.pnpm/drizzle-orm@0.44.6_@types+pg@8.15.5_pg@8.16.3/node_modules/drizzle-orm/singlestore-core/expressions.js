import { bindIfParam } from "../sql/expressions/index.js";
import { sql } from "../sql/sql.js";
export * from "../sql/expressions/index.js";
function concat(column, value) {
  return sql`${column} || ${bindIfParam(value, column)}`;
}
function substring(column, { from, for: _for }) {
  const chunks = [sql`substring(`, column];
  if (from !== void 0) {
    chunks.push(sql` from `, bindIfParam(from, column));
  }
  if (_for !== void 0) {
    chunks.push(sql` for `, bindIfParam(_for, column));
  }
  chunks.push(sql`)`);
  return sql.join(chunks);
}
function dotProduct(column, value) {
  return sql`${column} <*> ${JSON.stringify(value)}`;
}
function euclideanDistance(column, value) {
  return sql`${column} <-> ${JSON.stringify(value)}`;
}
export {
  concat,
  dotProduct,
  euclideanDistance,
  substring
};
//# sourceMappingURL=expressions.js.map