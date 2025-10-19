import type { Column } from "./column.js";
import { entityKind } from "./entity.js";
import type { Casing } from "./utils.js";
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
