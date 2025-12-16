/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { repository_ruleset_conditions_repository_property_spec } from './repository_ruleset_conditions_repository_property_spec';
/**
 * Parameters for a repository property condition
 */
export type repository_ruleset_conditions_repository_property_target = {
    repository_property: {
        /**
         * The repository properties and values to include. All of these properties must match for the condition to pass.
         */
        include?: Array<repository_ruleset_conditions_repository_property_spec>;
        /**
         * The repository properties and values to exclude. The condition will not pass if any of these properties match.
         */
        exclude?: Array<repository_ruleset_conditions_repository_property_spec>;
    };
};

