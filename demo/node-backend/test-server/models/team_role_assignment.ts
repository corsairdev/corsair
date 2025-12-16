/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { nullable_team_simple } from './nullable_team_simple';
/**
 * The Relationship a Team has with a role.
 */
export type team_role_assignment = {
    /**
     * Determines if the team has a direct, indirect, or mixed relationship to a role
     */
    assignment?: team_role_assignment.assignment;
    id: number;
    node_id: string;
    name: string;
    slug: string;
    description: string | null;
    privacy?: string;
    notification_setting?: string;
    permission: string;
    permissions?: {
        pull: boolean;
        triage: boolean;
        push: boolean;
        maintain: boolean;
        admin: boolean;
    };
    url: string;
    html_url: string;
    members_url: string;
    repositories_url: string;
    parent: nullable_team_simple;
    /**
     * The ownership type of the team
     */
    type: team_role_assignment.type;
    /**
     * Unique identifier of the organization to which this team belongs
     */
    organization_id?: number;
    /**
     * Unique identifier of the enterprise to which this team belongs
     */
    enterprise_id?: number;
};
export namespace team_role_assignment {
    /**
     * Determines if the team has a direct, indirect, or mixed relationship to a role
     */
    export enum assignment {
        DIRECT = 'direct',
        INDIRECT = 'indirect',
        MIXED = 'mixed',
    }
    /**
     * The ownership type of the team
     */
    export enum type {
        ENTERPRISE = 'enterprise',
        ORGANIZATION = 'organization',
    }
}

