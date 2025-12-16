/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Color-coded labels help you categorize and filter your issues (just like labels in Gmail).
 */
export type label = {
    /**
     * Unique identifier for the label.
     */
    id: number;
    node_id: string;
    /**
     * URL for the label
     */
    url: string;
    /**
     * The name of the label.
     */
    name: string;
    /**
     * Optional description of the label, such as its purpose.
     */
    description: string | null;
    /**
     * 6-character hex code, without the leading #, identifying the color
     */
    color: string;
    /**
     * Whether this label comes by default in a new repository.
     */
    default: boolean;
};

