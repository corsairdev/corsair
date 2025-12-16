import type { issue } from '../models/issue';
import type { issue_comment } from '../models/issue_comment';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class IssuesService {
    public static issuesListForRepo(
        owner: string,
        repo: string,
        milestone?: string,
        state: 'open' | 'closed' | 'all' = 'open',
        assignee?: string,
        type?: string,
        creator?: string,
        mentioned?: string,
        labels?: string,
        sort: 'created' | 'updated' | 'comments' = 'created',
        direction: 'asc' | 'desc' = 'desc',
        since?: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<issue>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/issues',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'milestone': milestone,
                'state': state,
                'assignee': assignee,
                'type': type,
                'creator': creator,
                'mentioned': mentioned,
                'labels': labels,
                'sort': sort,
                'direction': direction,
                'since': since,
                'per_page': perPage,
                'page': page,
            },
            errors: {
                301: `Moved permanently`,
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }

    public static issuesCreate(
        owner: string,
        repo: string,
        requestBody: {
            title: (string | number);
            body?: string;
            assignee?: string | null;
            milestone?: (string | number) | null;
            labels?: Array<(string | {
                id?: number;
                name?: string;
                description?: string | null;
                color?: string | null;
            })>;
            assignees?: Array<string>;
            type?: string | null;
        },
    ): CancelablePromise<issue> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/issues',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                404: `Resource not found`,
                410: `Gone`,
                422: `Validation failed, or the endpoint has been spammed.`,
                503: `Service unavailable`,
            },
        });
    }

    public static issuesGet(
        owner: string,
        repo: string,
        issueNumber: number,
    ): CancelablePromise<issue> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/issues/{issue_number}',
            path: {
                'owner': owner,
                'repo': repo,
                'issue_number': issueNumber,
            },
            errors: {
                301: `Moved permanently`,
                304: `Not modified`,
                404: `Resource not found`,
                410: `Gone`,
            },
        });
    }

    public static issuesUpdate(
        owner: string,
        repo: string,
        issueNumber: number,
        requestBody?: {
            title?: (string | number) | null;
            body?: string | null;
            assignee?: string | null;
            state?: 'open' | 'closed';
            state_reason?: 'completed' | 'not_planned' | 'duplicate' | 'reopened' | null;
            milestone?: (string | number) | null;
            labels?: Array<(string | {
                id?: number;
                name?: string;
                description?: string | null;
                color?: string | null;
            })>;
            assignees?: Array<string>;
            type?: string | null;
        },
    ): CancelablePromise<issue> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/repos/{owner}/{repo}/issues/{issue_number}',
            path: {
                'owner': owner,
                'repo': repo,
                'issue_number': issueNumber,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                301: `Moved permanently`,
                403: `Forbidden`,
                404: `Resource not found`,
                410: `Gone`,
                422: `Validation failed, or the endpoint has been spammed.`,
                503: `Service unavailable`,
            },
        });
    }

    public static issuesCreateComment(
        owner: string,
        repo: string,
        issueNumber: number,
        requestBody: {
            body: string;
        },
    ): CancelablePromise<issue_comment> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/comments',
            path: {
                'owner': owner,
                'repo': repo,
                'issue_number': issueNumber,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
                410: `Gone`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }

    public static issuesLock(
        owner: string,
        repo: string,
        issueNumber: number,
        requestBody?: {
            lock_reason?: 'off-topic' | 'too heated' | 'resolved' | 'spam';
        } | null,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/lock',
            path: {
                'owner': owner,
                'repo': repo,
                'issue_number': issueNumber,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
                410: `Gone`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }

    public static issuesListForAuthenticatedUser(
        filter: 'assigned' | 'created' | 'mentioned' | 'subscribed' | 'repos' | 'all' = 'assigned',
        state: 'open' | 'closed' | 'all' = 'open',
        labels?: string,
        sort: 'created' | 'updated' | 'comments' = 'created',
        direction: 'asc' | 'desc' = 'desc',
        since?: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<issue>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/issues',
            query: {
                'filter': filter,
                'state': state,
                'labels': labels,
                'sort': sort,
                'direction': direction,
                'since': since,
                'per_page': perPage,
                'page': page,
            },
            errors: {
                304: `Not modified`,
                404: `Resource not found`,
            },
        });
    }
}
