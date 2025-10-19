import { entityKind, is } from "../entity.js";
import { mysqlTableWithSchema } from "./table.js";
import { mysqlViewWithSchema } from "./view.js";
class MySqlSchema {
  constructor(schemaName) {
    this.schemaName = schemaName;
  }
  static [entityKind] = "MySqlSchema";
  table = (name, columns, extraConfig) => {
    return mysqlTableWithSchema(name, columns, extraConfig, this.schemaName);
  };
  view = (name, columns) => {
    return mysqlViewWithSchema(name, columns, this.schemaName);
  };
}
function isMySqlSchema(obj) {
  return is(obj, MySqlSchema);
}
function mysqlDatabase(name) {
  return new MySqlSchema(name);
}
const mysqlSchema = mysqlDatabase;
export {
  MySqlSchema,
  isMySqlSchema,
  mysqlDatabase,
  mysqlSchema
};
//# sourceMappingURL=schema.js.map