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
var common_exports = {};
__export(common_exports, {
  getValueFromDataApi: () => getValueFromDataApi,
  toValueParam: () => toValueParam,
  typingsToAwsTypeHint: () => typingsToAwsTypeHint
});
module.exports = __toCommonJS(common_exports);
var import_client_rds_data = require("@aws-sdk/client-rds-data");
function getValueFromDataApi(field) {
  if (field.stringValue !== void 0) {
    return field.stringValue;
  } else if (field.booleanValue !== void 0) {
    return field.booleanValue;
  } else if (field.doubleValue !== void 0) {
    return field.doubleValue;
  } else if (field.isNull !== void 0) {
    return null;
  } else if (field.longValue !== void 0) {
    return field.longValue;
  } else if (field.blobValue !== void 0) {
    return field.blobValue;
  } else if (field.arrayValue !== void 0) {
    if (field.arrayValue.stringValues !== void 0) {
      return field.arrayValue.stringValues;
    }
    if (field.arrayValue.longValues !== void 0) {
      return field.arrayValue.longValues;
    }
    if (field.arrayValue.doubleValues !== void 0) {
      return field.arrayValue.doubleValues;
    }
    if (field.arrayValue.booleanValues !== void 0) {
      return field.arrayValue.booleanValues;
    }
    if (field.arrayValue.arrayValues !== void 0) {
      return field.arrayValue.arrayValues;
    }
    throw new Error("Unknown array type");
  } else {
    throw new Error("Unknown type");
  }
}
function typingsToAwsTypeHint(typings) {
  if (typings === "date") {
    return import_client_rds_data.TypeHint.DATE;
  } else if (typings === "decimal") {
    return import_client_rds_data.TypeHint.DECIMAL;
  } else if (typings === "json") {
    return import_client_rds_data.TypeHint.JSON;
  } else if (typings === "time") {
    return import_client_rds_data.TypeHint.TIME;
  } else if (typings === "timestamp") {
    return import_client_rds_data.TypeHint.TIMESTAMP;
  } else if (typings === "uuid") {
    return import_client_rds_data.TypeHint.UUID;
  } else {
    return void 0;
  }
}
function toValueParam(value, typings) {
  const response = {
    value: {},
    typeHint: typingsToAwsTypeHint(typings)
  };
  if (value === null) {
    response.value = { isNull: true };
  } else if (typeof value === "string") {
    switch (response.typeHint) {
      case import_client_rds_data.TypeHint.DATE: {
        response.value = { stringValue: value.split("T")[0] };
        break;
      }
      case import_client_rds_data.TypeHint.TIMESTAMP: {
        response.value = { stringValue: value.replace("T", " ").replace("Z", "") };
        break;
      }
      default: {
        response.value = { stringValue: value };
        break;
      }
    }
  } else if (typeof value === "number" && Number.isInteger(value)) {
    response.value = { longValue: value };
  } else if (typeof value === "number" && !Number.isInteger(value)) {
    response.value = { doubleValue: value };
  } else if (typeof value === "boolean") {
    response.value = { booleanValue: value };
  } else if (value instanceof Date) {
    response.value = { stringValue: value.toISOString().replace("T", " ").replace("Z", "") };
  } else {
    throw new Error(`Unknown type for ${value}`);
  }
  return response;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getValueFromDataApi,
  toValueParam,
  typingsToAwsTypeHint
});
//# sourceMappingURL=index.cjs.map