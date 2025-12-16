/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { author_association } from './author_association';
import type { nullable_integration } from './nullable_integration';
import type { nullable_simple_user } from './nullable_simple_user';
import type { reaction_rollup } from './reaction_rollup';
/**
 * Comments provide a way for people to collaborate on an issue.
 */
export type issue_comment = {
    /**
     * Unique identifier of the issue comment
     */
    id: number;
    node_id: string;
    /**
     * URL for the issue comment
     */
    url: string;
    /**
     * Contents of the issue comment
     */
    body?: string;
    body_text?: string;
    body_html?: string;
    html_url: string;
    user: nullable_simple_user;
    created_at: string;
    updated_at: string;
    issue_url: string;
    author_association?: author_association;
    performed_via_github_app?: nullable_integration;
    reactions?: reaction_rollup;
};

