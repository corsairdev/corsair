/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * API Insights usage route stats for an actor
 */
export type api_insights_route_stats = Array<{
    /**
     * The HTTP method
     */
    http_method?: string;
    /**
     * The API path's route template
     */
    api_route?: string;
    /**
     * The total number of requests within the queried time period
     */
    total_request_count?: number;
    /**
     * The total number of requests that were rate limited within the queried time period
     */
    rate_limited_request_count?: number;
    last_rate_limited_timestamp?: string | null;
    last_request_timestamp?: string;
}>;
