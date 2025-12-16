/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type self_hosted_runners_settings = {
    /**
     * The policy that controls whether self-hosted runners can be used by repositories in the organization
     */
    enabled_repositories: self_hosted_runners_settings.enabled_repositories;
    /**
     * The URL to the endpoint for managing selected repositories for self-hosted runners in the organization
     */
    selected_repositories_url?: string;
};
export namespace self_hosted_runners_settings {
    /**
     * The policy that controls whether self-hosted runners can be used by repositories in the organization
     */
    export enum enabled_repositories {
        ALL = 'all',
        SELECTED = 'selected',
        NONE = 'none',
    }
}

