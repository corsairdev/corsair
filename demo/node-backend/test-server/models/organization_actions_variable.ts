/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Organization variable for GitHub Actions.
 */
export type organization_actions_variable = {
    /**
     * The name of the variable.
     */
    name: string;
    /**
     * The value of the variable.
     */
    value: string;
    /**
     * The date and time at which the variable was created, in ISO 8601 format':' YYYY-MM-DDTHH:MM:SSZ.
     */
    created_at: string;
    /**
     * The date and time at which the variable was last updated, in ISO 8601 format':' YYYY-MM-DDTHH:MM:SSZ.
     */
    updated_at: string;
    /**
     * Visibility of a variable
     */
    visibility: organization_actions_variable.visibility;
    selected_repositories_url?: string;
};
export namespace organization_actions_variable {
    /**
     * Visibility of a variable
     */
    export enum visibility {
        ALL = 'all',
        PRIVATE = 'private',
        SELECTED = 'selected',
    }
}

