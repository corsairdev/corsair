import { entityKind } from "../entity.js";
class GelRole {
  constructor(name, config) {
    this.name = name;
    if (config) {
      this.createDb = config.createDb;
      this.createRole = config.createRole;
      this.inherit = config.inherit;
    }
  }
  static [entityKind] = "GelRole";
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
function gelRole(name, config) {
  return new GelRole(name, config);
}
export {
  GelRole,
  gelRole
};
//# sourceMappingURL=roles.js.map