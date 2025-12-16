/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Parameters for a repository name condition
 */
export type repository_ruleset_conditions_repository_name_target = {
    repository_name: {
        /**
         * Array of repository names or patterns to include. One of these patterns must match for the condition to pass. Also accepts `~ALL` to include all repositories.
         */
        include?: Array<string>;
        /**
         * Array of repository names or patterns to exclude. The condition will not pass if any of these patterns match.
         */
        exclude?: Array<string>;
        /**
         * Whether renaming of target repositories is prevented.
         */
        protected?: boolean;
    };
};

