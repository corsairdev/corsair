import { is } from "../entity.js";
import { SQL } from "../sql/sql.js";
import { Subquery } from "../subquery.js";
import { Table } from "../table.js";
import { IndexBuilder } from "./indexes.js";
import { PrimaryKeyBuilder } from "./primary-keys.js";
import { SingleStoreTable } from "./table.js";
import { UniqueConstraintBuilder } from "./unique-constraint.js";
function extractUsedTable(table) {
  if (is(table, SingleStoreTable)) {
    return [`${table[Table.Symbol.BaseName]}`];
  }
  if (is(table, Subquery)) {
    return table._.usedTables ?? [];
  }
  if (is(table, SQL)) {
    return table.usedTables ?? [];
  }
  return [];
}
function getTableConfig(table) {
  const columns = Object.values(table[SingleStoreTable.Symbol.Columns]);
  const indexes = [];
  const primaryKeys = [];
  const uniqueConstraints = [];
  const name = table[Table.Symbol.Name];
  const schema = table[Table.Symbol.Schema];
  const baseName = table[Table.Symbol.BaseName];
  const extraConfigBuilder = table[SingleStoreTable.Symbol.ExtraConfigBuilder];
  if (extraConfigBuilder !== void 0) {
    const extraConfig = extraConfigBuilder(table[SingleStoreTable.Symbol.Columns]);
    const extraValues = Array.isArray(extraConfig) ? extraConfig.flat(1) : Object.values(extraConfig);
    for (const builder of Object.values(extraValues)) {
      if (is(builder, IndexBuilder)) {
        indexes.push(builder.build(table));
      } else if (is(builder, UniqueConstraintBuilder)) {
        uniqueConstraints.push(builder.build(table));
      } else if (is(builder, PrimaryKeyBuilder)) {
        primaryKeys.push(builder.build(table));
      }
    }
  }
  return {
    columns,
    indexes,
    primaryKeys,
    uniqueConstraints,
    name,
    schema,
    baseName
  };
}
export {
  extractUsedTable,
  getTableConfig
};
//# sourceMappingURL=utils.js.map