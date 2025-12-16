/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { simple_user } from './simple_user';
/**
 * The status of auto merging a pull request.
 */
export type auto_merge = {
    enabled_by: simple_user;
    /**
     * The merge method to use.
     */
    merge_method: auto_merge.merge_method;
    /**
     * Title for the merge commit message.
     */
    commit_title: string;
    /**
     * Commit message for the merge commit.
     */
    commit_message: string;
};
export namespace auto_merge {
    /**
     * The merge method to use.
     */
    export enum merge_method {
        MERGE = 'merge',
        SQUASH = 'squash',
        REBASE = 'rebase',
    }
}

