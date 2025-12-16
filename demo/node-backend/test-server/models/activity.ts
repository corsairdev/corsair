/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { nullable_simple_user } from './nullable_simple_user';
/**
 * Activity
 */
export type activity = {
    id: number;
    node_id: string;
    /**
     * The SHA of the commit before the activity.
     */
    before: string;
    /**
     * The SHA of the commit after the activity.
     */
    after: string;
    /**
     * The full Git reference, formatted as `refs/heads/<branch name>`.
     */
    ref: string;
    /**
     * The time when the activity occurred.
     */
    timestamp: string;
    /**
     * The type of the activity that was performed.
     */
    activity_type: activity.activity_type;
    actor: nullable_simple_user;
};
export namespace activity {
    /**
     * The type of the activity that was performed.
     */
    export enum activity_type {
        PUSH = 'push',
        FORCE_PUSH = 'force_push',
        BRANCH_DELETION = 'branch_deletion',
        BRANCH_CREATION = 'branch_creation',
        PR_MERGE = 'pr_merge',
        MERGE_QUEUE_MERGE = 'merge_queue_merge',
    }
}

