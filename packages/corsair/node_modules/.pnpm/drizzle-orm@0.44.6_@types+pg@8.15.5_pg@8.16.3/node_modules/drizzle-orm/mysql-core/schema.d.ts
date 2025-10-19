import { entityKind } from "../entity.js";
import { type MySqlTableFn } from "./table.js";
import { type mysqlView } from "./view.js";
export declare class MySqlSchema<TName extends string = string> {
    readonly schemaName: TName;
    static readonly [entityKind]: string;
    constructor(schemaName: TName);
    table: MySqlTableFn<TName>;
    view: typeof mysqlView;
}
/** @deprecated - use `instanceof MySqlSchema` */
export declare function isMySqlSchema(obj: unknown): obj is MySqlSchema;
/**
 * Create a MySQL schema.
 * https://dev.mysql.com/doc/refman/8.0/en/create-database.html
 *
 * @param name mysql use schema name
 * @returns MySQL schema
 */
export declare function mysqlDatabase<TName extends string>(name: TName): MySqlSchema<TName>;
/**
 * @see mysqlDatabase
 */
export declare const mysqlSchema: typeof mysqlDatabase;
