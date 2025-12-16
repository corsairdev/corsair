/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { author_association } from './author_association';
import type { nullable_integration } from './nullable_integration';
import type { reaction_rollup } from './reaction_rollup';
import type { simple_user } from './simple_user';
/**
 * Timeline Comment Event
 */
export type timeline_comment_event = {
    event: string;
    actor: simple_user;
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
    user: simple_user;
    created_at: string;
    updated_at: string;
    issue_url: string;
    author_association: author_association;
    performed_via_github_app?: nullable_integration;
    reactions?: reaction_rollup;
};

