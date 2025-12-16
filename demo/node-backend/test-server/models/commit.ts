/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { diff_entry } from './diff_entry';
import type { empty_object } from './empty_object';
import type { nullable_git_user } from './nullable_git_user';
import type { simple_user } from './simple_user';
import type { verification } from './verification';
/**
 * Commit
 */
export type commit = {
    url: string;
    sha: string;
    node_id: string;
    html_url: string;
    comments_url: string;
    commit: {
        url: string;
        author: nullable_git_user;
        committer: nullable_git_user;
        message: string;
        comment_count: number;
        tree: {
            sha: string;
            url: string;
        };
        verification?: verification;
    };
    author: (simple_user | empty_object) | null;
    committer: (simple_user | empty_object) | null;
    parents: Array<{
        sha: string;
        url: string;
        html_url?: string;
    }>;
    stats?: {
        additions?: number;
        deletions?: number;
        total?: number;
    };
    files?: Array<diff_entry>;
};

