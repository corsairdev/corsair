/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { gist_history } from './gist_history';
import type { nullable_simple_user } from './nullable_simple_user';
import type { public_user } from './public_user';
import type { simple_user } from './simple_user';
/**
 * Gist Simple
 */
export type gist_simple = {
    /**
     * @deprecated
     */
    forks?: Array<{
        id?: string;
        url?: string;
        user?: public_user;
        created_at?: string;
        updated_at?: string;
    }> | null;
    /**
     * @deprecated
     */
    history?: Array<gist_history> | null;
    /**
     * Gist
     */
    fork_of?: {
        url: string;
        forks_url: string;
        commits_url: string;
        id: string;
        node_id: string;
        git_pull_url: string;
        git_push_url: string;
        html_url: string;
        files: Record<string, {
            filename?: string;
            type?: string;
            language?: string;
            raw_url?: string;
            size?: number;
        }>;
        public: boolean;
        created_at: string;
        updated_at: string;
        description: string | null;
        comments: number;
        comments_enabled?: boolean;
        user: nullable_simple_user;
        comments_url: string;
        owner?: nullable_simple_user;
        truncated?: boolean;
        forks?: Array<any>;
        history?: Array<any>;
    } | null;
    url?: string;
    forks_url?: string;
    commits_url?: string;
    id?: string;
    node_id?: string;
    git_pull_url?: string;
    git_push_url?: string;
    html_url?: string;
    files?: Record<string, {
        filename?: string;
        type?: string;
        language?: string;
        raw_url?: string;
        size?: number;
        truncated?: boolean;
        content?: string;
        /**
         * The encoding used for `content`. Currently, `"utf-8"` and `"base64"` are supported.
         */
        encoding?: string;
    } | null>;
    public?: boolean;
    created_at?: string;
    updated_at?: string;
    description?: string | null;
    comments?: number;
    comments_enabled?: boolean;
    user?: string | null;
    comments_url?: string;
    owner?: simple_user;
    truncated?: boolean;
};

