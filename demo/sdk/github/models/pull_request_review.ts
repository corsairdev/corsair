/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { author_association } from './author_association';
import type { nullable_simple_user } from './nullable_simple_user';
/**
 * Pull Request Reviews are reviews on pull requests.
 */
export type pull_request_review = {
    /**
     * Unique identifier of the review
     */
    id: number;
    node_id: string;
    user: nullable_simple_user;
    /**
     * The text of the review.
     */
    body: string;
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
    /**
     * A commit SHA for the review. If the commit object was garbage collected or forcibly deleted, then it no longer exists in Git and this value will be `null`.
     */
    commit_id: string | null;
    body_html?: string;
    body_text?: string;
    author_association: author_association;
};

