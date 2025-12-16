/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Diff Entry
 */
export type diff_entry = {
    sha: string | null;
    filename: string;
    status: diff_entry.status;
    additions: number;
    deletions: number;
    changes: number;
    blob_url: string;
    raw_url: string;
    contents_url: string;
    patch?: string;
    previous_filename?: string;
};
export namespace diff_entry {
    export enum status {
        ADDED = 'added',
        REMOVED = 'removed',
        MODIFIED = 'modified',
        RENAMED = 'renamed',
        COPIED = 'copied',
        CHANGED = 'changed',
        UNCHANGED = 'unchanged',
    }
}

