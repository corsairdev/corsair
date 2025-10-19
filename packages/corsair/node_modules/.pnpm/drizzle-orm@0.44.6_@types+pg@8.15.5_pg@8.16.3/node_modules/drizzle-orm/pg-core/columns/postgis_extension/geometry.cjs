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
var geometry_exports = {};
__export(geometry_exports, {
  PgGeometry: () => PgGeometry,
  PgGeometryBuilder: () => PgGeometryBuilder,
  PgGeometryObject: () => PgGeometryObject,
  PgGeometryObjectBuilder: () => PgGeometryObjectBuilder,
  geometry: () => geometry
});
module.exports = __toCommonJS(geometry_exports);
var import_entity = require("../../../entity.cjs");
var import_utils = require("../../../utils.cjs");
var import_common = require("../common.cjs");
var import_utils2 = require("./utils.cjs");
class PgGeometryBuilder extends import_common.PgColumnBuilder {
  static [import_entity.entityKind] = "PgGeometryBuilder";
  constructor(name) {
    super(name, "array", "PgGeometry");
  }
  /** @internal */
  build(table) {
    return new PgGeometry(
      table,
      this.config
    );
  }
}
class PgGeometry extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgGeometry";
  getSQLType() {
    return "geometry(point)";
  }
  mapFromDriverValue(value) {
    return (0, import_utils2.parseEWKB)(value);
  }
  mapToDriverValue(value) {
    return `point(${value[0]} ${value[1]})`;
  }
}
class PgGeometryObjectBuilder extends import_common.PgColumnBuilder {
  static [import_entity.entityKind] = "PgGeometryObjectBuilder";
  constructor(name) {
    super(name, "json", "PgGeometryObject");
  }
  /** @internal */
  build(table) {
    return new PgGeometryObject(
      table,
      this.config
    );
  }
}
class PgGeometryObject extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgGeometryObject";
  getSQLType() {
    return "geometry(point)";
  }
  mapFromDriverValue(value) {
    const parsed = (0, import_utils2.parseEWKB)(value);
    return { x: parsed[0], y: parsed[1] };
  }
  mapToDriverValue(value) {
    return `point(${value.x} ${value.y})`;
  }
}
function geometry(a, b) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  if (!config?.mode || config.mode === "tuple") {
    return new PgGeometryBuilder(name);
  }
  return new PgGeometryObjectBuilder(name);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PgGeometry,
  PgGeometryBuilder,
  PgGeometryObject,
  PgGeometryObjectBuilder,
  geometry
});
//# sourceMappingURL=geometry.cjs.map