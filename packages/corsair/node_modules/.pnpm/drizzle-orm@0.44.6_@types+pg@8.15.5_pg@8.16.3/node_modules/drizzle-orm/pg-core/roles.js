import { entityKind } from "../entity.js";
class PgRole {
  constructor(name, config) {
    this.name = name;
    if (config) {
      this.createDb = config.createDb;
      this.createRole = config.createRole;
      this.inherit = config.inherit;
    }
  }
  static [entityKind] = "PgRole";
  /** @internal */
  _existing;
  /** @internal */
  createDb;
  /** @internal */
  createRole;
  /** @internal */
  inherit;
  existing() {
    this._existing = true;
    return this;
  }
}
function pgRole(name, config) {
  return new PgRole(name, config);
}
export {
  PgRole,
  pgRole
};
//# sourceMappingURL=roles.js.map