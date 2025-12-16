/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A GitHub Actions workflow
 */
export type workflow = {
    id: number;
    node_id: string;
    name: string;
    path: string;
    state: workflow.state;
    created_at: string;
    updated_at: string;
    url: string;
    html_url: string;
    badge_url: string;
    deleted_at?: string;
};
export namespace workflow {
    export enum state {
        ACTIVE = 'active',
        DELETED = 'deleted',
        DISABLED_FORK = 'disabled_fork',
        DISABLED_INACTIVITY = 'disabled_inactivity',
        DISABLED_MANUALLY = 'disabled_manually',
    }
}

