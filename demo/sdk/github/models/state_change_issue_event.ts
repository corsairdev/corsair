/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { nullable_integration } from './nullable_integration';
import type { simple_user } from './simple_user';
/**
 * State Change Issue Event
 */
export type state_change_issue_event = {
    id: number;
    node_id: string;
    url: string;
    actor: simple_user;
    event: string;
    commit_id: string | null;
    commit_url: string | null;
    created_at: string;
    performed_via_github_app: nullable_integration;
    state_reason?: string | null;
};

