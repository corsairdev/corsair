/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Secrets for GitHub Actions for an organization.
 */
export type organization_actions_secret = {
    /**
     * The name of the secret.
     */
    name: string;
    created_at: string;
    updated_at: string;
    /**
     * Visibility of a secret
     */
    visibility: organization_actions_secret.visibility;
    selected_repositories_url?: string;
};
export namespace organization_actions_secret {
    /**
     * Visibility of a secret
     */
    export enum visibility {
        ALL = 'all',
        PRIVATE = 'private',
        SELECTED = 'selected',
    }
}

