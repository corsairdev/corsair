/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { nullable_integration } from './nullable_integration';
import type { nullable_simple_user } from './nullable_simple_user';
/**
 * The status of a deployment.
 */
export type deployment_status = {
    url: string;
    id: number;
    node_id: string;
    /**
     * The state of the status.
     */
    state: deployment_status.state;
    creator: nullable_simple_user;
    /**
     * A short description of the status.
     */
    description: string;
    /**
     * The environment of the deployment that the status is for.
     */
    environment?: string;
    /**
     * Closing down notice: the URL to associate with this status.
     */
    target_url: string;
    created_at: string;
    updated_at: string;
    deployment_url: string;
    repository_url: string;
    /**
     * The URL for accessing your environment.
     */
    environment_url?: string;
    /**
     * The URL to associate with this status.
     */
    log_url?: string;
    performed_via_github_app?: nullable_integration;
};
export namespace deployment_status {
    /**
     * The state of the status.
     */
    export enum state {
        ERROR = 'error',
        FAILURE = 'failure',
        INACTIVE = 'inactive',
        PENDING = 'pending',
        SUCCESS = 'success',
        QUEUED = 'queued',
        IN_PROGRESS = 'in_progress',
    }
}

