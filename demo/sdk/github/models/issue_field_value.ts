/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A value assigned to an issue field
 */
export type issue_field_value = {
    /**
     * Unique identifier for the issue field.
     */
    issue_field_id: number;
    node_id: string;
    /**
     * The data type of the issue field
     */
    data_type: issue_field_value.data_type;
    /**
     * The value of the issue field
     */
    value: (string | number) | null;
    /**
     * Details about the selected option (only present for single_select fields)
     */
    single_select_option?: {
        /**
         * Unique identifier for the option.
         */
        id: number;
        /**
         * The name of the option
         */
        name: string;
        /**
         * The color of the option
         */
        color: string;
    } | null;
};
export namespace issue_field_value {
    /**
     * The data type of the issue field
     */
    export enum data_type {
        TEXT = 'text',
        SINGLE_SELECT = 'single_select',
        NUMBER = 'number',
        DATE = 'date',
    }
}

