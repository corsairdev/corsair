import { entityKind } from "./entity.js";
class PrimaryKey {
  constructor(table, columns) {
    this.table = table;
    this.columns = columns;
  }
  static [entityKind] = "PrimaryKey";
}
export {
  PrimaryKey
};
//# sourceMappingURL=primary-key.js.map