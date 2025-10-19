import { entityKind } from "../entity.js";
class PgPolicy {
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
  static [entityKind] = "PgPolicy";
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
function pgPolicy(name, config) {
  return new PgPolicy(name, config);
}
export {
  PgPolicy,
  pgPolicy
};
//# sourceMappingURL=policies.js.map