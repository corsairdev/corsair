import { entityKind } from "../entity.js";
class CheckBuilder {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
  static [entityKind] = "MySqlCheckBuilder";
  brand;
  /** @internal */
  build(table) {
    return new Check(table, this);
  }
}
class Check {
  constructor(table, builder) {
    this.table = table;
    this.name = builder.name;
    this.value = builder.value;
  }
  static [entityKind] = "MySqlCheck";
  name;
  value;
}
function check(name, value) {
  return new CheckBuilder(name, value);
}
export {
  Check,
  CheckBuilder,
  check
};
//# sourceMappingURL=checks.js.map