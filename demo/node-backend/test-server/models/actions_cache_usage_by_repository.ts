/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * GitHub Actions Cache Usage by repository.
 */
export type actions_cache_usage_by_repository = {
    /**
     * The repository owner and name for the cache usage being shown.
     */
    full_name: string;
    /**
     * The sum of the size in bytes of all the active cache items in the repository.
     */
    active_caches_size_in_bytes: number;
    /**
     * The number of active caches in the repository.
     */
    active_caches_count: number;
};

