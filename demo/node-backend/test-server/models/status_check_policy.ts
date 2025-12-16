/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Status Check Policy
 */
export type status_check_policy = {
    url: string;
    strict: boolean;
    contexts: Array<string>;
    checks: Array<{
        context: string;
        app_id: number | null;
    }>;
    contexts_url: string;
};

