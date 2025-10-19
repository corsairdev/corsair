import { entityKind } from "../../entity.js";
import type { Table } from "../../index.js";
import type { CacheConfig } from "./types.js";
export declare abstract class Cache {
    static readonly [entityKind]: string;
    abstract strategy(): 'explicit' | 'all';
    /**
     * Invoked if we should check cache for cached response
     * @param sql
     * @param tables
     */
    abstract get(key: string, tables: string[], isTag: boolean, isAutoInvalidate?: boolean): Promise<any[] | undefined>;
    /**
     * Invoked if new query should be inserted to cache
     * @param sql
     * @param tables
     */
    abstract put(hashedQuery: string, response: any, tables: string[], isTag: boolean, config?: CacheConfig): Promise<void>;
    /**
     * Invoked if insert, update, delete was invoked
     * @param tables
     */
    abstract onMutate(params: MutationOption): Promise<void>;
}
export declare class NoopCache extends Cache {
    strategy(): "all";
    static readonly [entityKind]: string;
    get(_key: string): Promise<any[] | undefined>;
    put(_hashedQuery: string, _response: any, _tables: string[], _config?: any): Promise<void>;
    onMutate(_params: MutationOption): Promise<void>;
}
export type MutationOption = {
    tags?: string | string[];
    tables?: Table<any> | Table<any>[] | string | string[];
};
export declare function hashQuery(sql: string, params?: any[]): Promise<string>;
