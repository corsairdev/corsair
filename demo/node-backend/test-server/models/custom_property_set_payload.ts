/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Custom property set payload
 */
export type custom_property_set_payload = {
    /**
     * The type of the value for the property
     */
    value_type: custom_property_set_payload.value_type;
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
    values_editable_by?: custom_property_set_payload.values_editable_by | null;
};
export namespace custom_property_set_payload {
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

