/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A label for a self hosted runner
 */
export type runner_label = {
    /**
     * Unique identifier of the label.
     */
    id?: number;
    /**
     * Name of the label.
     */
    name: string;
    /**
     * The type of label. Read-only labels are applied automatically when the runner is configured.
     */
    type?: runner_label.type;
};
export namespace runner_label {
    /**
     * The type of label. Read-only labels are applied automatically when the runner is configured.
     */
    export enum type {
        READ_ONLY = 'read-only',
        CUSTOM = 'custom',
    }
}

