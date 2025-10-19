import { entityKind, is } from "../entity.js";
class GelSequence {
  constructor(seqName, seqOptions, schema) {
    this.seqName = seqName;
    this.seqOptions = seqOptions;
    this.schema = schema;
  }
  static [entityKind] = "GelSequence";
}
function gelSequence(name, options) {
  return gelSequenceWithSchema(name, options, void 0);
}
function gelSequenceWithSchema(name, options, schema) {
  return new GelSequence(name, options, schema);
}
function isGelSequence(obj) {
  return is(obj, GelSequence);
}
export {
  GelSequence,
  gelSequence,
  gelSequenceWithSchema,
  isGelSequence
};
//# sourceMappingURL=sequence.js.map