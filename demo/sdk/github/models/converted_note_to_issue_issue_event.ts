/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { integration } from './integration';
import type { simple_user } from './simple_user';
/**
 * Converted Note to Issue Issue Event
 */
export type converted_note_to_issue_issue_event = {
    id: number;
    node_id: string;
    url: string;
    actor: simple_user;
    event: string;
    commit_id: string | null;
    commit_url: string | null;
    created_at: string;
    performed_via_github_app: integration;
    project_card?: {
        id: number;
        url: string;
        project_id: number;
        project_url: string;
        column_name: string;
        previous_column_name?: string;
    };
};

