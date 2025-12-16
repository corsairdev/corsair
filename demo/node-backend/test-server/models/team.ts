/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { nullable_team_simple } from './nullable_team_simple';
/**
 * Groups of organization members that gives permissions on specified repositories.
 */
export type team = {
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
    /**
     * The ownership type of the team
     */
    type: team.type;
    /**
     * Unique identifier of the organization to which this team belongs
     */
    organization_id?: number;
    /**
     * Unique identifier of the enterprise to which this team belongs
     */
    enterprise_id?: number;
    parent: nullable_team_simple;
};
export namespace team {
    /**
     * The ownership type of the team
     */
    export enum type {
        ENTERPRISE = 'enterprise',
        ORGANIZATION = 'organization',
    }
}

