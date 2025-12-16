/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { minimal_repository } from './minimal_repository';
import type { nullable_simple_user } from './nullable_simple_user';
/**
 * Repository invitations let you manage who you collaborate with.
 */
export type repository_invitation = {
    /**
     * Unique identifier of the repository invitation.
     */
    id: number;
    repository: minimal_repository;
    invitee: nullable_simple_user;
    inviter: nullable_simple_user;
    /**
     * The permission associated with the invitation.
     */
    permissions: repository_invitation.permissions;
    created_at: string;
    /**
     * Whether or not the invitation has expired
     */
    expired?: boolean;
    /**
     * URL for the repository invitation
     */
    url: string;
    html_url: string;
    node_id: string;
};
export namespace repository_invitation {
    /**
     * The permission associated with the invitation.
     */
    export enum permissions {
        READ = 'read',
        WRITE = 'write',
        ADMIN = 'admin',
        TRIAGE = 'triage',
        MAINTAIN = 'maintain',
    }
}

