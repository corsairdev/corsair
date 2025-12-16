/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Prevent commits that include changes in specified file and folder paths from being pushed to the commit graph. This includes absolute paths that contain file names.
 */
export type repository_rule_file_path_restriction = {
    type: repository_rule_file_path_restriction.type;
    parameters?: {
        /**
         * The file paths that are restricted from being pushed to the commit graph.
         */
        restricted_file_paths: Array<string>;
    };
};
export namespace repository_rule_file_path_restriction {
    export enum type {
        FILE_PATH_RESTRICTION = 'file_path_restriction',
    }
}

