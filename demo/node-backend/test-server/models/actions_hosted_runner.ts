/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { actions_hosted_runner_machine_spec } from './actions_hosted_runner_machine_spec';
import type { nullable_actions_hosted_runner_pool_image } from './nullable_actions_hosted_runner_pool_image';
import type { public_ip } from './public_ip';
/**
 * A Github-hosted hosted runner.
 */
export type actions_hosted_runner = {
    /**
     * The unique identifier of the hosted runner.
     */
    id: number;
    /**
     * The name of the hosted runner.
     */
    name: string;
    /**
     * The unique identifier of the group that the hosted runner belongs to.
     */
    runner_group_id?: number;
    image_details: nullable_actions_hosted_runner_pool_image;
    machine_size_details: actions_hosted_runner_machine_spec;
    /**
     * The status of the runner.
     */
    status: actions_hosted_runner.status;
    /**
     * The operating system of the image.
     */
    platform: string;
    /**
     * The maximum amount of hosted runners. Runners will not scale automatically above this number. Use this setting to limit your cost.
     */
    maximum_runners?: number;
    /**
     * Whether public IP is enabled for the hosted runners.
     */
    public_ip_enabled: boolean;
    /**
     * The public IP ranges when public IP is enabled for the hosted runners.
     */
    public_ips?: Array<public_ip>;
    /**
     * The time at which the runner was last used, in ISO 8601 format.
     */
    last_active_on?: string | null;
    /**
     * Whether custom image generation is enabled for the hosted runners.
     */
    image_gen?: boolean;
};
export namespace actions_hosted_runner {
    /**
     * The status of the runner.
     */
    export enum status {
        READY = 'Ready',
        PROVISIONING = 'Provisioning',
        SHUTDOWN = 'Shutdown',
        DELETING = 'Deleting',
        STUCK = 'Stuck',
    }
}

