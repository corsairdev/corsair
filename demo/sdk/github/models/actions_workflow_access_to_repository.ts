/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type actions_workflow_access_to_repository = {
    /**
     * Defines the level of access that workflows outside of the repository have to actions and reusable workflows within the
     * repository.
     *
     * `none` means the access is only possible from workflows in this repository. `user` level access allows sharing across user owned private repositories only. `organization` level access allows sharing across the organization.
     */
    access_level: actions_workflow_access_to_repository.access_level;
};
export namespace actions_workflow_access_to_repository {
    /**
     * Defines the level of access that workflows outside of the repository have to actions and reusable workflows within the
     * repository.
     *
     * `none` means the access is only possible from workflows in this repository. `user` level access allows sharing across user owned private repositories only. `organization` level access allows sharing across the organization.
     */
    export enum access_level {
        NONE = 'none',
        USER = 'user',
        ORGANIZATION = 'organization',
    }
}

