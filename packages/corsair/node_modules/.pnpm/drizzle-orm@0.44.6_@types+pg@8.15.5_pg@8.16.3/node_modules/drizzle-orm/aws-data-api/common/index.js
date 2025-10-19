import { TypeHint } from "@aws-sdk/client-rds-data";
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
    return TypeHint.DATE;
  } else if (typings === "decimal") {
    return TypeHint.DECIMAL;
  } else if (typings === "json") {
    return TypeHint.JSON;
  } else if (typings === "time") {
    return TypeHint.TIME;
  } else if (typings === "timestamp") {
    return TypeHint.TIMESTAMP;
  } else if (typings === "uuid") {
    return TypeHint.UUID;
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
      case TypeHint.DATE: {
        response.value = { stringValue: value.split("T")[0] };
        break;
      }
      case TypeHint.TIMESTAMP: {
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
export {
  getValueFromDataApi,
  toValueParam,
  typingsToAwsTypeHint
};
//# sourceMappingURL=index.js.map