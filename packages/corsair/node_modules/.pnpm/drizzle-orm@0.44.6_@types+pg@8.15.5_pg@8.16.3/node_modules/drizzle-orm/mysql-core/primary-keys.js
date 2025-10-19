import { entityKind } from "../entity.js";
import { MySqlTable } from "./table.js";
function primaryKey(...config) {
  if (config[0].columns) {
    return new PrimaryKeyBuilder(config[0].columns, config[0].name);
  }
  return new PrimaryKeyBuilder(config);
}
class PrimaryKeyBuilder {
  static [entityKind] = "MySqlPrimaryKeyBuilder";
  /** @internal */
  columns;
  /** @internal */
  name;
  constructor(columns, name) {
    this.columns = columns;
    this.name = name;
  }
  /** @internal */
  build(table) {
    return new PrimaryKey(table, this.columns, this.name);
  }
}
class PrimaryKey {
  constructor(table, columns, name) {
    this.table = table;
    this.columns = columns;
    this.name = name;
  }
  static [entityKind] = "MySqlPrimaryKey";
  columns;
  name;
  getName() {
    return this.name ?? `${this.table[MySqlTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
  }
}
export {
  PrimaryKey,
  PrimaryKeyBuilder,
  primaryKey
};
//# sourceMappingURL=primary-keys.js.map