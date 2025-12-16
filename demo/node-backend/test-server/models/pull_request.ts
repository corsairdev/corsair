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
import type { team_simple } from './team_simple';
/**
 * Pull requests let you tell others about changes you've pushed to a repository on GitHub. Once a pull request is sent, interested parties can review the set of changes, discuss potential modifications, and even push follow-up commits if necessary.
 */
export type pull_request = {
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
    /**
     * Number uniquely identifying the pull request within its repository.
     */
    number: number;
    /**
     * State of this Pull Request. Either `open` or `closed`.
     */
    state: pull_request.state;
    locked: boolean;
    /**
     * The title of the pull request.
     */
    title: string;
    user: simple_user;
    body: string | null;
    labels: Array<{
        id: number;
        node_id: string;
        url: string;
        name: string;
        description: string | null;
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
    requested_teams?: Array<team_simple> | null;
    head: {
        label: string;
        ref: string;
        repo: repository;
        sha: string;
        user: simple_user;
    };
    base: {
        label: string;
        ref: string;
        repo: repository;
        sha: string;
        user: simple_user;
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
    merged: boolean;
    mergeable: boolean | null;
    rebaseable?: boolean | null;
    mergeable_state: string;
    merged_by: nullable_simple_user;
    comments: number;
    review_comments: number;
    /**
     * Indicates whether maintainers can modify the pull request.
     */
    maintainer_can_modify: boolean;
    commits: number;
    additions: number;
    deletions: number;
    changed_files: number;
};
export namespace pull_request {
    /**
     * State of this Pull Request. Either `open` or `closed`.
     */
    export enum state {
        OPEN = 'open',
        CLOSED = 'closed',
    }
}

