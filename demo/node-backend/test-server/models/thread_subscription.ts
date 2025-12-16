/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Thread Subscription
 */
export type thread_subscription = {
    subscribed: boolean;
    ignored: boolean;
    reason: string | null;
    created_at: string | null;
    url: string;
    thread_url?: string;
    repository_url?: string;
};

