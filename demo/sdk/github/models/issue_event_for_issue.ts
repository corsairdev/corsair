/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { added_to_project_issue_event } from './added_to_project_issue_event';
import type { assigned_issue_event } from './assigned_issue_event';
import type { converted_note_to_issue_issue_event } from './converted_note_to_issue_issue_event';
import type { demilestoned_issue_event } from './demilestoned_issue_event';
import type { labeled_issue_event } from './labeled_issue_event';
import type { locked_issue_event } from './locked_issue_event';
import type { milestoned_issue_event } from './milestoned_issue_event';
import type { moved_column_in_project_issue_event } from './moved_column_in_project_issue_event';
import type { removed_from_project_issue_event } from './removed_from_project_issue_event';
import type { renamed_issue_event } from './renamed_issue_event';
import type { review_dismissed_issue_event } from './review_dismissed_issue_event';
import type { review_request_removed_issue_event } from './review_request_removed_issue_event';
import type { review_requested_issue_event } from './review_requested_issue_event';
import type { unassigned_issue_event } from './unassigned_issue_event';
import type { unlabeled_issue_event } from './unlabeled_issue_event';
/**
 * Issue Event for Issue
 */
export type issue_event_for_issue = (labeled_issue_event | unlabeled_issue_event | assigned_issue_event | unassigned_issue_event | milestoned_issue_event | demilestoned_issue_event | renamed_issue_event | review_requested_issue_event | review_request_removed_issue_event | review_dismissed_issue_event | locked_issue_event | added_to_project_issue_event | moved_column_in_project_issue_event | removed_from_project_issue_event | converted_note_to_issue_issue_event);

