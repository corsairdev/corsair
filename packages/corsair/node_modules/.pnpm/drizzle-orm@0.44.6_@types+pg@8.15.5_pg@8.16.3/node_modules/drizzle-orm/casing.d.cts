import type { Column } from "./column.cjs";
import { entityKind } from "./entity.cjs";
import type { Casing } from "./utils.cjs";
export declare function toSnakeCase(input: string): string;
export declare function toCamelCase(input: string): string;
export declare class CasingCache {
    static readonly [entityKind]: string;
    private cachedTables;
    private convert;
    constructor(casing?: Casing);
    getColumnCasing(column: Column): string;
    private cacheTable;
    clearCache(): void;
}
