/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Provides details of a hosted runner image
 */
export type actions_hosted_runner_curated_image = {
    /**
     * The ID of the image. Use this ID for the `image` parameter when creating a new larger runner.
     */
    id: string;
    /**
     * The operating system of the image.
     */
    platform: string;
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
    source: actions_hosted_runner_curated_image.source;
};
export namespace actions_hosted_runner_curated_image {
    /**
     * The image provider.
     */
    export enum source {
        GITHUB = 'github',
        PARTNER = 'partner',
        CUSTOM = 'custom',
    }
}

