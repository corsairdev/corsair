/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { integration } from './integration';
import type { simple_user } from './simple_user';
/**
 * Assigned Issue Event
 */
export type assigned_issue_event = {
    id: number;
    node_id: string;
    url: string;
    actor: simple_user;
    event: string;
    commit_id: string | null;
    commit_url: string | null;
    created_at: string;
    performed_via_github_app: integration;
    assignee: simple_user;
    assigner: simple_user;
};

