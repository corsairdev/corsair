import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
class MySqlTextBuilder extends MySqlColumnBuilder {
  static [entityKind] = "MySqlTextBuilder";
  constructor(name, textType, config) {
    super(name, "string", "MySqlText");
    this.config.textType = textType;
    this.config.enumValues = config.enum;
  }
  /** @internal */
  build(table) {
    return new MySqlText(table, this.config);
  }
}
class MySqlText extends MySqlColumn {
  static [entityKind] = "MySqlText";
  textType = this.config.textType;
  enumValues = this.config.enumValues;
  getSQLType() {
    return this.textType;
  }
}
function text(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new MySqlTextBuilder(name, "text", config);
}
function tinytext(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new MySqlTextBuilder(name, "tinytext", config);
}
function mediumtext(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new MySqlTextBuilder(name, "mediumtext", config);
}
function longtext(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new MySqlTextBuilder(name, "longtext", config);
}
export {
  MySqlText,
  MySqlTextBuilder,
  longtext,
  mediumtext,
  text,
  tinytext
};
//# sourceMappingURL=text.js.map