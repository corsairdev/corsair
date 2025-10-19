import { ColumnBuilder } from "../../column-builder.js";
import { Column } from "../../column.js";
import { entityKind } from "../../entity.js";
import { uniqueKeyName } from "../unique-constraint.js";
class SingleStoreColumnBuilder extends ColumnBuilder {
  static [entityKind] = "SingleStoreColumnBuilder";
  unique(name) {
    this.config.isUnique = true;
    this.config.uniqueName = name;
    return this;
  }
  // TODO: Implement generated columns for SingleStore (https://docs.singlestore.com/cloud/create-a-database/using-persistent-computed-columns/)
  /** @internal */
  generatedAlwaysAs(as, config) {
    this.config.generated = {
      as,
      type: "always",
      mode: config?.mode ?? "virtual"
    };
    return this;
  }
}
class SingleStoreColumn extends Column {
  constructor(table, config) {
    if (!config.uniqueName) {
      config.uniqueName = uniqueKeyName(table, [config.name]);
    }
    super(table, config);
    this.table = table;
  }
  static [entityKind] = "SingleStoreColumn";
}
class SingleStoreColumnBuilderWithAutoIncrement extends SingleStoreColumnBuilder {
  static [entityKind] = "SingleStoreColumnBuilderWithAutoIncrement";
  constructor(name, dataType, columnType) {
    super(name, dataType, columnType);
    this.config.autoIncrement = false;
  }
  autoincrement() {
    this.config.autoIncrement = true;
    this.config.hasDefault = true;
    return this;
  }
}
class SingleStoreColumnWithAutoIncrement extends SingleStoreColumn {
  static [entityKind] = "SingleStoreColumnWithAutoIncrement";
  autoIncrement = this.config.autoIncrement;
}
export {
  SingleStoreColumn,
  SingleStoreColumnBuilder,
  SingleStoreColumnBuilderWithAutoIncrement,
  SingleStoreColumnWithAutoIncrement
};
//# sourceMappingURL=common.js.map