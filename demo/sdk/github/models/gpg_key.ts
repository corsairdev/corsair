/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A unique encryption key
 */
export type gpg_key = {
    id: number;
    name?: string | null;
    primary_key_id: number | null;
    key_id: string;
    public_key: string;
    emails: Array<{
        email?: string;
        verified?: boolean;
    }>;
    subkeys: Array<{
        id?: number;
        primary_key_id?: number;
        key_id?: string;
        public_key?: string;
        emails?: Array<{
            email?: string;
            verified?: boolean;
        }>;
        subkeys?: Array<any>;
        can_sign?: boolean;
        can_encrypt_comms?: boolean;
        can_encrypt_storage?: boolean;
        can_certify?: boolean;
        created_at?: string;
        expires_at?: string | null;
        raw_key?: string | null;
        revoked?: boolean;
    }>;
    can_sign: boolean;
    can_encrypt_comms: boolean;
    can_encrypt_storage: boolean;
    can_certify: boolean;
    created_at: string;
    expires_at: string | null;
    revoked: boolean;
    raw_key: string | null;
};

