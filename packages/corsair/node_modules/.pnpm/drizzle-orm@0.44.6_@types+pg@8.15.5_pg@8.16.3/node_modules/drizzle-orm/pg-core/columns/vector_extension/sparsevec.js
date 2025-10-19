import { entityKind } from "../../../entity.js";
import { getColumnNameAndConfig } from "../../../utils.js";
import { PgColumn, PgColumnBuilder } from "../common.js";
class PgSparseVectorBuilder extends PgColumnBuilder {
  static [entityKind] = "PgSparseVectorBuilder";
  constructor(name, config) {
    super(name, "string", "PgSparseVector");
    this.config.dimensions = config.dimensions;
  }
  /** @internal */
  build(table) {
    return new PgSparseVector(
      table,
      this.config
    );
  }
}
class PgSparseVector extends PgColumn {
  static [entityKind] = "PgSparseVector";
  dimensions = this.config.dimensions;
  getSQLType() {
    return `sparsevec(${this.dimensions})`;
  }
}
function sparsevec(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new PgSparseVectorBuilder(name, config);
}
export {
  PgSparseVector,
  PgSparseVectorBuilder,
  sparsevec
};
//# sourceMappingURL=sparsevec.js.map