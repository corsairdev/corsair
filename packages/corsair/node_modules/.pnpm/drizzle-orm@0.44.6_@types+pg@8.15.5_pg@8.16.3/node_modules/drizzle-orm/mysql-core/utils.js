import { is } from "../entity.js";
import { SQL } from "../index.js";
import { Subquery } from "../subquery.js";
import { Table } from "../table.js";
import { ViewBaseConfig } from "../view-common.js";
import { CheckBuilder } from "./checks.js";
import { ForeignKeyBuilder } from "./foreign-keys.js";
import { IndexBuilder } from "./indexes.js";
import { PrimaryKeyBuilder } from "./primary-keys.js";
import { MySqlTable } from "./table.js";
import { UniqueConstraintBuilder } from "./unique-constraint.js";
import { MySqlViewConfig } from "./view-common.js";
function extractUsedTable(table) {
  if (is(table, MySqlTable)) {
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
  const columns = Object.values(table[MySqlTable.Symbol.Columns]);
  const indexes = [];
  const checks = [];
  const primaryKeys = [];
  const uniqueConstraints = [];
  const foreignKeys = Object.values(table[MySqlTable.Symbol.InlineForeignKeys]);
  const name = table[Table.Symbol.Name];
  const schema = table[Table.Symbol.Schema];
  const baseName = table[Table.Symbol.BaseName];
  const extraConfigBuilder = table[MySqlTable.Symbol.ExtraConfigBuilder];
  if (extraConfigBuilder !== void 0) {
    const extraConfig = extraConfigBuilder(table[MySqlTable.Symbol.Columns]);
    const extraValues = Array.isArray(extraConfig) ? extraConfig.flat(1) : Object.values(extraConfig);
    for (const builder of Object.values(extraValues)) {
      if (is(builder, IndexBuilder)) {
        indexes.push(builder.build(table));
      } else if (is(builder, CheckBuilder)) {
        checks.push(builder.build(table));
      } else if (is(builder, UniqueConstraintBuilder)) {
        uniqueConstraints.push(builder.build(table));
      } else if (is(builder, PrimaryKeyBuilder)) {
        primaryKeys.push(builder.build(table));
      } else if (is(builder, ForeignKeyBuilder)) {
        foreignKeys.push(builder.build(table));
      }
    }
  }
  return {
    columns,
    indexes,
    foreignKeys,
    checks,
    primaryKeys,
    uniqueConstraints,
    name,
    schema,
    baseName
  };
}
function getViewConfig(view) {
  return {
    ...view[ViewBaseConfig],
    ...view[MySqlViewConfig]
  };
}
function convertIndexToString(indexes) {
  return indexes.map((idx) => {
    return typeof idx === "object" ? idx.config.name : idx;
  });
}
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
export {
  convertIndexToString,
  extractUsedTable,
  getTableConfig,
  getViewConfig,
  toArray
};
//# sourceMappingURL=utils.js.map