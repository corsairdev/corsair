/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Provides details of a hosted runner image
 */
export type nullable_actions_hosted_runner_pool_image = {
    /**
     * The ID of the image. Use this ID for the `image` parameter when creating a new larger runner.
     */
    id: string;
    /**
     * Image size in GB.
     */
    size_gb: number;
    /**
     * Display name for this image.
     */
    display_name: string;
    /**
     * The image provider.
     */
    source: nullable_actions_hosted_runner_pool_image.source;
    /**
     * The image version of the hosted runner pool.
     */
    version?: string;
};
export namespace nullable_actions_hosted_runner_pool_image {
    /**
     * The image provider.
     */
    export enum source {
        GITHUB = 'github',
        PARTNER = 'partner',
        CUSTOM = 'custom',
    }
}

