import type { workflow } from '../models/workflow';
import type { workflow_run } from '../models/workflow_run';
import type { workflow_usage } from '../models/workflow_usage';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ActionsService {
    public static actionsListWorkflowRunsForRepo(
        owner: string,
        repo: string,
        actor?: string,
        branch?: string,
        event?: string,
        status?: 'completed' | 'action_required' | 'cancelled' | 'failure' | 'neutral' | 'skipped' | 'stale' | 'success' | 'timed_out' | 'in_progress' | 'queued' | 'requested' | 'waiting' | 'pending',
        perPage: number = 30,
        page: number = 1,
        created?: string,
        excludePullRequests: boolean = false,
        checkSuiteId?: number,
        headSha?: string,
    ): CancelablePromise<{
        total_count: number;
        workflow_runs: Array<workflow_run>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/runs',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'actor': actor,
                'branch': branch,
                'event': event,
                'status': status,
                'per_page': perPage,
                'page': page,
                'created': created,
                'exclude_pull_requests': excludePullRequests,
                'check_suite_id': checkSuiteId,
                'head_sha': headSha,
            },
        });
    }

    public static actionsListRepoWorkflows(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<{
        total_count: number;
        workflows: Array<workflow>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/workflows',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }

    public static actionsGetWorkflow(
        owner: string,
        repo: string,
        workflowId: (number | string),
    ): CancelablePromise<workflow> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/workflows/{workflow_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'workflow_id': workflowId,
            },
        });
    }

    public static actionsDisableWorkflow(
        owner: string,
        repo: string,
        workflowId: (number | string),
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable',
            path: {
                'owner': owner,
                'repo': repo,
                'workflow_id': workflowId,
            },
        });
    }

    public static actionsCreateWorkflowDispatch(
        owner: string,
        repo: string,
        workflowId: (number | string),
        requestBody: {
            ref: string;
            inputs?: Record<string, any>;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
            path: {
                'owner': owner,
                'repo': repo,
                'workflow_id': workflowId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    public static actionsEnableWorkflow(
        owner: string,
        repo: string,
        workflowId: (number | string),
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable',
            path: {
                'owner': owner,
                'repo': repo,
                'workflow_id': workflowId,
            },
        });
    }

    public static actionsGetWorkflowUsage(
        owner: string,
        repo: string,
        workflowId: (number | string),
    ): CancelablePromise<workflow_usage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing',
            path: {
                'owner': owner,
                'repo': repo,
                'workflow_id': workflowId,
            },
        });
    }
}
