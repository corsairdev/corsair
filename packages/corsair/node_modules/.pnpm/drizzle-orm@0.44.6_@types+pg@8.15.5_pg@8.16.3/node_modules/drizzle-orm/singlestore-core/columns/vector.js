import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
class SingleStoreVectorBuilder extends SingleStoreColumnBuilder {
  static [entityKind] = "SingleStoreVectorBuilder";
  constructor(name, config) {
    super(name, "array", "SingleStoreVector");
    this.config.dimensions = config.dimensions;
    this.config.elementType = config.elementType;
  }
  /** @internal */
  build(table) {
    return new SingleStoreVector(
      table,
      this.config
    );
  }
  /** @internal */
  generatedAlwaysAs(as, config) {
    throw new Error("not implemented");
  }
}
class SingleStoreVector extends SingleStoreColumn {
  static [entityKind] = "SingleStoreVector";
  dimensions = this.config.dimensions;
  elementType = this.config.elementType;
  getSQLType() {
    return `vector(${this.dimensions}, ${this.elementType || "F32"})`;
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
  mapFromDriverValue(value) {
    return JSON.parse(value);
  }
}
function vector(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new SingleStoreVectorBuilder(name, config);
}
export {
  SingleStoreVector,
  SingleStoreVectorBuilder,
  vector
};
//# sourceMappingURL=vector.js.map