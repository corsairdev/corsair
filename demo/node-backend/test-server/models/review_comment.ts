/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { author_association } from './author_association';
import type { link } from './link';
import type { nullable_simple_user } from './nullable_simple_user';
import type { reaction_rollup } from './reaction_rollup';
/**
 * Legacy Review Comment
 */
export type review_comment = {
    url: string;
    pull_request_review_id: number | null;
    id: number;
    node_id: string;
    diff_hunk: string;
    path: string;
    position: number | null;
    original_position: number;
    commit_id: string;
    original_commit_id: string;
    in_reply_to_id?: number;
    user: nullable_simple_user;
    body: string;
    created_at: string;
    updated_at: string;
    html_url: string;
    pull_request_url: string;
    author_association: author_association;
    _links: {
        self: link;
        html: link;
        pull_request: link;
    };
    body_text?: string;
    body_html?: string;
    reactions?: reaction_rollup;
    /**
     * The side of the first line of the range for a multi-line comment.
     */
    side?: review_comment.side;
    /**
     * The side of the first line of the range for a multi-line comment.
     */
    start_side?: review_comment.start_side | null;
    /**
     * The line of the blob to which the comment applies. The last line of the range for a multi-line comment
     */
    line?: number;
    /**
     * The original line of the blob to which the comment applies. The last line of the range for a multi-line comment
     */
    original_line?: number;
    /**
     * The first line of the range for a multi-line comment.
     */
    start_line?: number | null;
    /**
     * The original first line of the range for a multi-line comment.
     */
    original_start_line?: number | null;
    /**
     * The level at which the comment is targeted, can be a diff line or a file.
     */
    subject_type?: review_comment.subject_type;
};
export namespace review_comment {
    /**
     * The side of the first line of the range for a multi-line comment.
     */
    export enum side {
        LEFT = 'LEFT',
        RIGHT = 'RIGHT',
    }
    /**
     * The side of the first line of the range for a multi-line comment.
     */
    export enum start_side {
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

