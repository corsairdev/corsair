import { entityKind, is } from "../entity.js";
import { singlestoreTableWithSchema } from "./table.js";
class SingleStoreSchema {
  constructor(schemaName) {
    this.schemaName = schemaName;
  }
  static [entityKind] = "SingleStoreSchema";
  table = (name, columns, extraConfig) => {
    return singlestoreTableWithSchema(name, columns, extraConfig, this.schemaName);
  };
  /*
  view = ((name, columns) => {
  	return singlestoreViewWithSchema(name, columns, this.schemaName);
  }) as typeof singlestoreView; */
}
function isSingleStoreSchema(obj) {
  return is(obj, SingleStoreSchema);
}
function singlestoreDatabase(name) {
  return new SingleStoreSchema(name);
}
const singlestoreSchema = singlestoreDatabase;
export {
  SingleStoreSchema,
  isSingleStoreSchema,
  singlestoreDatabase,
  singlestoreSchema
};
//# sourceMappingURL=schema.js.map