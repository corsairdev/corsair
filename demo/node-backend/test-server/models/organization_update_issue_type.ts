/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type organization_update_issue_type = {
    /**
     * Name of the issue type.
     */
    name: string;
    /**
     * Whether or not the issue type is enabled at the organization level.
     */
    is_enabled: boolean;
    /**
     * Description of the issue type.
     */
    description?: string | null;
    /**
     * Color for the issue type.
     */
    color?: organization_update_issue_type.color | null;
};
export namespace organization_update_issue_type {
    /**
     * Color for the issue type.
     */
    export enum color {
        GRAY = 'gray',
        BLUE = 'blue',
        GREEN = 'green',
        YELLOW = 'yellow',
        ORANGE = 'orange',
        RED = 'red',
        PINK = 'pink',
        PURPLE = 'purple',
    }
}

