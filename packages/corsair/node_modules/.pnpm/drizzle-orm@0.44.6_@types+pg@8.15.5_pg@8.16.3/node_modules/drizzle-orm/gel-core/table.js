import { entityKind } from "../entity.js";
import { Table } from "../table.js";
import { getGelColumnBuilders } from "./columns/all.js";
const InlineForeignKeys = Symbol.for("drizzle:GelInlineForeignKeys");
const EnableRLS = Symbol.for("drizzle:EnableRLS");
class GelTable extends Table {
  static [entityKind] = "GelTable";
  /** @internal */
  static Symbol = Object.assign({}, Table.Symbol, {
    InlineForeignKeys,
    EnableRLS
  });
  /**@internal */
  [InlineForeignKeys] = [];
  /** @internal */
  [EnableRLS] = false;
  /** @internal */
  [Table.Symbol.ExtraConfigBuilder] = void 0;
  /** @internal */
  [Table.Symbol.ExtraConfigColumns] = {};
}
function gelTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
  const rawTable = new GelTable(name, schema, baseName);
  const parsedColumns = typeof columns === "function" ? columns(getGelColumnBuilders()) : columns;
  const builtColumns = Object.fromEntries(
    Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      colBuilder.setName(name2);
      const column = colBuilder.build(rawTable);
      rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
      return [name2, column];
    })
  );
  const builtColumnsForExtraConfig = Object.fromEntries(
    Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      colBuilder.setName(name2);
      const column = colBuilder.buildExtraConfigColumn(rawTable);
      return [name2, column];
    })
  );
  const table = Object.assign(rawTable, builtColumns);
  table[Table.Symbol.Columns] = builtColumns;
  table[Table.Symbol.ExtraConfigColumns] = builtColumnsForExtraConfig;
  if (extraConfig) {
    table[GelTable.Symbol.ExtraConfigBuilder] = extraConfig;
  }
  return Object.assign(table, {
    enableRLS: () => {
      table[GelTable.Symbol.EnableRLS] = true;
      return table;
    }
  });
}
const gelTable = (name, columns, extraConfig) => {
  return gelTableWithSchema(name, columns, extraConfig, void 0);
};
function gelTableCreator(customizeTableName) {
  return (name, columns, extraConfig) => {
    return gelTableWithSchema(customizeTableName(name), columns, extraConfig, void 0, name);
  };
}
export {
  EnableRLS,
  GelTable,
  InlineForeignKeys,
  gelTable,
  gelTableCreator,
  gelTableWithSchema
};
//# sourceMappingURL=table.js.map