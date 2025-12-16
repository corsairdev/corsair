/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * API Insights usage subject stats for an organization
 */
export type api_insights_subject_stats = Array<{
    subject_type?: string;
    subject_name?: string;
    subject_id?: number;
    total_request_count?: number;
    rate_limited_request_count?: number;
    last_rate_limited_timestamp?: string | null;
    last_request_timestamp?: string;
}>;
