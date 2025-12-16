/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { custom_property_value } from './custom_property_value';
/**
 * List of custom property values for a repository
 */
export type org_repo_custom_property_values = {
    repository_id: number;
    repository_name: string;
    repository_full_name: string;
    /**
     * List of custom property names and associated values
     */
    properties: Array<custom_property_value>;
};

