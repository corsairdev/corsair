import type { pull_request } from '../models/pull_request';
import type { pull_request_review } from '../models/pull_request_review';
import type { pull_request_simple } from '../models/pull_request_simple';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PullsService {
    public static pullsList(
        owner: string,
        repo: string,
        state: 'open' | 'closed' | 'all' = 'open',
        head?: string,
        base?: string,
        sort: 'created' | 'updated' | 'popularity' | 'long-running' = 'created',
        direction?: 'asc' | 'desc',
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<pull_request_simple>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/pulls',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'state': state,
                'head': head,
                'base': base,
                'sort': sort,
                'direction': direction,
                'per_page': perPage,
                'page': page,
            },
            errors: {
                304: `Not modified`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }

    public static pullsGet(
        owner: string,
        repo: string,
        pullNumber: number,
    ): CancelablePromise<pull_request> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/pulls/{pull_number}',
            path: {
                'owner': owner,
                'repo': repo,
                'pull_number': pullNumber,
            },
            errors: {
                304: `Not modified`,
                404: `Resource not found`,
                406: `Unacceptable`,
                500: `Internal Error`,
                503: `Service unavailable`,
            },
        });
    }

    public static pullsListReviews(
        owner: string,
        repo: string,
        pullNumber: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<pull_request_review>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/pulls/{pull_number}/reviews',
            path: {
                'owner': owner,
                'repo': repo,
                'pull_number': pullNumber,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }

    public static pullsCreateReview(
        owner: string,
        repo: string,
        pullNumber: number,
        requestBody?: {
            commit_id?: string;
            body?: string;
            event?: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT';
            comments?: Array<{
                path: string;
                position?: number;
                body: string;
                line?: number;
                side?: string;
                start_line?: number;
                start_side?: string;
            }>;
        },
    ): CancelablePromise<pull_request_review> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/pulls/{pull_number}/reviews',
            path: {
                'owner': owner,
                'repo': repo,
                'pull_number': pullNumber,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }

    public static pullsGetReview(
        owner: string,
        repo: string,
        pullNumber: number,
        reviewId: number,
    ): CancelablePromise<pull_request_review> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'pull_number': pullNumber,
                'review_id': reviewId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }

    public static pullsUpdateReview(
        owner: string,
        repo: string,
        pullNumber: number,
        reviewId: number,
        requestBody: {
            body: string;
        },
    ): CancelablePromise<pull_request_review> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'pull_number': pullNumber,
                'review_id': reviewId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
}
