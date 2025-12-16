/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Repository actions caches
 */
export type actions_cache_list = {
    /**
     * Total number of caches
     */
    total_count: number;
    /**
     * Array of caches
     */
    actions_caches: Array<{
        id?: number;
        ref?: string;
        key?: string;
        version?: string;
        last_accessed_at?: string;
        created_at?: string;
        size_in_bytes?: number;
    }>;
};

