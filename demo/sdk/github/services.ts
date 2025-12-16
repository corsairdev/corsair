import type {
    api_overview,
    code_frequency_stat,
    commit,
    content_directory,
    content_file,
    content_submodule,
    content_symlink,
    content_traffic,
    file_commit,
    full_repository,
    issue,
    issue_comment,
    minimal_repository,
    organization_full,
    private_user,
    public_user,
    pull_request,
    pull_request_review,
    pull_request_simple,
    referrer_traffic,
    release,
    repository,
    root,
    short_branch,
    simple_user,
    workflow,
    workflow_run,
    workflow_usage,
} from './models';
import type { CancelablePromise } from './core/CancelablePromise';
import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';

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

export class MetaService {
    public static metaRoot(): CancelablePromise<root> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }

    public static metaGet(): CancelablePromise<api_overview> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/meta',
            errors: {
                304: `Not modified`,
            },
        });
    }

    public static metaGetOctocat(
        s?: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/octocat',
            query: {
                's': s,
            },
        });
    }

    public static metaGetZen(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/zen',
        });
    }
}

export class OrgsService {
    public static orgsGet(
        org: string,
    ): CancelablePromise<organization_full> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}',
            path: {
                'org': org,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }

    public static orgsListPublicMembers(
        org: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<simple_user>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/public_members',
            path: {
                'org': org,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }
}

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

