/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Information of a job execution in a workflow run
 */
export type job = {
    /**
     * The id of the job.
     */
    id: number;
    /**
     * The id of the associated workflow run.
     */
    run_id: number;
    run_url: string;
    /**
     * Attempt number of the associated workflow run, 1 for first attempt and higher if the workflow was re-run.
     */
    run_attempt?: number;
    node_id: string;
    /**
     * The SHA of the commit that is being run.
     */
    head_sha: string;
    url: string;
    html_url: string | null;
    /**
     * The phase of the lifecycle that the job is currently in.
     */
    status: job.status;
    /**
     * The outcome of the job.
     */
    conclusion: job.conclusion | null;
    /**
     * The time that the job created, in ISO 8601 format.
     */
    created_at: string;
    /**
     * The time that the job started, in ISO 8601 format.
     */
    started_at: string;
    /**
     * The time that the job finished, in ISO 8601 format.
     */
    completed_at: string | null;
    /**
     * The name of the job.
     */
    name: string;
    /**
     * Steps in this job.
     */
    steps?: Array<{
        /**
         * The phase of the lifecycle that the job is currently in.
         */
        status: 'queued' | 'in_progress' | 'completed';
        /**
         * The outcome of the job.
         */
        conclusion: string | null;
        /**
         * The name of the job.
         */
        name: string;
        number: number;
        /**
         * The time that the step started, in ISO 8601 format.
         */
        started_at?: string | null;
        /**
         * The time that the job finished, in ISO 8601 format.
         */
        completed_at?: string | null;
    }>;
    check_run_url: string;
    /**
     * Labels for the workflow job. Specified by the "runs_on" attribute in the action's workflow file.
     */
    labels: Array<string>;
    /**
     * The ID of the runner to which this job has been assigned. (If a runner hasn't yet been assigned, this will be null.)
     */
    runner_id: number | null;
    /**
     * The name of the runner to which this job has been assigned. (If a runner hasn't yet been assigned, this will be null.)
     */
    runner_name: string | null;
    /**
     * The ID of the runner group to which this job has been assigned. (If a runner hasn't yet been assigned, this will be null.)
     */
    runner_group_id: number | null;
    /**
     * The name of the runner group to which this job has been assigned. (If a runner hasn't yet been assigned, this will be null.)
     */
    runner_group_name: string | null;
    /**
     * The name of the workflow.
     */
    workflow_name: string | null;
    /**
     * The name of the current branch.
     */
    head_branch: string | null;
};
export namespace job {
    /**
     * The phase of the lifecycle that the job is currently in.
     */
    export enum status {
        QUEUED = 'queued',
        IN_PROGRESS = 'in_progress',
        COMPLETED = 'completed',
        WAITING = 'waiting',
        REQUESTED = 'requested',
        PENDING = 'pending',
    }
    /**
     * The outcome of the job.
     */
    export enum conclusion {
        SUCCESS = 'success',
        FAILURE = 'failure',
        NEUTRAL = 'neutral',
        CANCELLED = 'cancelled',
        SKIPPED = 'skipped',
        TIMED_OUT = 'timed_out',
        ACTION_REQUIRED = 'action_required',
    }
}

