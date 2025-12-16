/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type actions_fork_pr_contributor_approval = {
    /**
     * The policy that controls when fork PR workflows require approval from a maintainer.
     */
    approval_policy: actions_fork_pr_contributor_approval.approval_policy;
};
export namespace actions_fork_pr_contributor_approval {
    /**
     * The policy that controls when fork PR workflows require approval from a maintainer.
     */
    export enum approval_policy {
        FIRST_TIME_CONTRIBUTORS_NEW_TO_GITHUB = 'first_time_contributors_new_to_github',
        FIRST_TIME_CONTRIBUTORS = 'first_time_contributors',
        ALL_EXTERNAL_CONTRIBUTORS = 'all_external_contributors',
    }
}

