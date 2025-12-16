/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { deployment_branch_policy_settings } from './deployment_branch_policy_settings';
import type { deployment_reviewer_type } from './deployment_reviewer_type';
import type { simple_user } from './simple_user';
import type { team } from './team';
import type { wait_timer } from './wait_timer';
/**
 * Details of a deployment environment
 */
export type environment = {
    /**
     * The id of the environment.
     */
    id: number;
    node_id: string;
    /**
     * The name of the environment.
     */
    name: string;
    url: string;
    html_url: string;
    /**
     * The time that the environment was created, in ISO 8601 format.
     */
    created_at: string;
    /**
     * The time that the environment was last updated, in ISO 8601 format.
     */
    updated_at: string;
    /**
     * Built-in deployment protection rules for the environment.
     */
    protection_rules?: Array<({
        id: number;
        node_id: string;
        type: string;
        wait_timer?: wait_timer;
    } | {
        id: number;
        node_id: string;
        /**
         * Whether deployments to this environment can be approved by the user who created the deployment.
         */
        prevent_self_review?: boolean;
        type: string;
        /**
         * The people or teams that may approve jobs that reference the environment. You can list up to six users or teams as reviewers. The reviewers must have at least read access to the repository. Only one of the required reviewers needs to approve the job for it to proceed.
         */
        reviewers?: Array<{
            type?: deployment_reviewer_type;
            reviewer?: (simple_user | team);
        }>;
    } | {
        id: number;
        node_id: string;
        type: string;
    })>;
    deployment_branch_policy?: deployment_branch_policy_settings;
};

