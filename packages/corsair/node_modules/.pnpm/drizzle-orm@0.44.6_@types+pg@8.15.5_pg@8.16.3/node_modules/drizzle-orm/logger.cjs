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
var logger_exports = {};
__export(logger_exports, {
  ConsoleLogWriter: () => ConsoleLogWriter,
  DefaultLogger: () => DefaultLogger,
  NoopLogger: () => NoopLogger
});
module.exports = __toCommonJS(logger_exports);
var import_entity = require("./entity.cjs");
class ConsoleLogWriter {
  static [import_entity.entityKind] = "ConsoleLogWriter";
  write(message) {
    console.log(message);
  }
}
class DefaultLogger {
  static [import_entity.entityKind] = "DefaultLogger";
  writer;
  constructor(config) {
    this.writer = config?.writer ?? new ConsoleLogWriter();
  }
  logQuery(query, params) {
    const stringifiedParams = params.map((p) => {
      try {
        return JSON.stringify(p);
      } catch {
        return String(p);
      }
    });
    const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(", ")}]` : "";
    this.writer.write(`Query: ${query}${paramsStr}`);
  }
}
class NoopLogger {
  static [import_entity.entityKind] = "NoopLogger";
  logQuery() {
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ConsoleLogWriter,
  DefaultLogger,
  NoopLogger
});
//# sourceMappingURL=logger.cjs.map