/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { simple_user } from './simple_user';
/**
 * Organization Invitation
 */
export type organization_invitation = {
    id: number;
    login: string | null;
    email: string | null;
    role: string;
    created_at: string;
    failed_at?: string | null;
    failed_reason?: string | null;
    inviter: simple_user;
    team_count: number;
    node_id: string;
    invitation_teams_url: string;
    invitation_source?: string;
};

