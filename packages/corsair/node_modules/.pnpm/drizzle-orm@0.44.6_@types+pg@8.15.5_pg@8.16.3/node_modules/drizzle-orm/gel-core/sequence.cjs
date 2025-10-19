"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var sequence_exports = {};
__export(sequence_exports, {
  GelSequence: () => GelSequence,
  gelSequence: () => gelSequence,
  gelSequenceWithSchema: () => gelSequenceWithSchema,
  isGelSequence: () => isGelSequence
});
module.exports = __toCommonJS(sequence_exports);
var import_entity = require("../entity.cjs");
class GelSequence {
  constructor(seqName, seqOptions, schema) {
    this.seqName = seqName;
    this.seqOptions = seqOptions;
    this.schema = schema;
  }
  static [import_entity.entityKind] = "GelSequence";
}
function gelSequence(name, options) {
  return gelSequenceWithSchema(name, options, void 0);
}
function gelSequenceWithSchema(name, options, schema) {
  return new GelSequence(name, options, schema);
}
function isGelSequence(obj) {
  return (0, import_entity.is)(obj, GelSequence);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelSequence,
  gelSequence,
  gelSequenceWithSchema,
  isGelSequence
});
//# sourceMappingURL=sequence.cjs.map