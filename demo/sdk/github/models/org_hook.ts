/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Org Hook
 */
export type org_hook = {
    id: number;
    url: string;
    ping_url: string;
    deliveries_url?: string;
    name: string;
    events: Array<string>;
    active: boolean;
    config: {
        url?: string;
        insecure_ssl?: string;
        content_type?: string;
        secret?: string;
    };
    updated_at: string;
    created_at: string;
    type: string;
};

