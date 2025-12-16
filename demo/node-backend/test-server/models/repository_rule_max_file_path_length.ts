/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Prevent commits that include file paths that exceed the specified character limit from being pushed to the commit graph.
 */
export type repository_rule_max_file_path_length = {
    type: repository_rule_max_file_path_length.type;
    parameters?: {
        /**
         * The maximum amount of characters allowed in file paths.
         */
        max_file_path_length: number;
    };
};
export namespace repository_rule_max_file_path_length {
    export enum type {
        MAX_FILE_PATH_LENGTH = 'max_file_path_length',
    }
}

