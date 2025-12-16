/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * API Insights usage stats for a user
 */
export type api_insights_user_stats = Array<{
    actor_type?: string;
    actor_name?: string;
    actor_id?: number;
    integration_id?: number | null;
    oauth_application_id?: number | null;
    total_request_count?: number;
    rate_limited_request_count?: number;
    last_rate_limited_timestamp?: string | null;
    last_request_timestamp?: string;
}>;
