/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Groups of organization members that gives permissions on specified repositories.
 */
export type team_simple = {
    /**
     * Unique identifier of the team
     */
    id: number;
    node_id: string;
    /**
     * URL for the team
     */
    url: string;
    members_url: string;
    /**
     * Name of the team
     */
    name: string;
    /**
     * Description of the team
     */
    description: string | null;
    /**
     * Permission that the team will have for its repositories
     */
    permission: string;
    /**
     * The level of privacy this team should have
     */
    privacy?: string;
    /**
     * The notification setting the team has set
     */
    notification_setting?: string;
    html_url: string;
    repositories_url: string;
    slug: string;
    /**
     * Distinguished Name (DN) that team maps to within LDAP environment
     */
    ldap_dn?: string;
    /**
     * The ownership type of the team
     */
    type: team_simple.type;
    /**
     * Unique identifier of the organization to which this team belongs
     */
    organization_id?: number;
    /**
     * Unique identifier of the enterprise to which this team belongs
     */
    enterprise_id?: number;
};
export namespace team_simple {
    /**
     * The ownership type of the team
     */
    export enum type {
        ENTERPRISE = 'enterprise',
        ORGANIZATION = 'organization',
    }
}

