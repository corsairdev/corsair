import { sql } from "../sql.js";
function asc(column) {
  return sql`${column} asc`;
}
function desc(column) {
  return sql`${column} desc`;
}
export {
  asc,
  desc
};
//# sourceMappingURL=select.js.map