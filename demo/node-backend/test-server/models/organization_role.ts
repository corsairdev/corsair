/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { nullable_simple_user } from './nullable_simple_user';
/**
 * Organization roles
 */
export type organization_role = {
    /**
     * The unique identifier of the role.
     */
    id: number;
    /**
     * The name of the role.
     */
    name: string;
    /**
     * A short description about who this role is for or what permissions it grants.
     */
    description?: string | null;
    /**
     * The system role from which this role inherits permissions.
     */
    base_role?: organization_role.base_role | null;
    /**
     * Source answers the question, "where did this role come from?"
     */
    source?: organization_role.source | null;
    /**
     * A list of permissions included in this role.
     */
    permissions: Array<string>;
    organization: nullable_simple_user;
    /**
     * The date and time the role was created.
     */
    created_at: string;
    /**
     * The date and time the role was last updated.
     */
    updated_at: string;
};
export namespace organization_role {
    /**
     * The system role from which this role inherits permissions.
     */
    export enum base_role {
        READ = 'read',
        TRIAGE = 'triage',
        WRITE = 'write',
        MAINTAIN = 'maintain',
        ADMIN = 'admin',
    }
    /**
     * Source answers the question, "where did this role come from?"
     */
    export enum source {
        ORGANIZATION = 'Organization',
        ENTERPRISE = 'Enterprise',
        PREDEFINED = 'Predefined',
    }
}

