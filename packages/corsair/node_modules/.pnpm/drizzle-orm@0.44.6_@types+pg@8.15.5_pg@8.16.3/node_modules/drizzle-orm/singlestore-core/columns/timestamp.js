import { entityKind } from "../../entity.js";
import { sql } from "../../sql/sql.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { SingleStoreDateBaseColumn, SingleStoreDateColumnBaseBuilder } from "./date.common.js";
class SingleStoreTimestampBuilder extends SingleStoreDateColumnBaseBuilder {
  static [entityKind] = "SingleStoreTimestampBuilder";
  constructor(name) {
    super(name, "date", "SingleStoreTimestamp");
  }
  /** @internal */
  build(table) {
    return new SingleStoreTimestamp(
      table,
      this.config
    );
  }
  defaultNow() {
    return this.default(sql`CURRENT_TIMESTAMP`);
  }
}
class SingleStoreTimestamp extends SingleStoreDateBaseColumn {
  static [entityKind] = "SingleStoreTimestamp";
  getSQLType() {
    return `timestamp`;
  }
  mapFromDriverValue(value) {
    return /* @__PURE__ */ new Date(value + "+0000");
  }
  mapToDriverValue(value) {
    return value.toISOString().slice(0, -1).replace("T", " ");
  }
}
class SingleStoreTimestampStringBuilder extends SingleStoreDateColumnBaseBuilder {
  static [entityKind] = "SingleStoreTimestampStringBuilder";
  constructor(name) {
    super(name, "string", "SingleStoreTimestampString");
  }
  /** @internal */
  build(table) {
    return new SingleStoreTimestampString(
      table,
      this.config
    );
  }
  defaultNow() {
    return this.default(sql`CURRENT_TIMESTAMP`);
  }
}
class SingleStoreTimestampString extends SingleStoreDateBaseColumn {
  static [entityKind] = "SingleStoreTimestampString";
  getSQLType() {
    return `timestamp`;
  }
}
function timestamp(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config?.mode === "string") {
    return new SingleStoreTimestampStringBuilder(name);
  }
  return new SingleStoreTimestampBuilder(name);
}
export {
  SingleStoreTimestamp,
  SingleStoreTimestampBuilder,
  SingleStoreTimestampString,
  SingleStoreTimestampStringBuilder,
  timestamp
};
//# sourceMappingURL=timestamp.js.map