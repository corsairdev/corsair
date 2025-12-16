/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { nullable_integration } from './nullable_integration';
import type { nullable_simple_user } from './nullable_simple_user';
/**
 * A request for a specific ref(branch,sha,tag) to be deployed
 */
export type deployment = {
    url: string;
    /**
     * Unique identifier of the deployment
     */
    id: number;
    node_id: string;
    sha: string;
    /**
     * The ref to deploy. This can be a branch, tag, or sha.
     */
    ref: string;
    /**
     * Parameter to specify a task to execute
     */
    task: string;
    payload: (Record<string, any> | string);
    original_environment?: string;
    /**
     * Name for the target deployment environment.
     */
    environment: string;
    description: string | null;
    creator: nullable_simple_user;
    created_at: string;
    updated_at: string;
    statuses_url: string;
    repository_url: string;
    /**
     * Specifies if the given environment is will no longer exist at some point in the future. Default: false.
     */
    transient_environment?: boolean;
    /**
     * Specifies if the given environment is one that end-users directly interact with. Default: false.
     */
    production_environment?: boolean;
    performed_via_github_app?: nullable_integration;
};

