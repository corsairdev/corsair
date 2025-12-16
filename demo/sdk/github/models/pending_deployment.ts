/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { deployment_reviewer_type } from './deployment_reviewer_type';
import type { simple_user } from './simple_user';
import type { team } from './team';
/**
 * Details of a deployment that is waiting for protection rules to pass
 */
export type pending_deployment = {
    environment: {
        /**
         * The id of the environment.
         */
        id?: number;
        node_id?: string;
        /**
         * The name of the environment.
         */
        name?: string;
        url?: string;
        html_url?: string;
    };
    /**
     * The set duration of the wait timer
     */
    wait_timer: number;
    /**
     * The time that the wait timer began.
     */
    wait_timer_started_at: string | null;
    /**
     * Whether the currently authenticated user can approve the deployment
     */
    current_user_can_approve: boolean;
    /**
     * The people or teams that may approve jobs that reference the environment. You can list up to six users or teams as reviewers. The reviewers must have at least read access to the repository. Only one of the required reviewers needs to approve the job for it to proceed.
     */
    reviewers: Array<{
        type?: deployment_reviewer_type;
        reviewer?: (simple_user | team);
    }>;
};

