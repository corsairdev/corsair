import { entityKind } from "../entity.js";
class TypedQueryBuilder {
  static [entityKind] = "TypedQueryBuilder";
  /** @internal */
  getSelectedFields() {
    return this._.selectedFields;
  }
}
export {
  TypedQueryBuilder
};
//# sourceMappingURL=query-builder.js.map