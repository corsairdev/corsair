/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { repository } from './repository';
/**
 * Authentication Token
 */
export type authentication_token = {
    /**
     * The token used for authentication
     */
    token: string;
    /**
     * The time this token expires
     */
    expires_at: string;
    permissions?: Record<string, any>;
    /**
     * The repositories this token has access to
     */
    repositories?: Array<repository>;
    single_file?: string | null;
    /**
     * Describe whether all repositories have been selected or there's a selection involved
     */
    repository_selection?: authentication_token.repository_selection;
};
export namespace authentication_token {
    /**
     * Describe whether all repositories have been selected or there's a selection involved
     */
    export enum repository_selection {
        ALL = 'all',
        SELECTED = 'selected',
    }
}

