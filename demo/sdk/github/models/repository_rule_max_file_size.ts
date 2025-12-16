/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Prevent commits with individual files that exceed the specified limit from being pushed to the commit graph.
 */
export type repository_rule_max_file_size = {
    type: repository_rule_max_file_size.type;
    parameters?: {
        /**
         * The maximum file size allowed in megabytes. This limit does not apply to Git Large File Storage (Git LFS).
         */
        max_file_size: number;
    };
};
export namespace repository_rule_max_file_size {
    export enum type {
        MAX_FILE_SIZE = 'max_file_size',
    }
}

