/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { author_association } from './author_association';
import type { auto_merge } from './auto_merge';
import type { link } from './link';
import type { nullable_milestone } from './nullable_milestone';
import type { nullable_simple_user } from './nullable_simple_user';
import type { repository } from './repository';
import type { simple_user } from './simple_user';
import type { team } from './team';
/**
 * Pull Request Simple
 */
export type pull_request_simple = {
    url: string;
    id: number;
    node_id: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
    issue_url: string;
    commits_url: string;
    review_comments_url: string;
    review_comment_url: string;
    comments_url: string;
    statuses_url: string;
    number: number;
    state: string;
    locked: boolean;
    title: string;
    user: nullable_simple_user;
    body: string | null;
    labels: Array<{
        id: number;
        node_id: string;
        url: string;
        name: string;
        description: string;
        color: string;
        default: boolean;
    }>;
    milestone: nullable_milestone;
    active_lock_reason?: string | null;
    created_at: string;
    updated_at: string;
    closed_at: string | null;
    merged_at: string | null;
    merge_commit_sha: string | null;
    assignee: nullable_simple_user;
    assignees?: Array<simple_user> | null;
    requested_reviewers?: Array<simple_user> | null;
    requested_teams?: Array<team> | null;
    head: {
        label: string;
        ref: string;
        repo: repository;
        sha: string;
        user: nullable_simple_user;
    };
    base: {
        label: string;
        ref: string;
        repo: repository;
        sha: string;
        user: nullable_simple_user;
    };
    _links: {
        comments: link;
        commits: link;
        statuses: link;
        html: link;
        issue: link;
        review_comments: link;
        review_comment: link;
        self: link;
    };
    author_association: author_association;
    auto_merge: auto_merge;
    /**
     * Indicates whether or not the pull request is a draft.
     */
    draft?: boolean;
};

