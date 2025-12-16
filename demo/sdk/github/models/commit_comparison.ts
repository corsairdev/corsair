/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { commit } from './commit';
import type { diff_entry } from './diff_entry';
/**
 * Commit Comparison
 */
export type commit_comparison = {
    url: string;
    html_url: string;
    permalink_url: string;
    diff_url: string;
    patch_url: string;
    base_commit: commit;
    merge_base_commit: commit;
    status: commit_comparison.status;
    ahead_by: number;
    behind_by: number;
    total_commits: number;
    commits: Array<commit>;
    files?: Array<diff_entry>;
};
export namespace commit_comparison {
    export enum status {
        DIVERGED = 'diverged',
        AHEAD = 'ahead',
        BEHIND = 'behind',
        IDENTICAL = 'identical',
    }
}

