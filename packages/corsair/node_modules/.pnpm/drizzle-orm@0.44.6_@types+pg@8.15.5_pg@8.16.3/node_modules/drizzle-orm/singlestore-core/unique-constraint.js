import { entityKind } from "../entity.js";
import { TableName } from "../table.utils.js";
function unique(name) {
  return new UniqueOnConstraintBuilder(name);
}
function uniqueKeyName(table, columns) {
  return `${table[TableName]}_${columns.join("_")}_unique`;
}
class UniqueConstraintBuilder {
  constructor(columns, name) {
    this.name = name;
    this.columns = columns;
  }
  static [entityKind] = "SingleStoreUniqueConstraintBuilder";
  /** @internal */
  columns;
  /** @internal */
  build(table) {
    return new UniqueConstraint(table, this.columns, this.name);
  }
}
class UniqueOnConstraintBuilder {
  static [entityKind] = "SingleStoreUniqueOnConstraintBuilder";
  /** @internal */
  name;
  constructor(name) {
    this.name = name;
  }
  on(...columns) {
    return new UniqueConstraintBuilder(columns, this.name);
  }
}
class UniqueConstraint {
  constructor(table, columns, name) {
    this.table = table;
    this.columns = columns;
    this.name = name ?? uniqueKeyName(this.table, this.columns.map((column) => column.name));
  }
  static [entityKind] = "SingleStoreUniqueConstraint";
  columns;
  name;
  nullsNotDistinct = false;
  getName() {
    return this.name;
  }
}
export {
  UniqueConstraint,
  UniqueConstraintBuilder,
  UniqueOnConstraintBuilder,
  unique,
  uniqueKeyName
};
//# sourceMappingURL=unique-constraint.js.map