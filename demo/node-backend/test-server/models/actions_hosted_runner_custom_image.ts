/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Provides details of a custom runner image
 */
export type actions_hosted_runner_custom_image = {
    /**
     * The ID of the image. Use this ID for the `image` parameter when creating a new larger runner.
     */
    id: number;
    /**
     * The operating system of the image.
     */
    platform: string;
    /**
     * Total size of all the image versions in GB.
     */
    total_versions_size: number;
    /**
     * Display name for this image.
     */
    name: string;
    /**
     * The image provider.
     */
    source: string;
    /**
     * The number of image versions associated with the image.
     */
    versions_count: number;
    /**
     * The latest image version associated with the image.
     */
    latest_version: string;
    /**
     * The number of image versions associated with the image.
     */
    state: string;
};

