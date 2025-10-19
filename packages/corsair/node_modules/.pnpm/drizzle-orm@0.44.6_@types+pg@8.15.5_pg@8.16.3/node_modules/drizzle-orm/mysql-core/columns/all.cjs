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
var all_exports = {};
__export(all_exports, {
  getMySqlColumnBuilders: () => getMySqlColumnBuilders
});
module.exports = __toCommonJS(all_exports);
var import_bigint = require("./bigint.cjs");
var import_binary = require("./binary.cjs");
var import_boolean = require("./boolean.cjs");
var import_char = require("./char.cjs");
var import_custom = require("./custom.cjs");
var import_date = require("./date.cjs");
var import_datetime = require("./datetime.cjs");
var import_decimal = require("./decimal.cjs");
var import_double = require("./double.cjs");
var import_enum = require("./enum.cjs");
var import_float = require("./float.cjs");
var import_int = require("./int.cjs");
var import_json = require("./json.cjs");
var import_mediumint = require("./mediumint.cjs");
var import_real = require("./real.cjs");
var import_serial = require("./serial.cjs");
var import_smallint = require("./smallint.cjs");
var import_text = require("./text.cjs");
var import_time = require("./time.cjs");
var import_timestamp = require("./timestamp.cjs");
var import_tinyint = require("./tinyint.cjs");
var import_varbinary = require("./varbinary.cjs");
var import_varchar = require("./varchar.cjs");
var import_year = require("./year.cjs");
function getMySqlColumnBuilders() {
  return {
    bigint: import_bigint.bigint,
    binary: import_binary.binary,
    boolean: import_boolean.boolean,
    char: import_char.char,
    customType: import_custom.customType,
    date: import_date.date,
    datetime: import_datetime.datetime,
    decimal: import_decimal.decimal,
    double: import_double.double,
    mysqlEnum: import_enum.mysqlEnum,
    float: import_float.float,
    int: import_int.int,
    json: import_json.json,
    mediumint: import_mediumint.mediumint,
    real: import_real.real,
    serial: import_serial.serial,
    smallint: import_smallint.smallint,
    text: import_text.text,
    time: import_time.time,
    timestamp: import_timestamp.timestamp,
    tinyint: import_tinyint.tinyint,
    varbinary: import_varbinary.varbinary,
    varchar: import_varchar.varchar,
    year: import_year.year,
    longtext: import_text.longtext,
    mediumtext: import_text.mediumtext,
    tinytext: import_text.tinytext
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getMySqlColumnBuilders
});
//# sourceMappingURL=all.cjs.map