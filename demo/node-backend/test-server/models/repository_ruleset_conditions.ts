/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Parameters for a repository ruleset ref name condition
 */
export type repository_ruleset_conditions = {
    ref_name?: {
        /**
         * Array of ref names or patterns to include. One of these patterns must match for the condition to pass. Also accepts `~DEFAULT_BRANCH` to include the default branch or `~ALL` to include all branches.
         */
        include?: Array<string>;
        /**
         * Array of ref names or patterns to exclude. The condition will not pass if any of these patterns match.
         */
        exclude?: Array<string>;
    };
};

