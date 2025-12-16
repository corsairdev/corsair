/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { minimal_repository } from './minimal_repository';
/**
 * Thread
 */
export type thread = {
    id: string;
    repository: minimal_repository;
    subject: {
        title: string;
        url: string;
        latest_comment_url: string;
        type: string;
    };
    reason: string;
    unread: boolean;
    updated_at: string;
    last_read_at: string | null;
    url: string;
    subscription_url: string;
};

