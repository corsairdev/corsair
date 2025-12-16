/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Prevent commits that include files with specified file extensions from being pushed to the commit graph.
 */
export type repository_rule_file_extension_restriction = {
    type: repository_rule_file_extension_restriction.type;
    parameters?: {
        /**
         * The file extensions that are restricted from being pushed to the commit graph.
         */
        restricted_file_extensions: Array<string>;
    };
};
export namespace repository_rule_file_extension_restriction {
    export enum type {
        FILE_EXTENSION_RESTRICTION = 'file_extension_restriction',
    }
}

