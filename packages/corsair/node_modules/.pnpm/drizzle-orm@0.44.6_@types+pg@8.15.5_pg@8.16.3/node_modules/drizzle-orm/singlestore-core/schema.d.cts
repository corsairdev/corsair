import { entityKind } from "../entity.cjs";
import { type SingleStoreTableFn } from "./table.cjs";
export declare class SingleStoreSchema<TName extends string = string> {
    readonly schemaName: TName;
    static readonly [entityKind]: string;
    constructor(schemaName: TName);
    table: SingleStoreTableFn<TName>;
}
/** @deprecated - use `instanceof SingleStoreSchema` */
export declare function isSingleStoreSchema(obj: unknown): obj is SingleStoreSchema;
/**
 * Create a SingleStore schema.
 * https://docs.singlestore.com/cloud/create-a-database/
 *
 * @param name singlestore use schema name
 * @returns SingleStore schema
 */
export declare function singlestoreDatabase<TName extends string>(name: TName): SingleStoreSchema<TName>;
/**
 * @see singlestoreDatabase
 */
export declare const singlestoreSchema: typeof singlestoreDatabase;
