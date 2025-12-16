/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { code_of_conduct_simple } from './code_of_conduct_simple';
import type { nullable_license_simple } from './nullable_license_simple';
import type { nullable_repository } from './nullable_repository';
import type { nullable_simple_user } from './nullable_simple_user';
import type { repository } from './repository';
import type { security_and_analysis } from './security_and_analysis';
import type { simple_user } from './simple_user';
/**
 * Full Repository
 */
export type full_repository = {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    owner: simple_user;
    private: boolean;
    html_url: string;
    description: string | null;
    fork: boolean;
    url: string;
    archive_url: string;
    assignees_url: string;
    blobs_url: string;
    branches_url: string;
    collaborators_url: string;
    comments_url: string;
    commits_url: string;
    compare_url: string;
    contents_url: string;
    contributors_url: string;
    deployments_url: string;
    downloads_url: string;
    events_url: string;
    forks_url: string;
    git_commits_url: string;
    git_refs_url: string;
    git_tags_url: string;
    git_url: string;
    issue_comment_url: string;
    issue_events_url: string;
    issues_url: string;
    keys_url: string;
    labels_url: string;
    languages_url: string;
    merges_url: string;
    milestones_url: string;
    notifications_url: string;
    pulls_url: string;
    releases_url: string;
    ssh_url: string;
    stargazers_url: string;
    statuses_url: string;
    subscribers_url: string;
    subscription_url: string;
    tags_url: string;
    teams_url: string;
    trees_url: string;
    clone_url: string;
    mirror_url: string | null;
    hooks_url: string;
    svn_url: string;
    homepage: string | null;
    language: string | null;
    forks_count: number;
    stargazers_count: number;
    watchers_count: number;
    /**
     * The size of the repository, in kilobytes. Size is calculated hourly. When a repository is initially created, the size is 0.
     */
    size: number;
    default_branch: string;
    open_issues_count: number;
    is_template?: boolean;
    topics?: Array<string>;
    has_issues: boolean;
    has_projects: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    has_downloads?: boolean;
    has_discussions: boolean;
    archived: boolean;
    /**
     * Returns whether or not this repository disabled.
     */
    disabled: boolean;
    /**
     * The repository visibility: public, private, or internal.
     */
    visibility?: string;
    pushed_at: string;
    created_at: string;
    updated_at: string;
    permissions?: {
        admin: boolean;
        maintain?: boolean;
        push: boolean;
        triage?: boolean;
        pull: boolean;
    };
    allow_rebase_merge?: boolean;
    template_repository?: nullable_repository;
    temp_clone_token?: string | null;
    allow_squash_merge?: boolean;
    allow_auto_merge?: boolean;
    delete_branch_on_merge?: boolean;
    allow_merge_commit?: boolean;
    allow_update_branch?: boolean;
    use_squash_pr_title_as_default?: boolean;
    /**
     * The default value for a squash merge commit title:
     *
     * - `PR_TITLE` - default to the pull request's title.
     * - `COMMIT_OR_PR_TITLE` - default to the commit's title (if only one commit) or the pull request's title (when more than one commit).
     */
    squash_merge_commit_title?: full_repository.squash_merge_commit_title;
    /**
     * The default value for a squash merge commit message:
     *
     * - `PR_BODY` - default to the pull request's body.
     * - `COMMIT_MESSAGES` - default to the branch's commit messages.
     * - `BLANK` - default to a blank commit message.
     */
    squash_merge_commit_message?: full_repository.squash_merge_commit_message;
    /**
     * The default value for a merge commit title.
     *
     * - `PR_TITLE` - default to the pull request's title.
     * - `MERGE_MESSAGE` - default to the classic title for a merge message (e.g., Merge pull request #123 from branch-name).
     */
    merge_commit_title?: full_repository.merge_commit_title;
    /**
     * The default value for a merge commit message.
     *
     * - `PR_TITLE` - default to the pull request's title.
     * - `PR_BODY` - default to the pull request's body.
     * - `BLANK` - default to a blank commit message.
     */
    merge_commit_message?: full_repository.merge_commit_message;
    allow_forking?: boolean;
    web_commit_signoff_required?: boolean;
    subscribers_count: number;
    network_count: number;
    license: nullable_license_simple;
    organization?: nullable_simple_user;
    parent?: repository;
    source?: repository;
    forks: number;
    master_branch?: string;
    open_issues: number;
    watchers: number;
    /**
     * Whether anonymous git access is allowed.
     */
    anonymous_access_enabled?: boolean;
    code_of_conduct?: code_of_conduct_simple;
    security_and_analysis?: security_and_analysis;
    /**
     * The custom properties that were defined for the repository. The keys are the custom property names, and the values are the corresponding custom property values.
     */
    custom_properties?: Record<string, any>;
};
export namespace full_repository {
    /**
     * The default value for a squash merge commit title:
     *
     * - `PR_TITLE` - default to the pull request's title.
     * - `COMMIT_OR_PR_TITLE` - default to the commit's title (if only one commit) or the pull request's title (when more than one commit).
     */
    export enum squash_merge_commit_title {
        PR_TITLE = 'PR_TITLE',
        COMMIT_OR_PR_TITLE = 'COMMIT_OR_PR_TITLE',
    }
    /**
     * The default value for a squash merge commit message:
     *
     * - `PR_BODY` - default to the pull request's body.
     * - `COMMIT_MESSAGES` - default to the branch's commit messages.
     * - `BLANK` - default to a blank commit message.
     */
    export enum squash_merge_commit_message {
        PR_BODY = 'PR_BODY',
        COMMIT_MESSAGES = 'COMMIT_MESSAGES',
        BLANK = 'BLANK',
    }
    /**
     * The default value for a merge commit title.
     *
     * - `PR_TITLE` - default to the pull request's title.
     * - `MERGE_MESSAGE` - default to the classic title for a merge message (e.g., Merge pull request #123 from branch-name).
     */
    export enum merge_commit_title {
        PR_TITLE = 'PR_TITLE',
        MERGE_MESSAGE = 'MERGE_MESSAGE',
    }
    /**
     * The default value for a merge commit message.
     *
     * - `PR_TITLE` - default to the pull request's title.
     * - `PR_BODY` - default to the pull request's body.
     * - `BLANK` - default to a blank commit message.
     */
    export enum merge_commit_message {
        PR_BODY = 'PR_BODY',
        PR_TITLE = 'PR_TITLE',
        BLANK = 'BLANK',
    }
}

