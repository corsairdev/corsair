import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
class SingleStoreTextBuilder extends SingleStoreColumnBuilder {
  static [entityKind] = "SingleStoreTextBuilder";
  constructor(name, textType, config) {
    super(name, "string", "SingleStoreText");
    this.config.textType = textType;
    this.config.enumValues = config.enum;
  }
  /** @internal */
  build(table) {
    return new SingleStoreText(
      table,
      this.config
    );
  }
}
class SingleStoreText extends SingleStoreColumn {
  static [entityKind] = "SingleStoreText";
  textType = this.config.textType;
  enumValues = this.config.enumValues;
  getSQLType() {
    return this.textType;
  }
}
function text(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new SingleStoreTextBuilder(name, "text", config);
}
function tinytext(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new SingleStoreTextBuilder(name, "tinytext", config);
}
function mediumtext(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new SingleStoreTextBuilder(name, "mediumtext", config);
}
function longtext(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new SingleStoreTextBuilder(name, "longtext", config);
}
export {
  SingleStoreText,
  SingleStoreTextBuilder,
  longtext,
  mediumtext,
  text,
  tinytext
};
//# sourceMappingURL=text.js.map