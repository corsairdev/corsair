/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Details of a deployment branch or tag policy.
 */
export type deployment_branch_policy = {
    /**
     * The unique identifier of the branch or tag policy.
     */
    id?: number;
    node_id?: string;
    /**
     * The name pattern that branches or tags must match in order to deploy to the environment.
     */
    name?: string;
    /**
     * Whether this rule targets a branch or tag.
     */
    type?: deployment_branch_policy.type;
};
export namespace deployment_branch_policy {
    /**
     * Whether this rule targets a branch or tag.
     */
    export enum type {
        BRANCH = 'branch',
        TAG = 'tag',
    }
}

