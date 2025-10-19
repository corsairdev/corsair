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
var dialect_exports = {};
__export(dialect_exports, {
  SQLiteAsyncDialect: () => SQLiteAsyncDialect,
  SQLiteDialect: () => SQLiteDialect,
  SQLiteSyncDialect: () => SQLiteSyncDialect
});
module.exports = __toCommonJS(dialect_exports);
var import_alias = require("../alias.cjs");
var import_casing = require("../casing.cjs");
var import_column = require("../column.cjs");
var import_entity = require("../entity.cjs");
var import_errors = require("../errors.cjs");
var import_relations = require("../relations.cjs");
var import_sql = require("../sql/index.cjs");
var import_sql2 = require("../sql/sql.cjs");
var import_columns = require("./columns/index.cjs");
var import_table = require("./table.cjs");
var import_subquery = require("../subquery.cjs");
var import_table2 = require("../table.cjs");
var import_utils = require("../utils.cjs");
var import_view_common = require("../view-common.cjs");
var import_view_base = require("./view-base.cjs");
class SQLiteDialect {
  static [import_entity.entityKind] = "SQLiteDialect";
  /** @internal */
  casing;
  constructor(config) {
    this.casing = new import_casing.CasingCache(config?.casing);
  }
  escapeName(name) {
    return `"${name}"`;
  }
  escapeParam(_num) {
    return "?";
  }
  escapeString(str) {
    return `'${str.replace(/'/g, "''")}'`;
  }
  buildWithCTE(queries) {
    if (!queries?.length) return void 0;
    const withSqlChunks = [import_sql2.sql`with `];
    for (const [i, w] of queries.entries()) {
      withSqlChunks.push(import_sql2.sql`${import_sql2.sql.identifier(w._.alias)} as (${w._.sql})`);
      if (i < queries.length - 1) {
        withSqlChunks.push(import_sql2.sql`, `);
      }
    }
    withSqlChunks.push(import_sql2.sql` `);
    return import_sql2.sql.join(withSqlChunks);
  }
  buildDeleteQuery({ table, where, returning, withList, limit, orderBy }) {
    const withSql = this.buildWithCTE(withList);
    const returningSql = returning ? import_sql2.sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const whereSql = where ? import_sql2.sql` where ${where}` : void 0;
    const orderBySql = this.buildOrderBy(orderBy);
    const limitSql = this.buildLimit(limit);
    return import_sql2.sql`${withSql}delete from ${table}${whereSql}${returningSql}${orderBySql}${limitSql}`;
  }
  buildUpdateSet(table, set) {
    const tableColumns = table[import_table2.Table.Symbol.Columns];
    const columnNames = Object.keys(tableColumns).filter(
      (colName) => set[colName] !== void 0 || tableColumns[colName]?.onUpdateFn !== void 0
    );
    const setSize = columnNames.length;
    return import_sql2.sql.join(columnNames.flatMap((colName, i) => {
      const col = tableColumns[colName];
      const value = set[colName] ?? import_sql2.sql.param(col.onUpdateFn(), col);
      const res = import_sql2.sql`${import_sql2.sql.identifier(this.casing.getColumnCasing(col))} = ${value}`;
      if (i < setSize - 1) {
        return [res, import_sql2.sql.raw(", ")];
      }
      return [res];
    }));
  }
  buildUpdateQuery({ table, set, where, returning, withList, joins, from, limit, orderBy }) {
    const withSql = this.buildWithCTE(withList);
    const setSql = this.buildUpdateSet(table, set);
    const fromSql = from && import_sql2.sql.join([import_sql2.sql.raw(" from "), this.buildFromTable(from)]);
    const joinsSql = this.buildJoins(joins);
    const returningSql = returning ? import_sql2.sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const whereSql = where ? import_sql2.sql` where ${where}` : void 0;
    const orderBySql = this.buildOrderBy(orderBy);
    const limitSql = this.buildLimit(limit);
    return import_sql2.sql`${withSql}update ${table} set ${setSql}${fromSql}${joinsSql}${whereSql}${returningSql}${orderBySql}${limitSql}`;
  }
  /**
   * Builds selection SQL with provided fields/expressions
   *
   * Examples:
   *
   * `select <selection> from`
   *
   * `insert ... returning <selection>`
   *
   * If `isSingleTable` is true, then columns won't be prefixed with table name
   */
  buildSelection(fields, { isSingleTable = false } = {}) {
    const columnsLen = fields.length;
    const chunks = fields.flatMap(({ field }, i) => {
      const chunk = [];
      if ((0, import_entity.is)(field, import_sql2.SQL.Aliased) && field.isSelectionField) {
        chunk.push(import_sql2.sql.identifier(field.fieldAlias));
      } else if ((0, import_entity.is)(field, import_sql2.SQL.Aliased) || (0, import_entity.is)(field, import_sql2.SQL)) {
        const query = (0, import_entity.is)(field, import_sql2.SQL.Aliased) ? field.sql : field;
        if (isSingleTable) {
          chunk.push(
            new import_sql2.SQL(
              query.queryChunks.map((c) => {
                if ((0, import_entity.is)(c, import_column.Column)) {
                  return import_sql2.sql.identifier(this.casing.getColumnCasing(c));
                }
                return c;
              })
            )
          );
        } else {
          chunk.push(query);
        }
        if ((0, import_entity.is)(field, import_sql2.SQL.Aliased)) {
          chunk.push(import_sql2.sql` as ${import_sql2.sql.identifier(field.fieldAlias)}`);
        }
      } else if ((0, import_entity.is)(field, import_column.Column)) {
        const tableName = field.table[import_table2.Table.Symbol.Name];
        if (field.columnType === "SQLiteNumericBigInt") {
          if (isSingleTable) {
            chunk.push(import_sql2.sql`cast(${import_sql2.sql.identifier(this.casing.getColumnCasing(field))} as text)`);
          } else {
            chunk.push(
              import_sql2.sql`cast(${import_sql2.sql.identifier(tableName)}.${import_sql2.sql.identifier(this.casing.getColumnCasing(field))} as text)`
            );
          }
        } else {
          if (isSingleTable) {
            chunk.push(import_sql2.sql.identifier(this.casing.getColumnCasing(field)));
          } else {
            chunk.push(import_sql2.sql`${import_sql2.sql.identifier(tableName)}.${import_sql2.sql.identifier(this.casing.getColumnCasing(field))}`);
          }
        }
      }
      if (i < columnsLen - 1) {
        chunk.push(import_sql2.sql`, `);
      }
      return chunk;
    });
    return import_sql2.sql.join(chunks);
  }
  buildJoins(joins) {
    if (!joins || joins.length === 0) {
      return void 0;
    }
    const joinsArray = [];
    if (joins) {
      for (const [index, joinMeta] of joins.entries()) {
        if (index === 0) {
          joinsArray.push(import_sql2.sql` `);
        }
        const table = joinMeta.table;
        const onSql = joinMeta.on ? import_sql2.sql` on ${joinMeta.on}` : void 0;
        if ((0, import_entity.is)(table, import_table.SQLiteTable)) {
          const tableName = table[import_table.SQLiteTable.Symbol.Name];
          const tableSchema = table[import_table.SQLiteTable.Symbol.Schema];
          const origTableName = table[import_table.SQLiteTable.Symbol.OriginalName];
          const alias = tableName === origTableName ? void 0 : joinMeta.alias;
          joinsArray.push(
            import_sql2.sql`${import_sql2.sql.raw(joinMeta.joinType)} join ${tableSchema ? import_sql2.sql`${import_sql2.sql.identifier(tableSchema)}.` : void 0}${import_sql2.sql.identifier(origTableName)}${alias && import_sql2.sql` ${import_sql2.sql.identifier(alias)}`}${onSql}`
          );
        } else {
          joinsArray.push(
            import_sql2.sql`${import_sql2.sql.raw(joinMeta.joinType)} join ${table}${onSql}`
          );
        }
        if (index < joins.length - 1) {
          joinsArray.push(import_sql2.sql` `);
        }
      }
    }
    return import_sql2.sql.join(joinsArray);
  }
  buildLimit(limit) {
    return typeof limit === "object" || typeof limit === "number" && limit >= 0 ? import_sql2.sql` limit ${limit}` : void 0;
  }
  buildOrderBy(orderBy) {
    const orderByList = [];
    if (orderBy) {
      for (const [index, orderByValue] of orderBy.entries()) {
        orderByList.push(orderByValue);
        if (index < orderBy.length - 1) {
          orderByList.push(import_sql2.sql`, `);
        }
      }
    }
    return orderByList.length > 0 ? import_sql2.sql` order by ${import_sql2.sql.join(orderByList)}` : void 0;
  }
  buildFromTable(table) {
    if ((0, import_entity.is)(table, import_table2.Table) && table[import_table2.Table.Symbol.IsAlias]) {
      return import_sql2.sql`${import_sql2.sql`${import_sql2.sql.identifier(table[import_table2.Table.Symbol.Schema] ?? "")}.`.if(table[import_table2.Table.Symbol.Schema])}${import_sql2.sql.identifier(table[import_table2.Table.Symbol.OriginalName])} ${import_sql2.sql.identifier(table[import_table2.Table.Symbol.Name])}`;
    }
    return table;
  }
  buildSelectQuery({
    withList,
    fields,
    fieldsFlat,
    where,
    having,
    table,
    joins,
    orderBy,
    groupBy,
    limit,
    offset,
    distinct,
    setOperators
  }) {
    const fieldsList = fieldsFlat ?? (0, import_utils.orderSelectedFields)(fields);
    for (const f of fieldsList) {
      if ((0, import_entity.is)(f.field, import_column.Column) && (0, import_table2.getTableName)(f.field.table) !== ((0, import_entity.is)(table, import_subquery.Subquery) ? table._.alias : (0, import_entity.is)(table, import_view_base.SQLiteViewBase) ? table[import_view_common.ViewBaseConfig].name : (0, import_entity.is)(table, import_sql2.SQL) ? void 0 : (0, import_table2.getTableName)(table)) && !((table2) => joins?.some(
        ({ alias }) => alias === (table2[import_table2.Table.Symbol.IsAlias] ? (0, import_table2.getTableName)(table2) : table2[import_table2.Table.Symbol.BaseName])
      ))(f.field.table)) {
        const tableName = (0, import_table2.getTableName)(f.field.table);
        throw new Error(
          `Your "${f.path.join("->")}" field references a column "${tableName}"."${f.field.name}", but the table "${tableName}" is not part of the query! Did you forget to join it?`
        );
      }
    }
    const isSingleTable = !joins || joins.length === 0;
    const withSql = this.buildWithCTE(withList);
    const distinctSql = distinct ? import_sql2.sql` distinct` : void 0;
    const selection = this.buildSelection(fieldsList, { isSingleTable });
    const tableSql = this.buildFromTable(table);
    const joinsSql = this.buildJoins(joins);
    const whereSql = where ? import_sql2.sql` where ${where}` : void 0;
    const havingSql = having ? import_sql2.sql` having ${having}` : void 0;
    const groupByList = [];
    if (groupBy) {
      for (const [index, groupByValue] of groupBy.entries()) {
        groupByList.push(groupByValue);
        if (index < groupBy.length - 1) {
          groupByList.push(import_sql2.sql`, `);
        }
      }
    }
    const groupBySql = groupByList.length > 0 ? import_sql2.sql` group by ${import_sql2.sql.join(groupByList)}` : void 0;
    const orderBySql = this.buildOrderBy(orderBy);
    const limitSql = this.buildLimit(limit);
    const offsetSql = offset ? import_sql2.sql` offset ${offset}` : void 0;
    const finalQuery = import_sql2.sql`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupBySql}${havingSql}${orderBySql}${limitSql}${offsetSql}`;
    if (setOperators.length > 0) {
      return this.buildSetOperations(finalQuery, setOperators);
    }
    return finalQuery;
  }
  buildSetOperations(leftSelect, setOperators) {
    const [setOperator, ...rest] = setOperators;
    if (!setOperator) {
      throw new Error("Cannot pass undefined values to any set operator");
    }
    if (rest.length === 0) {
      return this.buildSetOperationQuery({ leftSelect, setOperator });
    }
    return this.buildSetOperations(
      this.buildSetOperationQuery({ leftSelect, setOperator }),
      rest
    );
  }
  buildSetOperationQuery({
    leftSelect,
    setOperator: { type, isAll, rightSelect, limit, orderBy, offset }
  }) {
    const leftChunk = import_sql2.sql`${leftSelect.getSQL()} `;
    const rightChunk = import_sql2.sql`${rightSelect.getSQL()}`;
    let orderBySql;
    if (orderBy && orderBy.length > 0) {
      const orderByValues = [];
      for (const singleOrderBy of orderBy) {
        if ((0, import_entity.is)(singleOrderBy, import_columns.SQLiteColumn)) {
          orderByValues.push(import_sql2.sql.identifier(singleOrderBy.name));
        } else if ((0, import_entity.is)(singleOrderBy, import_sql2.SQL)) {
          for (let i = 0; i < singleOrderBy.queryChunks.length; i++) {
            const chunk = singleOrderBy.queryChunks[i];
            if ((0, import_entity.is)(chunk, import_columns.SQLiteColumn)) {
              singleOrderBy.queryChunks[i] = import_sql2.sql.identifier(this.casing.getColumnCasing(chunk));
            }
          }
          orderByValues.push(import_sql2.sql`${singleOrderBy}`);
        } else {
          orderByValues.push(import_sql2.sql`${singleOrderBy}`);
        }
      }
      orderBySql = import_sql2.sql` order by ${import_sql2.sql.join(orderByValues, import_sql2.sql`, `)}`;
    }
    const limitSql = typeof limit === "object" || typeof limit === "number" && limit >= 0 ? import_sql2.sql` limit ${limit}` : void 0;
    const operatorChunk = import_sql2.sql.raw(`${type} ${isAll ? "all " : ""}`);
    const offsetSql = offset ? import_sql2.sql` offset ${offset}` : void 0;
    return import_sql2.sql`${leftChunk}${operatorChunk}${rightChunk}${orderBySql}${limitSql}${offsetSql}`;
  }
  buildInsertQuery({ table, values: valuesOrSelect, onConflict, returning, withList, select }) {
    const valuesSqlList = [];
    const columns = table[import_table2.Table.Symbol.Columns];
    const colEntries = Object.entries(columns).filter(
      ([_, col]) => !col.shouldDisableInsert()
    );
    const insertOrder = colEntries.map(([, column]) => import_sql2.sql.identifier(this.casing.getColumnCasing(column)));
    if (select) {
      const select2 = valuesOrSelect;
      if ((0, import_entity.is)(select2, import_sql2.SQL)) {
        valuesSqlList.push(select2);
      } else {
        valuesSqlList.push(select2.getSQL());
      }
    } else {
      const values = valuesOrSelect;
      valuesSqlList.push(import_sql2.sql.raw("values "));
      for (const [valueIndex, value] of values.entries()) {
        const valueList = [];
        for (const [fieldName, col] of colEntries) {
          const colValue = value[fieldName];
          if (colValue === void 0 || (0, import_entity.is)(colValue, import_sql2.Param) && colValue.value === void 0) {
            let defaultValue;
            if (col.default !== null && col.default !== void 0) {
              defaultValue = (0, import_entity.is)(col.default, import_sql2.SQL) ? col.default : import_sql2.sql.param(col.default, col);
            } else if (col.defaultFn !== void 0) {
              const defaultFnResult = col.defaultFn();
              defaultValue = (0, import_entity.is)(defaultFnResult, import_sql2.SQL) ? defaultFnResult : import_sql2.sql.param(defaultFnResult, col);
            } else if (!col.default && col.onUpdateFn !== void 0) {
              const onUpdateFnResult = col.onUpdateFn();
              defaultValue = (0, import_entity.is)(onUpdateFnResult, import_sql2.SQL) ? onUpdateFnResult : import_sql2.sql.param(onUpdateFnResult, col);
            } else {
              defaultValue = import_sql2.sql`null`;
            }
            valueList.push(defaultValue);
          } else {
            valueList.push(colValue);
          }
        }
        valuesSqlList.push(valueList);
        if (valueIndex < values.length - 1) {
          valuesSqlList.push(import_sql2.sql`, `);
        }
      }
    }
    const withSql = this.buildWithCTE(withList);
    const valuesSql = import_sql2.sql.join(valuesSqlList);
    const returningSql = returning ? import_sql2.sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const onConflictSql = onConflict?.length ? import_sql2.sql.join(onConflict) : void 0;
    return import_sql2.sql`${withSql}insert into ${table} ${insertOrder} ${valuesSql}${onConflictSql}${returningSql}`;
  }
  sqlToQuery(sql2, invokeSource) {
    return sql2.toQuery({
      casing: this.casing,
      escapeName: this.escapeName,
      escapeParam: this.escapeParam,
      escapeString: this.escapeString,
      invokeSource
    });
  }
  buildRelationalQuery({
    fullSchema,
    schema,
    tableNamesMap,
    table,
    tableConfig,
    queryConfig: config,
    tableAlias,
    nestedQueryRelation,
    joinOn
  }) {
    let selection = [];
    let limit, offset, orderBy = [], where;
    const joins = [];
    if (config === true) {
      const selectionEntries = Object.entries(tableConfig.columns);
      selection = selectionEntries.map(([key, value]) => ({
        dbKey: value.name,
        tsKey: key,
        field: (0, import_alias.aliasedTableColumn)(value, tableAlias),
        relationTableTsKey: void 0,
        isJson: false,
        selection: []
      }));
    } else {
      const aliasedColumns = Object.fromEntries(
        Object.entries(tableConfig.columns).map(([key, value]) => [key, (0, import_alias.aliasedTableColumn)(value, tableAlias)])
      );
      if (config.where) {
        const whereSql = typeof config.where === "function" ? config.where(aliasedColumns, (0, import_relations.getOperators)()) : config.where;
        where = whereSql && (0, import_alias.mapColumnsInSQLToAlias)(whereSql, tableAlias);
      }
      const fieldsSelection = [];
      let selectedColumns = [];
      if (config.columns) {
        let isIncludeMode = false;
        for (const [field, value] of Object.entries(config.columns)) {
          if (value === void 0) {
            continue;
          }
          if (field in tableConfig.columns) {
            if (!isIncludeMode && value === true) {
              isIncludeMode = true;
            }
            selectedColumns.push(field);
          }
        }
        if (selectedColumns.length > 0) {
          selectedColumns = isIncludeMode ? selectedColumns.filter((c) => config.columns?.[c] === true) : Object.keys(tableConfig.columns).filter((key) => !selectedColumns.includes(key));
        }
      } else {
        selectedColumns = Object.keys(tableConfig.columns);
      }
      for (const field of selectedColumns) {
        const column = tableConfig.columns[field];
        fieldsSelection.push({ tsKey: field, value: column });
      }
      let selectedRelations = [];
      if (config.with) {
        selectedRelations = Object.entries(config.with).filter((entry) => !!entry[1]).map(([tsKey, queryConfig]) => ({ tsKey, queryConfig, relation: tableConfig.relations[tsKey] }));
      }
      let extras;
      if (config.extras) {
        extras = typeof config.extras === "function" ? config.extras(aliasedColumns, { sql: import_sql2.sql }) : config.extras;
        for (const [tsKey, value] of Object.entries(extras)) {
          fieldsSelection.push({
            tsKey,
            value: (0, import_alias.mapColumnsInAliasedSQLToAlias)(value, tableAlias)
          });
        }
      }
      for (const { tsKey, value } of fieldsSelection) {
        selection.push({
          dbKey: (0, import_entity.is)(value, import_sql2.SQL.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey].name,
          tsKey,
          field: (0, import_entity.is)(value, import_column.Column) ? (0, import_alias.aliasedTableColumn)(value, tableAlias) : value,
          relationTableTsKey: void 0,
          isJson: false,
          selection: []
        });
      }
      let orderByOrig = typeof config.orderBy === "function" ? config.orderBy(aliasedColumns, (0, import_relations.getOrderByOperators)()) : config.orderBy ?? [];
      if (!Array.isArray(orderByOrig)) {
        orderByOrig = [orderByOrig];
      }
      orderBy = orderByOrig.map((orderByValue) => {
        if ((0, import_entity.is)(orderByValue, import_column.Column)) {
          return (0, import_alias.aliasedTableColumn)(orderByValue, tableAlias);
        }
        return (0, import_alias.mapColumnsInSQLToAlias)(orderByValue, tableAlias);
      });
      limit = config.limit;
      offset = config.offset;
      for (const {
        tsKey: selectedRelationTsKey,
        queryConfig: selectedRelationConfigValue,
        relation
      } of selectedRelations) {
        const normalizedRelation = (0, import_relations.normalizeRelation)(schema, tableNamesMap, relation);
        const relationTableName = (0, import_table2.getTableUniqueName)(relation.referencedTable);
        const relationTableTsName = tableNamesMap[relationTableName];
        const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
        const joinOn2 = (0, import_sql.and)(
          ...normalizedRelation.fields.map(
            (field2, i) => (0, import_sql.eq)(
              (0, import_alias.aliasedTableColumn)(normalizedRelation.references[i], relationTableAlias),
              (0, import_alias.aliasedTableColumn)(field2, tableAlias)
            )
          )
        );
        const builtRelation = this.buildRelationalQuery({
          fullSchema,
          schema,
          tableNamesMap,
          table: fullSchema[relationTableTsName],
          tableConfig: schema[relationTableTsName],
          queryConfig: (0, import_entity.is)(relation, import_relations.One) ? selectedRelationConfigValue === true ? { limit: 1 } : { ...selectedRelationConfigValue, limit: 1 } : selectedRelationConfigValue,
          tableAlias: relationTableAlias,
          joinOn: joinOn2,
          nestedQueryRelation: relation
        });
        const field = import_sql2.sql`(${builtRelation.sql})`.as(selectedRelationTsKey);
        selection.push({
          dbKey: selectedRelationTsKey,
          tsKey: selectedRelationTsKey,
          field,
          relationTableTsKey: relationTableTsName,
          isJson: true,
          selection: builtRelation.selection
        });
      }
    }
    if (selection.length === 0) {
      throw new import_errors.DrizzleError({
        message: `No fields selected for table "${tableConfig.tsName}" ("${tableAlias}"). You need to have at least one item in "columns", "with" or "extras". If you need to select all columns, omit the "columns" key or set it to undefined.`
      });
    }
    let result;
    where = (0, import_sql.and)(joinOn, where);
    if (nestedQueryRelation) {
      let field = import_sql2.sql`json_array(${import_sql2.sql.join(
        selection.map(
          ({ field: field2 }) => (0, import_entity.is)(field2, import_columns.SQLiteColumn) ? import_sql2.sql.identifier(this.casing.getColumnCasing(field2)) : (0, import_entity.is)(field2, import_sql2.SQL.Aliased) ? field2.sql : field2
        ),
        import_sql2.sql`, `
      )})`;
      if ((0, import_entity.is)(nestedQueryRelation, import_relations.Many)) {
        field = import_sql2.sql`coalesce(json_group_array(${field}), json_array())`;
      }
      const nestedSelection = [{
        dbKey: "data",
        tsKey: "data",
        field: field.as("data"),
        isJson: true,
        relationTableTsKey: tableConfig.tsName,
        selection
      }];
      const needsSubquery = limit !== void 0 || offset !== void 0 || orderBy.length > 0;
      if (needsSubquery) {
        result = this.buildSelectQuery({
          table: (0, import_alias.aliasedTable)(table, tableAlias),
          fields: {},
          fieldsFlat: [
            {
              path: [],
              field: import_sql2.sql.raw("*")
            }
          ],
          where,
          limit,
          offset,
          orderBy,
          setOperators: []
        });
        where = void 0;
        limit = void 0;
        offset = void 0;
        orderBy = void 0;
      } else {
        result = (0, import_alias.aliasedTable)(table, tableAlias);
      }
      result = this.buildSelectQuery({
        table: (0, import_entity.is)(result, import_table.SQLiteTable) ? result : new import_subquery.Subquery(result, {}, tableAlias),
        fields: {},
        fieldsFlat: nestedSelection.map(({ field: field2 }) => ({
          path: [],
          field: (0, import_entity.is)(field2, import_column.Column) ? (0, import_alias.aliasedTableColumn)(field2, tableAlias) : field2
        })),
        joins,
        where,
        limit,
        offset,
        orderBy,
        setOperators: []
      });
    } else {
      result = this.buildSelectQuery({
        table: (0, import_alias.aliasedTable)(table, tableAlias),
        fields: {},
        fieldsFlat: selection.map(({ field }) => ({
          path: [],
          field: (0, import_entity.is)(field, import_column.Column) ? (0, import_alias.aliasedTableColumn)(field, tableAlias) : field
        })),
        joins,
        where,
        limit,
        offset,
        orderBy,
        setOperators: []
      });
    }
    return {
      tableTsKey: tableConfig.tsName,
      sql: result,
      selection
    };
  }
}
class SQLiteSyncDialect extends SQLiteDialect {
  static [import_entity.entityKind] = "SQLiteSyncDialect";
  migrate(migrations, session, config) {
    const migrationsTable = config === void 0 ? "__drizzle_migrations" : typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
    const migrationTableCreate = import_sql2.sql`
			CREATE TABLE IF NOT EXISTS ${import_sql2.sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
    session.run(migrationTableCreate);
    const dbMigrations = session.values(
      import_sql2.sql`SELECT id, hash, created_at FROM ${import_sql2.sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`
    );
    const lastDbMigration = dbMigrations[0] ?? void 0;
    session.run(import_sql2.sql`BEGIN`);
    try {
      for (const migration of migrations) {
        if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
          for (const stmt of migration.sql) {
            session.run(import_sql2.sql.raw(stmt));
          }
          session.run(
            import_sql2.sql`INSERT INTO ${import_sql2.sql.identifier(migrationsTable)} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`
          );
        }
      }
      session.run(import_sql2.sql`COMMIT`);
    } catch (e) {
      session.run(import_sql2.sql`ROLLBACK`);
      throw e;
    }
  }
}
class SQLiteAsyncDialect extends SQLiteDialect {
  static [import_entity.entityKind] = "SQLiteAsyncDialect";
  async migrate(migrations, session, config) {
    const migrationsTable = config === void 0 ? "__drizzle_migrations" : typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
    const migrationTableCreate = import_sql2.sql`
			CREATE TABLE IF NOT EXISTS ${import_sql2.sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
    await session.run(migrationTableCreate);
    const dbMigrations = await session.values(
      import_sql2.sql`SELECT id, hash, created_at FROM ${import_sql2.sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`
    );
    const lastDbMigration = dbMigrations[0] ?? void 0;
    await session.transaction(async (tx) => {
      for (const migration of migrations) {
        if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
          for (const stmt of migration.sql) {
            await tx.run(import_sql2.sql.raw(stmt));
          }
          await tx.run(
            import_sql2.sql`INSERT INTO ${import_sql2.sql.identifier(migrationsTable)} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`
          );
        }
      }
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SQLiteAsyncDialect,
  SQLiteDialect,
  SQLiteSyncDialect
});
//# sourceMappingURL=dialect.cjs.map