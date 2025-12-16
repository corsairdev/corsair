/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { author_association } from './author_association';
import type { reaction_rollup } from './reaction_rollup';
import type { simple_user } from './simple_user';
/**
 * Pull Request Review Comments are comments on a portion of the Pull Request's diff.
 */
export type pull_request_review_comment = {
    /**
     * URL for the pull request review comment
     */
    url: string;
    /**
     * The ID of the pull request review to which the comment belongs.
     */
    pull_request_review_id: number | null;
    /**
     * The ID of the pull request review comment.
     */
    id: number;
    /**
     * The node ID of the pull request review comment.
     */
    node_id: string;
    /**
     * The diff of the line that the comment refers to.
     */
    diff_hunk: string;
    /**
     * The relative path of the file to which the comment applies.
     */
    path: string;
    /**
     * The line index in the diff to which the comment applies. This field is closing down; use `line` instead.
     */
    position?: number;
    /**
     * The index of the original line in the diff to which the comment applies. This field is closing down; use `original_line` instead.
     */
    original_position?: number;
    /**
     * The SHA of the commit to which the comment applies.
     */
    commit_id: string;
    /**
     * The SHA of the original commit to which the comment applies.
     */
    original_commit_id: string;
    /**
     * The comment ID to reply to.
     */
    in_reply_to_id?: number;
    user: simple_user;
    /**
     * The text of the comment.
     */
    body: string;
    created_at: string;
    updated_at: string;
    /**
     * HTML URL for the pull request review comment.
     */
    html_url: string;
    /**
     * URL for the pull request that the review comment belongs to.
     */
    pull_request_url: string;
    author_association: author_association;
    _links: {
        self: {
            href: string;
        };
        html: {
            href: string;
        };
        pull_request: {
            href: string;
        };
    };
    /**
     * The first line of the range for a multi-line comment.
     */
    start_line?: number | null;
    /**
     * The first line of the range for a multi-line comment.
     */
    original_start_line?: number | null;
    /**
     * The side of the first line of the range for a multi-line comment.
     */
    start_side?: pull_request_review_comment.start_side | null;
    /**
     * The line of the blob to which the comment applies. The last line of the range for a multi-line comment
     */
    line?: number;
    /**
     * The line of the blob to which the comment applies. The last line of the range for a multi-line comment
     */
    original_line?: number;
    /**
     * The side of the diff to which the comment applies. The side of the last line of the range for a multi-line comment
     */
    side?: pull_request_review_comment.side;
    /**
     * The level at which the comment is targeted, can be a diff line or a file.
     */
    subject_type?: pull_request_review_comment.subject_type;
    reactions?: reaction_rollup;
    body_html?: string;
    body_text?: string;
};
export namespace pull_request_review_comment {
    /**
     * The side of the first line of the range for a multi-line comment.
     */
    export enum start_side {
        LEFT = 'LEFT',
        RIGHT = 'RIGHT',
    }
    /**
     * The side of the diff to which the comment applies. The side of the last line of the range for a multi-line comment
     */
    export enum side {
        LEFT = 'LEFT',
        RIGHT = 'RIGHT',
    }
    /**
     * The level at which the comment is targeted, can be a diff line or a file.
     */
    export enum subject_type {
        LINE = 'line',
        FILE = 'file',
    }
}

