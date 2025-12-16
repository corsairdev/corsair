/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Check immutable releases settings for an organization.
 */
export type immutable_releases_organization_settings = {
    /**
     * The policy that controls how immutable releases are enforced in the organization.
     */
    enforced_repositories: immutable_releases_organization_settings.enforced_repositories;
    /**
     * The API URL to use to get or set the selected repositories for immutable releases enforcement, when `enforced_repositories` is set to `selected`.
     */
    selected_repositories_url?: string;
};
export namespace immutable_releases_organization_settings {
    /**
     * The policy that controls how immutable releases are enforced in the organization.
     */
    export enum enforced_repositories {
        ALL = 'all',
        NONE = 'none',
        SELECTED = 'selected',
    }
}

