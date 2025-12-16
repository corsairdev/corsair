/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Custom property defined on an organization
 */
export type custom_property = {
    /**
     * The name of the property
     */
    property_name: string;
    /**
     * The URL that can be used to fetch, update, or delete info about this property via the API.
     */
    url?: string;
    /**
     * The source type of the property
     */
    source_type?: custom_property.source_type;
    /**
     * The type of the value for the property
     */
    value_type: custom_property.value_type;
    /**
     * Whether the property is required.
     */
    required?: boolean;
    /**
     * Default value of the property
     */
    default_value?: (string | Array<string>) | null;
    /**
     * Short description of the property
     */
    description?: string | null;
    /**
     * An ordered list of the allowed values of the property.
     * The property can have up to 200 allowed values.
     */
    allowed_values?: Array<string> | null;
    /**
     * Who can edit the values of the property
     */
    values_editable_by?: custom_property.values_editable_by | null;
};
export namespace custom_property {
    /**
     * The source type of the property
     */
    export enum source_type {
        ORGANIZATION = 'organization',
        ENTERPRISE = 'enterprise',
    }
    /**
     * The type of the value for the property
     */
    export enum value_type {
        STRING = 'string',
        SINGLE_SELECT = 'single_select',
        MULTI_SELECT = 'multi_select',
        TRUE_FALSE = 'true_false',
        URL = 'url',
    }
    /**
     * Who can edit the values of the property
     */
    export enum values_editable_by {
        ORG_ACTORS = 'org_actors',
        ORG_AND_REPO_ACTORS = 'org_and_repo_actors',
    }
}

