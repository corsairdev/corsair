/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { added_to_project_issue_event } from './added_to_project_issue_event';
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
import type { state_change_issue_event } from './state_change_issue_event';
import type { timeline_assigned_issue_event } from './timeline_assigned_issue_event';
import type { timeline_comment_event } from './timeline_comment_event';
import type { timeline_commit_commented_event } from './timeline_commit_commented_event';
import type { timeline_committed_event } from './timeline_committed_event';
import type { timeline_cross_referenced_event } from './timeline_cross_referenced_event';
import type { timeline_line_commented_event } from './timeline_line_commented_event';
import type { timeline_reviewed_event } from './timeline_reviewed_event';
import type { timeline_unassigned_issue_event } from './timeline_unassigned_issue_event';
import type { unlabeled_issue_event } from './unlabeled_issue_event';
/**
 * Timeline Event
 */
export type timeline_issue_events = (labeled_issue_event | unlabeled_issue_event | milestoned_issue_event | demilestoned_issue_event | renamed_issue_event | review_requested_issue_event | review_request_removed_issue_event | review_dismissed_issue_event | locked_issue_event | added_to_project_issue_event | moved_column_in_project_issue_event | removed_from_project_issue_event | converted_note_to_issue_issue_event | timeline_comment_event | timeline_cross_referenced_event | timeline_committed_event | timeline_reviewed_event | timeline_line_commented_event | timeline_commit_commented_event | timeline_assigned_issue_event | timeline_unassigned_issue_event | state_change_issue_event);

