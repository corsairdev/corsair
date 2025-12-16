/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Repository invitations let you manage who you collaborate with.
 */
export type repository_subscription = {
    /**
     * Determines if notifications should be received from this repository.
     */
    subscribed: boolean;
    /**
     * Determines if all notifications should be blocked from this repository.
     */
    ignored: boolean;
    reason: string | null;
    created_at: string;
    url: string;
    repository_url: string;
};

