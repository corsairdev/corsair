/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Actions OIDC subject customization for a repository
 */
export type oidc_custom_sub_repo = {
    /**
     * Whether to use the default template or not. If `true`, the `include_claim_keys` field is ignored.
     */
    use_default: boolean;
    /**
     * Array of unique strings. Each claim key can only contain alphanumeric characters and underscores.
     */
    include_claim_keys?: Array<string>;
};

