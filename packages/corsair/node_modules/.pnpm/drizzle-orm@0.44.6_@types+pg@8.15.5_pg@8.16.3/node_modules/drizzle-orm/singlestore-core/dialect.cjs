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
  SingleStoreDialect: () => SingleStoreDialect
});
module.exports = __toCommonJS(dialect_exports);
var import_alias = require("../alias.cjs");
var import_casing = require("../casing.cjs");
var import_column = require("../column.cjs");
var import_entity = require("../entity.cjs");
var import_errors = require("../errors.cjs");
var import_relations = require("../relations.cjs");
var import_expressions = require("../sql/expressions/index.cjs");
var import_sql = require("../sql/sql.cjs");
var import_subquery = require("../subquery.cjs");
var import_table = require("../table.cjs");
var import_utils = require("../utils.cjs");
var import_view_common = require("../view-common.cjs");
var import_common = require("./columns/common.cjs");
var import_table2 = require("./table.cjs");
class SingleStoreDialect {
  static [import_entity.entityKind] = "SingleStoreDialect";
  /** @internal */
  casing;
  constructor(config) {
    this.casing = new import_casing.CasingCache(config?.casing);
  }
  async migrate(migrations, session, config) {
    const migrationsTable = config.migrationsTable ?? "__drizzle_migrations";
    const migrationTableCreate = import_sql.sql`
			create table if not exists ${import_sql.sql.identifier(migrationsTable)} (
				id serial primary key,
				hash text not null,
				created_at bigint
			)
		`;
    await session.execute(migrationTableCreate);
    const dbMigrations = await session.all(
      import_sql.sql`select id, hash, created_at from ${import_sql.sql.identifier(migrationsTable)} order by created_at desc limit 1`
    );
    const lastDbMigration = dbMigrations[0];
    await session.transaction(async (tx) => {
      for (const migration of migrations) {
        if (!lastDbMigration || Number(lastDbMigration.created_at) < migration.folderMillis) {
          for (const stmt of migration.sql) {
            await tx.execute(import_sql.sql.raw(stmt));
          }
          await tx.execute(
            import_sql.sql`insert into ${import_sql.sql.identifier(migrationsTable)} (\`hash\`, \`created_at\`) values(${migration.hash}, ${migration.folderMillis})`
          );
        }
      }
    });
  }
  escapeName(name) {
    return `\`${name}\``;
  }
  escapeParam(_num) {
    return `?`;
  }
  escapeString(str) {
    return `'${str.replace(/'/g, "''")}'`;
  }
  buildWithCTE(queries) {
    if (!queries?.length) return void 0;
    const withSqlChunks = [import_sql.sql`with `];
    for (const [i, w] of queries.entries()) {
      withSqlChunks.push(import_sql.sql`${import_sql.sql.identifier(w._.alias)} as (${w._.sql})`);
      if (i < queries.length - 1) {
        withSqlChunks.push(import_sql.sql`, `);
      }
    }
    withSqlChunks.push(import_sql.sql` `);
    return import_sql.sql.join(withSqlChunks);
  }
  buildDeleteQuery({ table, where, returning, withList, limit, orderBy }) {
    const withSql = this.buildWithCTE(withList);
    const returningSql = returning ? import_sql.sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const whereSql = where ? import_sql.sql` where ${where}` : void 0;
    const orderBySql = this.buildOrderBy(orderBy);
    const limitSql = this.buildLimit(limit);
    return import_sql.sql`${withSql}delete from ${table}${whereSql}${orderBySql}${limitSql}${returningSql}`;
  }
  buildUpdateSet(table, set) {
    const tableColumns = table[import_table.Table.Symbol.Columns];
    const columnNames = Object.keys(tableColumns).filter(
      (colName) => set[colName] !== void 0 || tableColumns[colName]?.onUpdateFn !== void 0
    );
    const setSize = columnNames.length;
    return import_sql.sql.join(columnNames.flatMap((colName, i) => {
      const col = tableColumns[colName];
      const value = set[colName] ?? import_sql.sql.param(col.onUpdateFn(), col);
      const res = import_sql.sql`${import_sql.sql.identifier(this.casing.getColumnCasing(col))} = ${value}`;
      if (i < setSize - 1) {
        return [res, import_sql.sql.raw(", ")];
      }
      return [res];
    }));
  }
  buildUpdateQuery({ table, set, where, returning, withList, limit, orderBy }) {
    const withSql = this.buildWithCTE(withList);
    const setSql = this.buildUpdateSet(table, set);
    const returningSql = returning ? import_sql.sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const whereSql = where ? import_sql.sql` where ${where}` : void 0;
    const orderBySql = this.buildOrderBy(orderBy);
    const limitSql = this.buildLimit(limit);
    return import_sql.sql`${withSql}update ${table} set ${setSql}${whereSql}${orderBySql}${limitSql}${returningSql}`;
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
      if ((0, import_entity.is)(field, import_sql.SQL.Aliased) && field.isSelectionField) {
        chunk.push(import_sql.sql.identifier(field.fieldAlias));
      } else if ((0, import_entity.is)(field, import_sql.SQL.Aliased) || (0, import_entity.is)(field, import_sql.SQL)) {
        const query = (0, import_entity.is)(field, import_sql.SQL.Aliased) ? field.sql : field;
        if (isSingleTable) {
          chunk.push(
            new import_sql.SQL(
              query.queryChunks.map((c) => {
                if ((0, import_entity.is)(c, import_common.SingleStoreColumn)) {
                  return import_sql.sql.identifier(this.casing.getColumnCasing(c));
                }
                return c;
              })
            )
          );
        } else {
          chunk.push(query);
        }
        if ((0, import_entity.is)(field, import_sql.SQL.Aliased)) {
          chunk.push(import_sql.sql` as ${import_sql.sql.identifier(field.fieldAlias)}`);
        }
      } else if ((0, import_entity.is)(field, import_column.Column)) {
        if (isSingleTable) {
          chunk.push(import_sql.sql.identifier(this.casing.getColumnCasing(field)));
        } else {
          chunk.push(field);
        }
      }
      if (i < columnsLen - 1) {
        chunk.push(import_sql.sql`, `);
      }
      return chunk;
    });
    return import_sql.sql.join(chunks);
  }
  buildLimit(limit) {
    return typeof limit === "object" || typeof limit === "number" && limit >= 0 ? import_sql.sql` limit ${limit}` : void 0;
  }
  buildOrderBy(orderBy) {
    return orderBy && orderBy.length > 0 ? import_sql.sql` order by ${import_sql.sql.join(orderBy, import_sql.sql`, `)}` : void 0;
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
    lockingClause,
    distinct,
    setOperators
  }) {
    const fieldsList = fieldsFlat ?? (0, import_utils.orderSelectedFields)(fields);
    for (const f of fieldsList) {
      if ((0, import_entity.is)(f.field, import_column.Column) && (0, import_table.getTableName)(f.field.table) !== ((0, import_entity.is)(table, import_subquery.Subquery) ? table._.alias : (0, import_entity.is)(table, import_sql.SQL) ? void 0 : (0, import_table.getTableName)(table)) && !((table2) => joins?.some(
        ({ alias }) => alias === (table2[import_table.Table.Symbol.IsAlias] ? (0, import_table.getTableName)(table2) : table2[import_table.Table.Symbol.BaseName])
      ))(f.field.table)) {
        const tableName = (0, import_table.getTableName)(f.field.table);
        throw new Error(
          `Your "${f.path.join("->")}" field references a column "${tableName}"."${f.field.name}", but the table "${tableName}" is not part of the query! Did you forget to join it?`
        );
      }
    }
    const isSingleTable = !joins || joins.length === 0;
    const withSql = this.buildWithCTE(withList);
    const distinctSql = distinct ? import_sql.sql` distinct` : void 0;
    const selection = this.buildSelection(fieldsList, { isSingleTable });
    const tableSql = (() => {
      if ((0, import_entity.is)(table, import_table.Table) && table[import_table.Table.Symbol.IsAlias]) {
        return import_sql.sql`${import_sql.sql`${import_sql.sql.identifier(table[import_table.Table.Symbol.Schema] ?? "")}.`.if(table[import_table.Table.Symbol.Schema])}${import_sql.sql.identifier(table[import_table.Table.Symbol.OriginalName])} ${import_sql.sql.identifier(table[import_table.Table.Symbol.Name])}`;
      }
      return table;
    })();
    const joinsArray = [];
    if (joins) {
      for (const [index, joinMeta] of joins.entries()) {
        if (index === 0) {
          joinsArray.push(import_sql.sql` `);
        }
        const table2 = joinMeta.table;
        const lateralSql = joinMeta.lateral ? import_sql.sql` lateral` : void 0;
        const onSql = joinMeta.on ? import_sql.sql` on ${joinMeta.on}` : void 0;
        if ((0, import_entity.is)(table2, import_table2.SingleStoreTable)) {
          const tableName = table2[import_table2.SingleStoreTable.Symbol.Name];
          const tableSchema = table2[import_table2.SingleStoreTable.Symbol.Schema];
          const origTableName = table2[import_table2.SingleStoreTable.Symbol.OriginalName];
          const alias = tableName === origTableName ? void 0 : joinMeta.alias;
          joinsArray.push(
            import_sql.sql`${import_sql.sql.raw(joinMeta.joinType)} join${lateralSql} ${tableSchema ? import_sql.sql`${import_sql.sql.identifier(tableSchema)}.` : void 0}${import_sql.sql.identifier(origTableName)}${alias && import_sql.sql` ${import_sql.sql.identifier(alias)}`}${onSql}`
          );
        } else if ((0, import_entity.is)(table2, import_sql.View)) {
          const viewName = table2[import_view_common.ViewBaseConfig].name;
          const viewSchema = table2[import_view_common.ViewBaseConfig].schema;
          const origViewName = table2[import_view_common.ViewBaseConfig].originalName;
          const alias = viewName === origViewName ? void 0 : joinMeta.alias;
          joinsArray.push(
            import_sql.sql`${import_sql.sql.raw(joinMeta.joinType)} join${lateralSql} ${viewSchema ? import_sql.sql`${import_sql.sql.identifier(viewSchema)}.` : void 0}${import_sql.sql.identifier(origViewName)}${alias && import_sql.sql` ${import_sql.sql.identifier(alias)}`}${onSql}`
          );
        } else {
          joinsArray.push(
            import_sql.sql`${import_sql.sql.raw(joinMeta.joinType)} join${lateralSql} ${table2}${onSql}`
          );
        }
        if (index < joins.length - 1) {
          joinsArray.push(import_sql.sql` `);
        }
      }
    }
    const joinsSql = import_sql.sql.join(joinsArray);
    const whereSql = where ? import_sql.sql` where ${where}` : void 0;
    const havingSql = having ? import_sql.sql` having ${having}` : void 0;
    const orderBySql = this.buildOrderBy(orderBy);
    const groupBySql = groupBy && groupBy.length > 0 ? import_sql.sql` group by ${import_sql.sql.join(groupBy, import_sql.sql`, `)}` : void 0;
    const limitSql = this.buildLimit(limit);
    const offsetSql = offset ? import_sql.sql` offset ${offset}` : void 0;
    let lockingClausesSql;
    if (lockingClause) {
      const { config, strength } = lockingClause;
      lockingClausesSql = import_sql.sql` for ${import_sql.sql.raw(strength)}`;
      if (config.noWait) {
        lockingClausesSql.append(import_sql.sql` nowait`);
      } else if (config.skipLocked) {
        lockingClausesSql.append(import_sql.sql` skip locked`);
      }
    }
    const finalQuery = import_sql.sql`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupBySql}${havingSql}${orderBySql}${limitSql}${offsetSql}${lockingClausesSql}`;
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
    const leftChunk = import_sql.sql`(${leftSelect.getSQL()}) `;
    const rightChunk = import_sql.sql`(${rightSelect.getSQL()})`;
    let orderBySql;
    if (orderBy && orderBy.length > 0) {
      const orderByValues = [];
      for (const orderByUnit of orderBy) {
        if ((0, import_entity.is)(orderByUnit, import_common.SingleStoreColumn)) {
          orderByValues.push(import_sql.sql.identifier(this.casing.getColumnCasing(orderByUnit)));
        } else if ((0, import_entity.is)(orderByUnit, import_sql.SQL)) {
          for (let i = 0; i < orderByUnit.queryChunks.length; i++) {
            const chunk = orderByUnit.queryChunks[i];
            if ((0, import_entity.is)(chunk, import_common.SingleStoreColumn)) {
              orderByUnit.queryChunks[i] = import_sql.sql.identifier(this.casing.getColumnCasing(chunk));
            }
          }
          orderByValues.push(import_sql.sql`${orderByUnit}`);
        } else {
          orderByValues.push(import_sql.sql`${orderByUnit}`);
        }
      }
      orderBySql = import_sql.sql` order by ${import_sql.sql.join(orderByValues, import_sql.sql`, `)} `;
    }
    const limitSql = typeof limit === "object" || typeof limit === "number" && limit >= 0 ? import_sql.sql` limit ${limit}` : void 0;
    const operatorChunk = import_sql.sql.raw(`${type} ${isAll ? "all " : ""}`);
    const offsetSql = offset ? import_sql.sql` offset ${offset}` : void 0;
    return import_sql.sql`${leftChunk}${operatorChunk}${rightChunk}${orderBySql}${limitSql}${offsetSql}`;
  }
  buildInsertQuery({ table, values, ignore, onConflict }) {
    const valuesSqlList = [];
    const columns = table[import_table.Table.Symbol.Columns];
    const colEntries = Object.entries(columns).filter(
      ([_, col]) => !col.shouldDisableInsert()
    );
    const insertOrder = colEntries.map(([, column]) => import_sql.sql.identifier(this.casing.getColumnCasing(column)));
    const generatedIdsResponse = [];
    for (const [valueIndex, value] of values.entries()) {
      const generatedIds = {};
      const valueList = [];
      for (const [fieldName, col] of colEntries) {
        const colValue = value[fieldName];
        if (colValue === void 0 || (0, import_entity.is)(colValue, import_sql.Param) && colValue.value === void 0) {
          if (col.defaultFn !== void 0) {
            const defaultFnResult = col.defaultFn();
            generatedIds[fieldName] = defaultFnResult;
            const defaultValue = (0, import_entity.is)(defaultFnResult, import_sql.SQL) ? defaultFnResult : import_sql.sql.param(defaultFnResult, col);
            valueList.push(defaultValue);
          } else if (!col.default && col.onUpdateFn !== void 0) {
            const onUpdateFnResult = col.onUpdateFn();
            const newValue = (0, import_entity.is)(onUpdateFnResult, import_sql.SQL) ? onUpdateFnResult : import_sql.sql.param(onUpdateFnResult, col);
            valueList.push(newValue);
          } else {
            valueList.push(import_sql.sql`default`);
          }
        } else {
          if (col.defaultFn && (0, import_entity.is)(colValue, import_sql.Param)) {
            generatedIds[fieldName] = colValue.value;
          }
          valueList.push(colValue);
        }
      }
      generatedIdsResponse.push(generatedIds);
      valuesSqlList.push(valueList);
      if (valueIndex < values.length - 1) {
        valuesSqlList.push(import_sql.sql`, `);
      }
    }
    const valuesSql = import_sql.sql.join(valuesSqlList);
    const ignoreSql = ignore ? import_sql.sql` ignore` : void 0;
    const onConflictSql = onConflict ? import_sql.sql` on duplicate key ${onConflict}` : void 0;
    return {
      sql: import_sql.sql`insert${ignoreSql} into ${table} ${insertOrder} values ${valuesSql}${onConflictSql}`,
      generatedIds: generatedIdsResponse
    };
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
    let limit, offset, orderBy, where;
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
        extras = typeof config.extras === "function" ? config.extras(aliasedColumns, { sql: import_sql.sql }) : config.extras;
        for (const [tsKey, value] of Object.entries(extras)) {
          fieldsSelection.push({
            tsKey,
            value: (0, import_alias.mapColumnsInAliasedSQLToAlias)(value, tableAlias)
          });
        }
      }
      for (const { tsKey, value } of fieldsSelection) {
        selection.push({
          dbKey: (0, import_entity.is)(value, import_sql.SQL.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey].name,
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
        const relationTableName = (0, import_table.getTableUniqueName)(relation.referencedTable);
        const relationTableTsName = tableNamesMap[relationTableName];
        const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
        const joinOn2 = (0, import_expressions.and)(
          ...normalizedRelation.fields.map(
            (field2, i) => (0, import_expressions.eq)(
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
        const field = import_sql.sql`${import_sql.sql.identifier(relationTableAlias)}.${import_sql.sql.identifier("data")}`.as(selectedRelationTsKey);
        joins.push({
          on: import_sql.sql`true`,
          table: new import_subquery.Subquery(builtRelation.sql, {}, relationTableAlias),
          alias: relationTableAlias,
          joinType: "left",
          lateral: true
        });
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
      throw new import_errors.DrizzleError({ message: `No fields selected for table "${tableConfig.tsName}" ("${tableAlias}")` });
    }
    let result;
    where = (0, import_expressions.and)(joinOn, where);
    if (nestedQueryRelation) {
      let field = import_sql.sql`JSON_TO_ARRAY(${import_sql.sql.join(
        selection.map(
          ({ field: field2, tsKey, isJson }) => isJson ? import_sql.sql`${import_sql.sql.identifier(`${tableAlias}_${tsKey}`)}.${import_sql.sql.identifier("data")}` : (0, import_entity.is)(field2, import_sql.SQL.Aliased) ? field2.sql : field2
        ),
        import_sql.sql`, `
      )})`;
      if ((0, import_entity.is)(nestedQueryRelation, import_relations.Many)) {
        field = import_sql.sql`json_agg(${field})`;
      }
      const nestedSelection = [{
        dbKey: "data",
        tsKey: "data",
        field: field.as("data"),
        isJson: true,
        relationTableTsKey: tableConfig.tsName,
        selection
      }];
      const needsSubquery = limit !== void 0 || offset !== void 0 || (orderBy?.length ?? 0) > 0;
      if (needsSubquery) {
        result = this.buildSelectQuery({
          table: (0, import_alias.aliasedTable)(table, tableAlias),
          fields: {},
          fieldsFlat: [
            {
              path: [],
              field: import_sql.sql.raw("*")
            },
            ...((orderBy?.length ?? 0) > 0 ? [{
              path: [],
              field: import_sql.sql`row_number() over (order by ${import_sql.sql.join(orderBy, import_sql.sql`, `)})`
            }] : [])
          ],
          where,
          limit,
          offset,
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
        table: (0, import_entity.is)(result, import_table2.SingleStoreTable) ? result : new import_subquery.Subquery(result, {}, tableAlias),
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SingleStoreDialect
});
//# sourceMappingURL=dialect.cjs.map