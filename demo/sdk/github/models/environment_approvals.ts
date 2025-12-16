/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { simple_user } from './simple_user';
/**
 * An entry in the reviews log for environment deployments
 */
export type environment_approvals = {
    /**
     * The list of environments that were approved or rejected
     */
    environments: Array<{
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
        /**
         * The time that the environment was created, in ISO 8601 format.
         */
        created_at?: string;
        /**
         * The time that the environment was last updated, in ISO 8601 format.
         */
        updated_at?: string;
    }>;
    /**
     * Whether deployment to the environment(s) was approved or rejected or pending (with comments)
     */
    state: environment_approvals.state;
    user: simple_user;
    /**
     * The comment submitted with the deployment review
     */
    comment: string;
};
export namespace environment_approvals {
    /**
     * Whether deployment to the environment(s) was approved or rejected or pending (with comments)
     */
    export enum state {
        APPROVED = 'approved',
        REJECTED = 'rejected',
        PENDING = 'pending',
    }
}

