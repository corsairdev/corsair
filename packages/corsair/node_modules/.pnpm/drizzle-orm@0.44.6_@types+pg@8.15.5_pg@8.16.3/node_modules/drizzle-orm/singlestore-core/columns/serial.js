import { entityKind } from "../../entity.js";
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.js";
class SingleStoreSerialBuilder extends SingleStoreColumnBuilderWithAutoIncrement {
  static [entityKind] = "SingleStoreSerialBuilder";
  constructor(name) {
    super(name, "number", "SingleStoreSerial");
    this.config.hasDefault = true;
    this.config.autoIncrement = true;
  }
  /** @internal */
  build(table) {
    return new SingleStoreSerial(
      table,
      this.config
    );
  }
}
class SingleStoreSerial extends SingleStoreColumnWithAutoIncrement {
  static [entityKind] = "SingleStoreSerial";
  getSQLType() {
    return "serial";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  }
}
function serial(name) {
  return new SingleStoreSerialBuilder(name ?? "");
}
export {
  SingleStoreSerial,
  SingleStoreSerialBuilder,
  serial
};
//# sourceMappingURL=serial.js.map