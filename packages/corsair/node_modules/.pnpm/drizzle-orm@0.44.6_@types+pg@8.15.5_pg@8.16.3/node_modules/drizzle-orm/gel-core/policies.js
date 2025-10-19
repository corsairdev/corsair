import { entityKind } from "../entity.js";
class GelPolicy {
  constructor(name, config) {
    this.name = name;
    if (config) {
      this.as = config.as;
      this.for = config.for;
      this.to = config.to;
      this.using = config.using;
      this.withCheck = config.withCheck;
    }
  }
  static [entityKind] = "GelPolicy";
  as;
  for;
  to;
  using;
  withCheck;
  /** @internal */
  _linkedTable;
  link(table) {
    this._linkedTable = table;
    return this;
  }
}
function gelPolicy(name, config) {
  return new GelPolicy(name, config);
}
export {
  GelPolicy,
  gelPolicy
};
//# sourceMappingURL=policies.js.map