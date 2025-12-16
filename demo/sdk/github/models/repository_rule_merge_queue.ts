/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Merges must be performed via a merge queue.
 */
export type repository_rule_merge_queue = {
    type: repository_rule_merge_queue.type;
    parameters?: {
        /**
         * Maximum time for a required status check to report a conclusion. After this much time has elapsed, checks that have not reported a conclusion will be assumed to have failed
         */
        check_response_timeout_minutes: number;
        /**
         * When set to ALLGREEN, the merge commit created by merge queue for each PR in the group must pass all required checks to merge. When set to HEADGREEN, only the commit at the head of the merge group, i.e. the commit containing changes from all of the PRs in the group, must pass its required checks to merge.
         */
        grouping_strategy: repository_rule_merge_queue.grouping_strategy;
        /**
         * Limit the number of queued pull requests requesting checks and workflow runs at the same time.
         */
        max_entries_to_build: number;
        /**
         * The maximum number of PRs that will be merged together in a group.
         */
        max_entries_to_merge: number;
        /**
         * Method to use when merging changes from queued pull requests.
         */
        merge_method: repository_rule_merge_queue.merge_method;
        /**
         * The minimum number of PRs that will be merged together in a group.
         */
        min_entries_to_merge: number;
        /**
         * The time merge queue should wait after the first PR is added to the queue for the minimum group size to be met. After this time has elapsed, the minimum group size will be ignored and a smaller group will be merged.
         */
        min_entries_to_merge_wait_minutes: number;
    };
};
export namespace repository_rule_merge_queue {
    export enum type {
        MERGE_QUEUE = 'merge_queue',
    }
    /**
     * When set to ALLGREEN, the merge commit created by merge queue for each PR in the group must pass all required checks to merge. When set to HEADGREEN, only the commit at the head of the merge group, i.e. the commit containing changes from all of the PRs in the group, must pass its required checks to merge.
     */
    export enum grouping_strategy {
        ALLGREEN = 'ALLGREEN',
        HEADGREEN = 'HEADGREEN',
    }
    /**
     * Method to use when merging changes from queued pull requests.
     */
    export enum merge_method {
        MERGE = 'MERGE',
        SQUASH = 'SQUASH',
        REBASE = 'REBASE',
    }
}

