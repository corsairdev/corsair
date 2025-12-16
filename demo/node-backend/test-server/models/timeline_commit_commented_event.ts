/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { commit_comment } from './commit_comment';
/**
 * Timeline Commit Commented Event
 */
export type timeline_commit_commented_event = {
    event?: string;
    node_id?: string;
    commit_id?: string;
    comments?: Array<commit_comment>;
};

