/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { nullable_simple_user } from './nullable_simple_user';
/**
 * Page Build
 */
export type page_build = {
    url: string;
    status: string;
    error: {
        message: string | null;
    };
    pusher: nullable_simple_user;
    commit: string;
    duration: number;
    created_at: string;
    updated_at: string;
};

