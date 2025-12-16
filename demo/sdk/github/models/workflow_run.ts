/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { minimal_repository } from './minimal_repository';
import type { nullable_simple_commit } from './nullable_simple_commit';
import type { pull_request_minimal } from './pull_request_minimal';
import type { referenced_workflow } from './referenced_workflow';
import type { simple_user } from './simple_user';
/**
 * An invocation of a workflow
 */
export type workflow_run = {
    /**
     * The ID of the workflow run.
     */
    id: number;
    /**
     * The name of the workflow run.
     */
    name?: string | null;
    node_id: string;
    /**
     * The ID of the associated check suite.
     */
    check_suite_id?: number;
    /**
     * The node ID of the associated check suite.
     */
    check_suite_node_id?: string;
    head_branch: string | null;
    /**
     * The SHA of the head commit that points to the version of the workflow being run.
     */
    head_sha: string;
    /**
     * The full path of the workflow
     */
    path: string;
    /**
     * The auto incrementing run number for the workflow run.
     */
    run_number: number;
    /**
     * Attempt number of the run, 1 for first attempt and higher if the workflow was re-run.
     */
    run_attempt?: number;
    referenced_workflows?: Array<referenced_workflow> | null;
    event: string;
    status: string | null;
    conclusion: string | null;
    /**
     * The ID of the parent workflow.
     */
    workflow_id: number;
    /**
     * The URL to the workflow run.
     */
    url: string;
    html_url: string;
    /**
     * Pull requests that are open with a `head_sha` or `head_branch` that matches the workflow run. The returned pull requests do not necessarily indicate pull requests that triggered the run.
     */
    pull_requests: Array<pull_request_minimal> | null;
    created_at: string;
    updated_at: string;
    actor?: simple_user;
    triggering_actor?: simple_user;
    /**
     * The start time of the latest run. Resets on re-run.
     */
    run_started_at?: string;
    /**
     * The URL to the jobs for the workflow run.
     */
    jobs_url: string;
    /**
     * The URL to download the logs for the workflow run.
     */
    logs_url: string;
    /**
     * The URL to the associated check suite.
     */
    check_suite_url: string;
    /**
     * The URL to the artifacts for the workflow run.
     */
    artifacts_url: string;
    /**
     * The URL to cancel the workflow run.
     */
    cancel_url: string;
    /**
     * The URL to rerun the workflow run.
     */
    rerun_url: string;
    /**
     * The URL to the previous attempted run of this workflow, if one exists.
     */
    previous_attempt_url?: string | null;
    /**
     * The URL to the workflow.
     */
    workflow_url: string;
    head_commit: nullable_simple_commit;
    repository: minimal_repository;
    head_repository: minimal_repository;
    head_repository_id?: number;
    /**
     * The event-specific title associated with the run or the run-name if set, or the value of `run-name` if it is set in the workflow.
     */
    display_title: string;
};

