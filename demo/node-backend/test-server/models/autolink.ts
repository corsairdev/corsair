/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * An autolink reference.
 */
export type autolink = {
    id: number;
    /**
     * The prefix of a key that is linkified.
     */
    key_prefix: string;
    /**
     * A template for the target URL that is generated if a key was found.
     */
    url_template: string;
    /**
     * Whether this autolink reference matches alphanumeric characters. If false, this autolink reference only matches numeric characters.
     */
    is_alphanumeric: boolean;
    updated_at?: string | null;
};

