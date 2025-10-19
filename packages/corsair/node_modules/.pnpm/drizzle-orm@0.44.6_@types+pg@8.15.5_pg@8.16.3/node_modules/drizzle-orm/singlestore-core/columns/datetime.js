import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
class SingleStoreDateTimeBuilder extends SingleStoreColumnBuilder {
  /** @internal */
  // TODO: we need to add a proper support for SingleStore
  generatedAlwaysAs(_as, _config) {
    throw new Error("Method not implemented.");
  }
  static [entityKind] = "SingleStoreDateTimeBuilder";
  constructor(name) {
    super(name, "date", "SingleStoreDateTime");
  }
  /** @internal */
  build(table) {
    return new SingleStoreDateTime(
      table,
      this.config
    );
  }
}
class SingleStoreDateTime extends SingleStoreColumn {
  static [entityKind] = "SingleStoreDateTime";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return `datetime`;
  }
  mapToDriverValue(value) {
    return value.toISOString().replace("T", " ").replace("Z", "");
  }
  mapFromDriverValue(value) {
    return /* @__PURE__ */ new Date(value.replace(" ", "T") + "Z");
  }
}
class SingleStoreDateTimeStringBuilder extends SingleStoreColumnBuilder {
  /** @internal */
  // TODO: we need to add a proper support for SingleStore
  generatedAlwaysAs(_as, _config) {
    throw new Error("Method not implemented.");
  }
  static [entityKind] = "SingleStoreDateTimeStringBuilder";
  constructor(name) {
    super(name, "string", "SingleStoreDateTimeString");
  }
  /** @internal */
  build(table) {
    return new SingleStoreDateTimeString(
      table,
      this.config
    );
  }
}
class SingleStoreDateTimeString extends SingleStoreColumn {
  static [entityKind] = "SingleStoreDateTimeString";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return `datetime`;
  }
}
function datetime(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config?.mode === "string") {
    return new SingleStoreDateTimeStringBuilder(name);
  }
  return new SingleStoreDateTimeBuilder(name);
}
export {
  SingleStoreDateTime,
  SingleStoreDateTimeBuilder,
  SingleStoreDateTimeString,
  SingleStoreDateTimeStringBuilder,
  datetime
};
//# sourceMappingURL=datetime.js.map