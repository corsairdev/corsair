/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { nullable_simple_user } from './nullable_simple_user';
/**
 * Contributor Activity
 */
export type contributor_activity = {
    author: nullable_simple_user;
    total: number;
    weeks: Array<{
        'w'?: number;
        'a'?: number;
        'd'?: number;
        'c'?: number;
    }>;
};

