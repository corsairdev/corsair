/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { author_association } from './author_association';
import type { issue_event_dismissed_review } from './issue_event_dismissed_review';
import type { issue_event_label } from './issue_event_label';
import type { issue_event_milestone } from './issue_event_milestone';
import type { issue_event_project_card } from './issue_event_project_card';
import type { issue_event_rename } from './issue_event_rename';
import type { nullable_integration } from './nullable_integration';
import type { nullable_issue } from './nullable_issue';
import type { nullable_simple_user } from './nullable_simple_user';
import type { team } from './team';
/**
 * Issue Event
 */
export type issue_event = {
    id: number;
    node_id: string;
    url: string;
    actor: nullable_simple_user;
    event: string;
    commit_id: string | null;
    commit_url: string | null;
    created_at: string;
    issue?: nullable_issue;
    label?: issue_event_label;
    assignee?: nullable_simple_user;
    assigner?: nullable_simple_user;
    review_requester?: nullable_simple_user;
    requested_reviewer?: nullable_simple_user;
    requested_team?: team;
    dismissed_review?: issue_event_dismissed_review;
    milestone?: issue_event_milestone;
    project_card?: issue_event_project_card;
    rename?: issue_event_rename;
    author_association?: author_association;
    lock_reason?: string | null;
    performed_via_github_app?: nullable_integration;
};

