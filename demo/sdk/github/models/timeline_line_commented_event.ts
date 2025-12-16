/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { pull_request_review_comment } from './pull_request_review_comment';
/**
 * Timeline Line Commented Event
 */
export type timeline_line_commented_event = {
    event?: string;
    node_id?: string;
    comments?: Array<pull_request_review_comment>;
};

