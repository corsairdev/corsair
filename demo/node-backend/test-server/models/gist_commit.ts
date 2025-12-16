/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { nullable_simple_user } from './nullable_simple_user';
/**
 * Gist Commit
 */
export type gist_commit = {
    url: string;
    version: string;
    user: nullable_simple_user;
    change_status: {
        total?: number;
        additions?: number;
        deletions?: number;
    };
    committed_at: string;
};

