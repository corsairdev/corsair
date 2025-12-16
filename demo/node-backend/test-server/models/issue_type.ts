/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The type of issue.
 */
export type issue_type = {
    /**
     * The unique identifier of the issue type.
     */
    id: number;
    /**
     * The node identifier of the issue type.
     */
    node_id: string;
    /**
     * The name of the issue type.
     */
    name: string;
    /**
     * The description of the issue type.
     */
    description: string | null;
    /**
     * The color of the issue type.
     */
    color?: issue_type.color | null;
    /**
     * The time the issue type created.
     */
    created_at?: string;
    /**
     * The time the issue type last updated.
     */
    updated_at?: string;
    /**
     * The enabled state of the issue type.
     */
    is_enabled?: boolean;
};
export namespace issue_type {
    /**
     * The color of the issue type.
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

