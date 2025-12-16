/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { simple_user } from './simple_user';
/**
 * Minimal representation of an organization programmatic access grant for enumerations
 */
export type organization_programmatic_access_grant = {
    /**
     * Unique identifier of the fine-grained personal access token grant. The `pat_id` used to get details about an approved fine-grained personal access token.
     */
    id: number;
    owner: simple_user;
    /**
     * Type of repository selection requested.
     */
    repository_selection: organization_programmatic_access_grant.repository_selection;
    /**
     * URL to the list of repositories the fine-grained personal access token can access. Only follow when `repository_selection` is `subset`.
     */
    repositories_url: string;
    /**
     * Permissions requested, categorized by type of permission.
     */
    permissions: {
        organization?: Record<string, string>;
        repository?: Record<string, string>;
        other?: Record<string, string>;
    };
    /**
     * Date and time when the fine-grained personal access token was approved to access the organization.
     */
    access_granted_at: string;
    /**
     * Unique identifier of the user's token. This field can also be found in audit log events and the organization's settings for their PAT grants.
     */
    token_id: number;
    /**
     * The name given to the user's token. This field can also be found in an organization's settings page for Active Tokens.
     */
    token_name: string;
    /**
     * Whether the associated fine-grained personal access token has expired.
     */
    token_expired: boolean;
    /**
     * Date and time when the associated fine-grained personal access token expires.
     */
    token_expires_at: string | null;
    /**
     * Date and time when the associated fine-grained personal access token was last used for authentication.
     */
    token_last_used_at: string | null;
};
export namespace organization_programmatic_access_grant {
    /**
     * Type of repository selection requested.
     */
    export enum repository_selection {
        NONE = 'none',
        ALL = 'all',
        SUBSET = 'subset',
    }
}

