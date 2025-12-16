/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Results of a successful merge upstream request
 */
export type merged_upstream = {
    message?: string;
    merge_type?: merged_upstream.merge_type;
    base_branch?: string;
};
export namespace merged_upstream {
    export enum merge_type {
        MERGE = 'merge',
        FAST_FORWARD = 'fast-forward',
        NONE = 'none',
    }
}

