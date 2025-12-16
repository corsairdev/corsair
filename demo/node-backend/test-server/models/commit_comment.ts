/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { author_association } from './author_association';
import type { nullable_simple_user } from './nullable_simple_user';
import type { reaction_rollup } from './reaction_rollup';
/**
 * Commit Comment
 */
export type commit_comment = {
    html_url: string;
    url: string;
    id: number;
    node_id: string;
    body: string;
    path: string | null;
    position: number | null;
    line: number | null;
    commit_id: string;
    user: nullable_simple_user;
    created_at: string;
    updated_at: string;
    author_association: author_association;
    reactions?: reaction_rollup;
};

