/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { author_association } from './author_association';
import type { simple_user } from './simple_user';
/**
 * Timeline Reviewed Event
 */
export type timeline_reviewed_event = {
    event: string;
    /**
     * Unique identifier of the review
     */
    id: number;
    node_id: string;
    user: simple_user;
    /**
     * The text of the review.
     */
    body: string | null;
    state: string;
    html_url: string;
    pull_request_url: string;
    _links: {
        html: {
            href: string;
        };
        pull_request: {
            href: string;
        };
    };
    submitted_at?: string;
    updated_at?: string | null;
    /**
     * A commit SHA for the review.
     */
    commit_id: string;
    body_html?: string;
    body_text?: string;
    author_association: author_association;
};

