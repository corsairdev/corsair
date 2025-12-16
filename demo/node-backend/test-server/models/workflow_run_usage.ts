/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Workflow Run Usage
 */
export type workflow_run_usage = {
    billable: {
        UBUNTU?: {
            total_ms: number;
            jobs: number;
            job_runs?: Array<{
                job_id: number;
                duration_ms: number;
            }>;
        };
        MACOS?: {
            total_ms: number;
            jobs: number;
            job_runs?: Array<{
                job_id: number;
                duration_ms: number;
            }>;
        };
        WINDOWS?: {
            total_ms: number;
            jobs: number;
            job_runs?: Array<{
                job_id: number;
                duration_ms: number;
            }>;
        };
    };
    run_duration_ms?: number;
};

