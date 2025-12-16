/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { nullable_simple_user } from './nullable_simple_user';
/**
 * Gist History
 */
export type gist_history = {
    user?: nullable_simple_user;
    version?: string;
    committed_at?: string;
    change_status?: {
        total?: number;
        additions?: number;
        deletions?: number;
    };
    url?: string;
};

