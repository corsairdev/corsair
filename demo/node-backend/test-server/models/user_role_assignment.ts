/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { team_simple } from './team_simple';
/**
 * The Relationship a User has with a role.
 */
export type user_role_assignment = {
    /**
     * Determines if the user has a direct, indirect, or mixed relationship to a role
     */
    assignment?: user_role_assignment.assignment;
    /**
     * Team the user has gotten the role through
     */
    inherited_from?: Array<team_simple>;
    name?: string | null;
    email?: string | null;
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string | null;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    starred_at?: string;
    user_view_type?: string;
};
export namespace user_role_assignment {
    /**
     * Determines if the user has a direct, indirect, or mixed relationship to a role
     */
    export enum assignment {
        DIRECT = 'direct',
        INDIRECT = 'indirect',
        MIXED = 'mixed',
    }
}