export class ReposService {
    public static reposListForOrg(
        org: string,
        type: 'all' | 'public' | 'private' | 'forks' | 'sources' | 'member' = 'all',
        sort: 'created' | 'updated' | 'pushed' | 'full_name' = 'created',
        direction?: 'asc' | 'desc',
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<minimal_repository>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/repos',
            path: {
                'org': org,
            },
            query: {
                'type': type,
                'sort': sort,
                'direction': direction,
                'per_page': perPage,
                'page': page,
            },
        });
    }

    public static reposGet(
        owner: string,
        repo: string,
    ): CancelablePromise<full_repository> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                301: `Moved permanently`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }

    public static reposListBranches(
        owner: string,
        repo: string,
        _protected?: boolean,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<short_branch>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/branches',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'protected': _protected,
                'per_page': perPage,
                'page': page,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }

    public static reposListCommits(
        owner: string,
        repo: string,
        sha?: string,
        path?: string,
        author?: string,
        committer?: string,
        since?: string,
        until?: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<commit>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/commits',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'sha': sha,
                'path': path,
                'author': author,
                'committer': committer,
                'since': since,
                'until': until,
                'per_page': perPage,
                'page': page,
            },
            errors: {
                400: `Bad Request`,
                404: `Resource not found`,
                409: `Conflict`,
                500: `Internal Error`,
            },
        });
    }

    public static reposGetContent(
        owner: string,
        repo: string,
        path: string,
        ref?: string,
    ): CancelablePromise<(content_directory | content_file | content_symlink | content_submodule)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/contents/{path}',
            path: {
                'owner': owner,
                'repo': repo,
                'path': path,
            },
            query: {
                'ref': ref,
            },
            errors: {
                302: `Found`,
                304: `Not modified`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }

    public static reposCreateOrUpdateFileContents(
        owner: string,
        repo: string,
        path: string,
        requestBody: {
            message: string;
            content: string;
            sha?: string;
            branch?: string;
            committer?: {
                name: string;
                email: string;
                date?: string;
            };
            author?: {
                name: string;
                email: string;
                date?: string;
            };
        },
    ): CancelablePromise<file_commit> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/contents/{path}',
            path: {
                'owner': owner,
                'repo': repo,
                'path': path,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Resource not found`,
                409: `Conflict`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }

    public static reposDeleteFile(
        owner: string,
        repo: string,
        path: string,
        requestBody: {
            message: string;
            sha: string;
            branch?: string;
            committer?: {
                name?: string;
                email?: string;
            };
            author?: {
                name?: string;
                email?: string;
            };
        },
    ): CancelablePromise<file_commit> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/contents/{path}',
            path: {
                'owner': owner,
                'repo': repo,
                'path': path,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Resource not found`,
                409: `Conflict`,
                422: `Validation failed, or the endpoint has been spammed.`,
                503: `Service unavailable`,
            },
        });
    }

    public static reposGetReadme(
        owner: string,
        repo: string,
        ref?: string,
    ): CancelablePromise<content_file> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/readme',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'ref': ref,
            },
            errors: {
                304: `Not modified`,
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }

    public static reposListReleases(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<release>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/releases',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }

    public static reposCreateRelease(
        owner: string,
        repo: string,
        requestBody: {
            tag_name: string;
            target_commitish?: string;
            name?: string;
            body?: string;
            draft?: boolean;
            prerelease?: boolean;
            discussion_category_name?: string;
            generate_release_notes?: boolean;
            make_latest?: 'true' | 'false' | 'legacy';
        },
    ): CancelablePromise<release> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/releases',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not Found if the discussion category name is invalid`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }

    public static reposGetReleaseByTag(
        owner: string,
        repo: string,
        tag: string,
    ): CancelablePromise<release> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/releases/tags/{tag}',
            path: {
                'owner': owner,
                'repo': repo,
                'tag': tag,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }

    public static reposGetRelease(
        owner: string,
        repo: string,
        releaseId: number,
    ): CancelablePromise<release> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/releases/{release_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'release_id': releaseId,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }

    public static reposUpdateRelease(
        owner: string,
        repo: string,
        releaseId: number,
        requestBody?: {
            tag_name?: string;
            target_commitish?: string;
            name?: string;
            body?: string;
            draft?: boolean;
            prerelease?: boolean;
            make_latest?: 'true' | 'false' | 'legacy';
            discussion_category_name?: string;
        },
    ): CancelablePromise<release> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/repos/{owner}/{repo}/releases/{release_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'release_id': releaseId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not Found if the discussion category name is invalid`,
            },
        });
    }

    public static reposDeleteRelease(
        owner: string,
        repo: string,
        releaseId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/releases/{release_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'release_id': releaseId,
            },
        });
    }

    public static reposGetCodeFrequencyStats(
        owner: string,
        repo: string,
    ): CancelablePromise<Array<code_frequency_stat> | Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/stats/code_frequency',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                422: `Repository contains more than 10,000 commits`,
            },
        });
    }

    public static reposGetTopPaths(
        owner: string,
        repo: string,
    ): CancelablePromise<Array<content_traffic> | Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/traffic/popular/paths',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                403: `Forbidden`,
            },
        });
    }

    public static reposGetTopReferrers(
        owner: string,
        repo: string,
    ): CancelablePromise<Array<referrer_traffic> | Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/traffic/popular/referrers',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                403: `Forbidden`,
            },
        });
    }

    public static reposListForAuthenticatedUser(
        visibility: 'all' | 'public' | 'private' = 'all',
        affiliation: string = 'owner,collaborator,organization_member',
        type: 'all' | 'owner' | 'public' | 'private' | 'member' = 'all',
        sort: 'created' | 'updated' | 'pushed' | 'full_name' = 'full_name',
        direction?: 'asc' | 'desc',
        perPage: number = 30,
        page: number = 1,
        since?: string,
        before?: string,
    ): CancelablePromise<Array<repository>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/repos',
            query: {
                'visibility': visibility,
                'affiliation': affiliation,
                'type': type,
                'sort': sort,
                'direction': direction,
                'per_page': perPage,
                'page': page,
                'since': since,
                'before': before,
            },
            errors: {
                304: `Not modified`,
                401: `Requires authentication`,
                403: `Forbidden`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }

    public static reposListForUser(
        username: string,
        type: 'all' | 'owner' | 'member' = 'owner',
        sort: 'created' | 'updated' | 'pushed' | 'full_name' = 'full_name',
        direction?: 'asc' | 'desc',
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<minimal_repository>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{username}/repos',
            path: {
                'username': username,
            },
            query: {
                'type': type,
                'sort': sort,
                'direction': direction,
                'per_page': perPage,
                'page': page,
            },
        });
    }
}

export class UsersService {
    public static usersGetAuthenticated(): CancelablePromise<(private_user | public_user)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user',
            errors: {
                304: `Not modified`,
                401: `Requires authentication`,
                403: `Forbidden`,
            },
        });
    }

    public static usersList(
        since?: number,
        perPage: number = 30,
    ): CancelablePromise<Array<simple_user>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users',
            query: {
                'since': since,
                'per_page': perPage,
            },
            errors: {
                304: `Not modified`,
            },
        });
    }

    public static usersGetByUsername(
        username: string,
    ): CancelablePromise<(private_user | public_user)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{username}',
            path: {
                'username': username,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }

    public static usersListFollowersForUser(
        username: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<simple_user>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{username}/followers',
            path: {
                'username': username,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }

    public static usersListFollowingForUser(
        username: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<simple_user>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{username}/following',
            path: {
                'username': username,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }
}

