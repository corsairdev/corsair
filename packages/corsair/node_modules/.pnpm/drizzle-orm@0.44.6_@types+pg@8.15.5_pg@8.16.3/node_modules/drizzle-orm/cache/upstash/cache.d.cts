import { Redis } from '@upstash/redis';
import type { MutationOption } from "../core/index.cjs";
import { Cache } from "../core/index.cjs";
import { entityKind } from "../../entity.cjs";
import type { CacheConfig } from "../core/types.cjs";
export declare class UpstashCache extends Cache {
    redis: Redis;
    protected useGlobally?: boolean | undefined;
    static readonly [entityKind]: string;
    /**
     * Prefix for sets which denote the composite table names for each unique table
     *
     * Example: In the composite table set of "table1", you may find
     * `${compositeTablePrefix}table1,table2` and `${compositeTablePrefix}table1,table3`
     */
    private static compositeTableSetPrefix;
    /**
     * Prefix for hashes which map hash or tags to cache values
     */
    private static compositeTablePrefix;
    /**
     * Key which holds the mapping of tags to composite table names
     *
     * Using this tagsMapKey, you can find the composite table name for a given tag
     * and get the cache value for that tag:
     *
     * ```ts
     * const compositeTable = redis.hget(tagsMapKey, 'tag1')
     * console.log(compositeTable) // `${compositeTablePrefix}table1,table2`
     *
     * const cachevalue = redis.hget(compositeTable, 'tag1')
     */
    private static tagsMapKey;
    /**
     * Queries whose auto invalidation is false aren't stored in their respective
     * composite table hashes because those hashes are deleted when a mutation
     * occurs on related tables.
     *
     * Instead, they are stored in a separate hash with the prefix
     * `__nonAutoInvalidate__` to prevent them from being deleted when a mutation
     */
    private static nonAutoInvalidateTablePrefix;
    private luaScripts;
    private internalConfig;
    constructor(redis: Redis, config?: CacheConfig, useGlobally?: boolean | undefined);
    strategy(): "all" | "explicit";
    private toInternalConfig;
    get(key: string, tables: string[], isTag?: boolean, isAutoInvalidate?: boolean): Promise<any[] | undefined>;
    put(key: string, response: any, tables: string[], isTag?: boolean, config?: CacheConfig): Promise<void>;
    onMutate(params: MutationOption): Promise<void>;
    private addTablePrefix;
    private getCompositeKey;
}
export declare function upstashCache({ url, token, config, global }: {
    url: string;
    token: string;
    config?: CacheConfig;
    global?: boolean;
}): UpstashCache;
