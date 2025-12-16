/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { issue } from './issue';
import type { simple_user } from './simple_user';
/**
 * Timeline Cross Referenced Event
 */
export type timeline_cross_referenced_event = {
    event: string;
    actor?: simple_user;
    created_at: string;
    updated_at: string;
    source: {
        type?: string;
        issue?: issue;
    };
};

