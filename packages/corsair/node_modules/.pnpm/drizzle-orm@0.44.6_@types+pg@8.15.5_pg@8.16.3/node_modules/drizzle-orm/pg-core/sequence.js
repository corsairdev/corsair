import { entityKind, is } from "../entity.js";
class PgSequence {
  constructor(seqName, seqOptions, schema) {
    this.seqName = seqName;
    this.seqOptions = seqOptions;
    this.schema = schema;
  }
  static [entityKind] = "PgSequence";
}
function pgSequence(name, options) {
  return pgSequenceWithSchema(name, options, void 0);
}
function pgSequenceWithSchema(name, options, schema) {
  return new PgSequence(name, options, schema);
}
function isPgSequence(obj) {
  return is(obj, PgSequence);
}
export {
  PgSequence,
  isPgSequence,
  pgSequence,
  pgSequenceWithSchema
};
//# sourceMappingURL=sequence.js.map