/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { app_permissions } from './app_permissions';
import type { enterprise } from './enterprise';
import type { nullable_simple_user } from './nullable_simple_user';
import type { simple_user } from './simple_user';
/**
 * Installation
 */
export type installation = {
    /**
     * The ID of the installation.
     */
    id: number;
    account: (simple_user | enterprise) | null;
    /**
     * Describe whether all repositories have been selected or there's a selection involved
     */
    repository_selection: installation.repository_selection;
    access_tokens_url: string;
    repositories_url: string;
    html_url: string;
    app_id: number;
    client_id?: string;
    /**
     * The ID of the user or organization this token is being scoped to.
     */
    target_id: number;
    target_type: string;
    permissions: app_permissions;
    events: Array<string>;
    created_at: string;
    updated_at: string;
    single_file_name: string | null;
    has_multiple_single_files?: boolean;
    single_file_paths?: Array<string>;
    app_slug: string;
    suspended_by: nullable_simple_user;
    suspended_at: string | null;
    contact_email?: string | null;
};
export namespace installation {
    /**
     * Describe whether all repositories have been selected or there's a selection involved
     */
    export enum repository_selection {
        ALL = 'all',
        SELECTED = 'selected',
    }
}

