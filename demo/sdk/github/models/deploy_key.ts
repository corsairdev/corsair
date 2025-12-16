/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * An SSH key granting access to a single repository.
 */
export type deploy_key = {
    id: number;
    key: string;
    url: string;
    title: string;
    verified: boolean;
    created_at: string;
    read_only: boolean;
    added_by?: string | null;
    last_used?: string | null;
    enabled?: boolean;
};

