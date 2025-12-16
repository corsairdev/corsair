/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Parameters for a repository ID condition
 */
export type repository_ruleset_conditions_repository_id_target = {
    repository_id: {
        /**
         * The repository IDs that the ruleset applies to. One of these IDs must match for the condition to pass.
         */
        repository_ids?: Array<number>;
    };
};

