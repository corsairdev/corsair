/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
    /**
     * List workflow runs for a repository
     * Lists all workflow runs for a repository. You can use parameters to narrow the list of results. For more information about using parameters, see [Parameters](https://docs.github.com/rest/guides/getting-started-with-the-rest-api#parameters).
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     *
     * This endpoint will return up to 1,000 results for each search when using the following parameters: `actor`, `branch`, `check_suite_id`, `created`, `event`, `head_sha`, `status`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param actor Returns someone's workflow runs. Use the login for the user who created the `push` associated with the check suite or workflow run.
     * @param branch Returns workflow runs associated with a branch. Use the name of the branch of the `push`.
     * @param event Returns workflow run triggered by the event you specify. For example, `push`, `pull_request` or `issue`. For more information, see "[Events that trigger workflows](https://docs.github.com/actions/automating-your-workflow-with-github-actions/events-that-trigger-workflows)."
     * @param status Returns workflow runs with the check run `status` or `conclusion` that you specify. For example, a conclusion can be `success` or a status can be `in_progress`. Only GitHub Actions can set a status of `waiting`, `pending`, or `requested`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param created Returns workflow runs created within the given date-time range. For more information on the syntax, see "[Understanding the search syntax](https://docs.github.com/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax#query-for-dates)."
     * @param excludePullRequests If `true` pull requests are omitted from the response (empty array).
     * @param checkSuiteId Returns workflow runs with the `check_suite_id` that you specify.
     * @param headSha Only returns workflow runs that are associated with the specified `head_sha`.
     * @returns any Response
     * @throws ApiError
     */
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

    /**
     * List repository workflows
     * Lists the workflows in a repository.
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
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

    /**
     * Get a workflow
     * Gets a specific workflow. You can replace `workflow_id` with the workflow
     * file name. For example, you could use `main.yaml`.
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param workflowId The ID of the workflow. You can also pass the workflow file name as a string.
     * @returns workflow Response
     * @throws ApiError
     */
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

    /**
     * Disable a workflow
     * Disables a workflow and sets the `state` of the workflow to `disabled_manually`. You can replace `workflow_id` with the workflow file name. For example, you could use `main.yaml`.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param workflowId The ID of the workflow. You can also pass the workflow file name as a string.
     * @returns void
     * @throws ApiError
     */
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

    /**
     * Create a workflow dispatch event
     * You can use this endpoint to manually trigger a GitHub Actions workflow run. You can replace `workflow_id` with the workflow file name. For example, you could use `main.yaml`.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param workflowId The ID of the workflow. You can also pass the workflow file name as a string.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
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

    /**
     * Enable a workflow
     * Enables a workflow and sets the `state` of the workflow to `active`. You can replace `workflow_id` with the workflow file name. For example, you could use `main.yaml`.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param workflowId The ID of the workflow. You can also pass the workflow file name as a string.
     * @returns void
     * @throws ApiError
     */
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

    /**
     * Get workflow usage
     * > [!WARNING]
     * > This endpoint is in the process of closing down. Refer to "[Actions Get workflow usage and Get workflow run usage endpoints closing down](https://github.blog/changelog/2025-02-02-actions-get-workflow-usage-and-get-workflow-run-usage-endpoints-closing-down/)" for more information.
     *
     * Gets the number of billable minutes used by a specific workflow during the current billing cycle.
     *
     * Anyone with read access to the repository can use this endpoint.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint with a private repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param workflowId The ID of the workflow. You can also pass the workflow file name as a string.
     * @returns workflow_usage Response
     * @throws ApiError
     */
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
    /**
     * List repository issues
     * List issues in a repository. Only open issues will be listed.
     *
     * > [!NOTE]
     * > GitHub's REST API considers every pull request an issue, but not every issue is a pull request. For this reason, "Issues" endpoints may return both issues and pull requests in the response. You can identify pull requests by the `pull_request` key. Be aware that the `id` of a pull request returned from "Issues" endpoints will be an _issue id_. To find out the pull request id, use the "[List pull requests](https://docs.github.com/rest/pulls/pulls#list-pull-requests)" endpoint.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param milestone If an `integer` is passed, it should refer to a milestone by its `number` field. If the string `*` is passed, issues with any milestone are accepted. If the string `none` is passed, issues without milestones are returned.
     * @param state Indicates the state of the issues to return.
     * @param assignee Can be the name of a user. Pass in `none` for issues with no assigned user, and `*` for issues assigned to any user.
     * @param type Can be the name of an issue type. If the string `*` is passed, issues with any type are accepted. If the string `none` is passed, issues without type are returned.
     * @param creator The user that created the issue.
     * @param mentioned A user that's mentioned in the issue.
     * @param labels A list of comma separated label names. Example: `bug,ui,@high`
     * @param sort What to sort results by.
     * @param direction The direction to sort the results by.
     * @param since Only show results that were last updated after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns issue Response
     * @throws ApiError
     */
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

    /**
     * Create an issue
     * Any user with pull access to a repository can create an issue. If [issues are disabled in the repository](https://docs.github.com/articles/disabling-issues/), the API returns a `410 Gone` status.
     *
     * This endpoint triggers [notifications](https://docs.github.com/github/managing-subscriptions-and-notifications-on-github/about-notifications). Creating content too quickly using this endpoint may result in secondary rate limiting. For more information, see "[Rate limits for the API](https://docs.github.com/rest/using-the-rest-api/rate-limits-for-the-rest-api#about-secondary-rate-limits)"
     * and "[Best practices for using the REST API](https://docs.github.com/rest/guides/best-practices-for-using-the-rest-api)."
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns issue Response
     * @throws ApiError
     */
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

    /**
     * Get an issue
     * The API returns a [`301 Moved Permanently` status](https://docs.github.com/rest/guides/best-practices-for-using-the-rest-api#follow-redirects) if the issue was
     * [transferred](https://docs.github.com/articles/transferring-an-issue-to-another-repository/) to another repository. If
     * the issue was transferred to or deleted from a repository where the authenticated user lacks read access, the API
     * returns a `404 Not Found` status. If the issue was deleted from a repository where the authenticated user has read
     * access, the API returns a `410 Gone` status. To receive webhook events for transferred and deleted issues, subscribe
     * to the [`issues`](https://docs.github.com/webhooks/event-payloads/#issues) webhook.
     *
     * > [!NOTE]
     * > GitHub's REST API considers every pull request an issue, but not every issue is a pull request. For this reason, "Issues" endpoints may return both issues and pull requests in the response. You can identify pull requests by the `pull_request` key. Be aware that the `id` of a pull request returned from "Issues" endpoints will be an _issue id_. To find out the pull request id, use the "[List pull requests](https://docs.github.com/rest/pulls/pulls#list-pull-requests)" endpoint.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param issueNumber The number that identifies the issue.
     * @returns issue Response
     * @throws ApiError
     */
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

    /**
     * Update an issue
     * Issue owners and users with push access or Triage role can edit an issue.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param issueNumber The number that identifies the issue.
     * @param requestBody
     * @returns issue Response
     * @throws ApiError
     */
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

    /**
     * Create an issue comment
     * You can use the REST API to create comments on issues and pull requests. Every pull request is an issue, but not every issue is a pull request.
     *
     * This endpoint triggers [notifications](https://docs.github.com/github/managing-subscriptions-and-notifications-on-github/about-notifications).
     * Creating content too quickly using this endpoint may result in secondary rate limiting.
     * For more information, see "[Rate limits for the API](https://docs.github.com/rest/using-the-rest-api/rate-limits-for-the-rest-api#about-secondary-rate-limits)"
     * and "[Best practices for using the REST API](https://docs.github.com/rest/guides/best-practices-for-using-the-rest-api)."
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param issueNumber The number that identifies the issue.
     * @param requestBody
     * @returns issue_comment Response
     * @throws ApiError
     */
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

    /**
     * Lock an issue
     * Users with push access can lock an issue or pull request's conversation.
     *
     * Note that, if you choose not to pass any parameters, you'll need to set `Content-Length` to zero when calling out to this endpoint. For more information, see "[HTTP method](https://docs.github.com/rest/guides/getting-started-with-the-rest-api#http-method)."
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param issueNumber The number that identifies the issue.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
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

    /**
     * List user account issues assigned to the authenticated user
     * List issues across owned and member repositories assigned to the authenticated user.
     *
     * > [!NOTE]
     * > GitHub's REST API considers every pull request an issue, but not every issue is a pull request. For this reason, "Issues" endpoints may return both issues and pull requests in the response. You can identify pull requests by the `pull_request` key. Be aware that the `id` of a pull request returned from "Issues" endpoints will be an _issue id_. To find out the pull request id, use the "[List pull requests](https://docs.github.com/rest/pulls/pulls#list-pull-requests)" endpoint.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param filter Indicates which sorts of issues to return. `assigned` means issues assigned to you. `created` means issues created by you. `mentioned` means issues mentioning you. `subscribed` means issues you're subscribed to updates for. `all` or `repos` means all issues you can see, regardless of participation or creation.
     * @param state Indicates the state of the issues to return.
     * @param labels A list of comma separated label names. Example: `bug,ui,@high`
     * @param sort What to sort results by.
     * @param direction The direction to sort the results by.
     * @param since Only show results that were last updated after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns issue Response
     * @throws ApiError
     */
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
    /**
     * GitHub API Root
     * Get Hypermedia links to resources accessible in GitHub's REST API
     * @returns root Response
     * @throws ApiError
     */
    public static metaRoot(): CancelablePromise<root> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }

    /**
     * Get GitHub meta information
     * Returns meta information about GitHub, including a list of GitHub's IP addresses. For more information, see "[About GitHub's IP addresses](https://docs.github.com/articles/about-github-s-ip-addresses/)."
     *
     * The API's response also includes a list of GitHub's domain names.
     *
     * The values shown in the documentation's response are example values. You must always query the API directly to get the latest values.
     *
     * > [!NOTE]
     * > This endpoint returns both IPv4 and IPv6 addresses. However, not all features support IPv6. You should refer to the specific documentation for each feature to determine if IPv6 is supported.
     * @returns api_overview Response
     * @throws ApiError
     */
    public static metaGet(): CancelablePromise<api_overview> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/meta',
            errors: {
                304: `Not modified`,
            },
        });
    }

    /**
     * Get Octocat
     * Get the octocat as ASCII art
     * @param s The words to show in Octocat's speech bubble
     * @returns string Response
     * @throws ApiError
     */
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

    /**
     * Get the Zen of GitHub
     * Get a random sentence from the Zen of GitHub
     * @returns string Response
     * @throws ApiError
     */
    public static metaGetZen(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/zen',
        });
    }
}

export class OrgsService {
    /**
     * Get an organization
     * Gets information about an organization.
     *
     * When the value of `two_factor_requirement_enabled` is `true`, the organization requires all members, billing managers, outside collaborators, guest collaborators, repository collaborators, or everyone with access to any repository within the organization to enable [two-factor authentication](https://docs.github.com/articles/securing-your-account-with-two-factor-authentication-2fa/).
     *
     * To see the full details about an organization, the authenticated user must be an organization owner.
     *
     * OAuth app tokens and personal access tokens (classic) need the `admin:org` scope to see the full details about an organization.
     *
     * To see information about an organization's GitHub plan, GitHub Apps need the `Organization plan` permission.
     * @param org The organization name. The name is not case sensitive.
     * @returns organization_full Response
     * @throws ApiError
     */
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

    /**
     * List public organization members
     * Members of an organization can choose to have their membership publicized or not.
     * @param org The organization name. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns simple_user Response
     * @throws ApiError
     */
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
    /**
     * List pull requests
     * Lists pull requests in a specified repository.
     *
     * Draft pull requests are available in public repositories with GitHub
     * Free and GitHub Free for organizations, GitHub Pro, and legacy per-repository billing
     * plans, and in public and private repositories with GitHub Team and GitHub Enterprise
     * Cloud. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products)
     * in the GitHub Help documentation.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param state Either `open`, `closed`, or `all` to filter by state.
     * @param head Filter pulls by head user or head organization and branch name in the format of `user:ref-name` or `organization:ref-name`. For example: `github:new-script-format` or `octocat:test-branch`.
     * @param base Filter pulls by base branch name. Example: `gh-pages`.
     * @param sort What to sort results by. `popularity` will sort by the number of comments. `long-running` will sort by date created and will limit the results to pull requests that have been open for more than a month and have had activity within the past month.
     * @param direction The direction of the sort. Default: `desc` when sort is `created` or sort is not specified, otherwise `asc`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns pull_request_simple Response
     * @throws ApiError
     */
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

    /**
     * Get a pull request
     * Draft pull requests are available in public repositories with GitHub Free and GitHub Free for organizations, GitHub Pro, and legacy per-repository billing plans, and in public and private repositories with GitHub Team and GitHub Enterprise Cloud. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * Lists details of a pull request by providing its number.
     *
     * When you get, [create](https://docs.github.com/rest/pulls/pulls/#create-a-pull-request), or [edit](https://docs.github.com/rest/pulls/pulls#update-a-pull-request) a pull request, GitHub creates a merge commit to test whether the pull request can be automatically merged into the base branch. This test commit is not added to the base branch or the head branch. You can review the status of the test commit using the `mergeable` key. For more information, see "[Checking mergeability of pull requests](https://docs.github.com/rest/guides/getting-started-with-the-git-database-api#checking-mergeability-of-pull-requests)".
     *
     * The value of the `mergeable` attribute can be `true`, `false`, or `null`. If the value is `null`, then GitHub has started a background job to compute the mergeability. After giving the job time to complete, resubmit the request. When the job finishes, you will see a non-`null` value for the `mergeable` attribute in the response. If `mergeable` is `true`, then `merge_commit_sha` will be the SHA of the _test_ merge commit.
     *
     * The value of the `merge_commit_sha` attribute changes depending on the state of the pull request. Before merging a pull request, the `merge_commit_sha` attribute holds the SHA of the _test_ merge commit. After merging a pull request, the `merge_commit_sha` attribute changes depending on how you merged the pull request:
     *
     * *   If merged as a [merge commit](https://docs.github.com/articles/about-merge-methods-on-github/), `merge_commit_sha` represents the SHA of the merge commit.
     * *   If merged via a [squash](https://docs.github.com/articles/about-merge-methods-on-github/#squashing-your-merge-commits), `merge_commit_sha` represents the SHA of the squashed commit on the base branch.
     * *   If [rebased](https://docs.github.com/articles/about-merge-methods-on-github/#rebasing-and-merging-your-commits), `merge_commit_sha` represents the commit that the base branch was updated to.
     *
     * Pass the appropriate [media type](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types) to fetch diff and patch formats.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * - **`application/vnd.github.diff`**: For more information, see "[git-diff](https://git-scm.com/docs/git-diff)" in the Git documentation. If a diff is corrupt, contact us through the [GitHub Support portal](https://support.github.com/). Include the repository name and pull request ID in your message.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param pullNumber The number that identifies the pull request.
     * @returns pull_request Pass the appropriate [media type](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types) to fetch diff and patch formats.
     * @throws ApiError
     */
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

    /**
     * List reviews for a pull request
     * Lists all reviews for a specified pull request. The list of reviews returns in chronological order.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github-commitcomment.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github-commitcomment.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github-commitcomment.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github-commitcomment.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param pullNumber The number that identifies the pull request.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns pull_request_review The list of reviews returns in chronological order.
     * @throws ApiError
     */
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

    /**
     * Create a review for a pull request
     * Creates a review on a specified pull request.
     *
     * This endpoint triggers [notifications](https://docs.github.com/github/managing-subscriptions-and-notifications-on-github/about-notifications). Creating content too quickly using this endpoint may result in secondary rate limiting. For more information, see "[Rate limits for the API](https://docs.github.com/rest/using-the-rest-api/rate-limits-for-the-rest-api#about-secondary-rate-limits)" and "[Best practices for using the REST API](https://docs.github.com/rest/guides/best-practices-for-using-the-rest-api)."
     *
     * Pull request reviews created in the `PENDING` state are not submitted and therefore do not include the `submitted_at` property in the response. To create a pending review for a pull request, leave the `event` parameter blank. For more information about submitting a `PENDING` review, see "[Submit a review for a pull request](https://docs.github.com/rest/pulls/reviews#submit-a-review-for-a-pull-request)."
     *
     * > [!NOTE]
     * > To comment on a specific line in a file, you need to first determine the position of that line in the diff. To see a pull request diff, add the `application/vnd.github.v3.diff` media type to the `Accept` header of a call to the [Get a pull request](https://docs.github.com/rest/pulls/pulls#get-a-pull-request) endpoint.
     *
     * The `position` value equals the number of lines down from the first "@@" hunk header in the file you want to add a comment. The line just below the "@@" line is position 1, the next line is position 2, and so on. The position in the diff continues to increase through lines of whitespace and additional hunks until the beginning of a new file.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github-commitcomment.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github-commitcomment.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github-commitcomment.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github-commitcomment.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param pullNumber The number that identifies the pull request.
     * @param requestBody
     * @returns pull_request_review Response
     * @throws ApiError
     */
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

    /**
     * Get a review for a pull request
     * Retrieves a pull request review by its ID.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github-commitcomment.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github-commitcomment.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github-commitcomment.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github-commitcomment.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param pullNumber The number that identifies the pull request.
     * @param reviewId The unique identifier of the review.
     * @returns pull_request_review Response
     * @throws ApiError
     */
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

    /**
     * Update a review for a pull request
     * Updates the contents of a specified review summary comment.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github-commitcomment.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github-commitcomment.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github-commitcomment.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github-commitcomment.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param pullNumber The number that identifies the pull request.
     * @param reviewId The unique identifier of the review.
     * @param requestBody
     * @returns pull_request_review Response
     * @throws ApiError
     */
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
    /**
     * List organization repositories
     * Lists repositories for the specified organization.
     *
     * > [!NOTE]
     * > In order to see the `security_and_analysis` block for a repository you must have admin permissions for the repository or be an owner or security manager for the organization that owns the repository. For more information, see "[Managing security managers in your organization](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/managing-security-managers-in-your-organization)."
     * @param org The organization name. The name is not case sensitive.
     * @param type Specifies the types of repositories you want returned.
     * @param sort The property to sort the results by.
     * @param direction The order to sort by. Default: `asc` when using `full_name`, otherwise `desc`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns minimal_repository Response
     * @throws ApiError
     */
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

    /**
     * Get a repository
     * The `parent` and `source` objects are present when the repository is a fork. `parent` is the repository this repository was forked from, `source` is the ultimate source for the network.
     *
     * > [!NOTE]
     * > - In order to see the `security_and_analysis` block for a repository you must have admin permissions for the repository or be an owner or security manager for the organization that owns the repository. For more information, see "[Managing security managers in your organization](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/managing-security-managers-in-your-organization)."
     * > - To view merge-related settings, you must have the `contents:read` and `contents:write` permissions.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns full_repository Response
     * @throws ApiError
     */
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

    /**
     * List branches
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param _protected Setting to `true` returns only branches protected by branch protections or rulesets. When set to `false`, only unprotected branches are returned. Omitting this parameter returns all branches.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns short_branch Response
     * @throws ApiError
     */
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

    /**
     * List commits
     * **Signature verification object**
     *
     * The response will include a `verification` object that describes the result of verifying the commit's signature. The following fields are included in the `verification` object:
     *
     * | Name | Type | Description |
     * | ---- | ---- | ----------- |
     * | `verified` | `boolean` | Indicates whether GitHub considers the signature in this commit to be verified. |
     * | `reason` | `string` | The reason for verified value. Possible values and their meanings are enumerated in table below. |
     * | `signature` | `string` | The signature that was extracted from the commit. |
     * | `payload` | `string` | The value that was signed. |
     * | `verified_at` | `string` | The date the signature was verified by GitHub. |
     *
     * These are the possible values for `reason` in the `verification` object:
     *
     * | Value | Description |
     * | ----- | ----------- |
     * | `expired_key` | The key that made the signature is expired. |
     * | `not_signing_key` | The "signing" flag is not among the usage flags in the GPG key that made the signature. |
     * | `gpgverify_error` | There was an error communicating with the signature verification service. |
     * | `gpgverify_unavailable` | The signature verification service is currently unavailable. |
     * | `unsigned` | The object does not include a signature. |
     * | `unknown_signature_type` | A non-PGP signature was found in the commit. |
     * | `no_user` | No user was associated with the `committer` email address in the commit. |
     * | `unverified_email` | The `committer` email address in the commit was associated with a user, but the email address is not verified on their account. |
     * | `bad_email` | The `committer` email address in the commit is not included in the identities of the PGP key that made the signature. |
     * | `unknown_key` | The key that made the signature has not been registered with any user's account. |
     * | `malformed_signature` | There was an error parsing the signature. |
     * | `invalid` | The signature could not be cryptographically verified using the key whose key-id was found in the signature. |
     * | `valid` | None of the above errors applied, so the signature is considered to be verified. |
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param sha SHA or branch to start listing commits from. Default: the repository's default branch (usually `main`).
     * @param path Only commits containing this file path will be returned.
     * @param author GitHub username or email address to use to filter by commit author.
     * @param committer GitHub username or email address to use to filter by commit committer.
     * @param since Only show results that were last updated after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`. Due to limitations of Git, timestamps must be between 1970-01-01 and 2099-12-31 (inclusive) or unexpected results may be returned.
     * @param until Only commits before this date will be returned. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`. Due to limitations of Git, timestamps must be between 1970-01-01 and 2099-12-31 (inclusive) or unexpected results may be returned.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns commit Response
     * @throws ApiError
     */
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

    /**
     * Get repository content
     * Gets the contents of a file or directory in a repository. Specify the file path or directory with the `path` parameter. If you omit the `path` parameter, you will receive the contents of the repository's root directory.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw file contents for files and symlinks.
     * - **`application/vnd.github.html+json`**: Returns the file contents in HTML. Markup languages are rendered to HTML using GitHub's open-source [Markup library](https://github.com/github/markup).
     * - **`application/vnd.github.object+json`**: Returns the contents in a consistent object format regardless of the content type. For example, instead of an array of objects for a directory, the response will be an object with an `entries` attribute containing the array of objects.
     *
     * If the content is a directory, the response will be an array of objects, one object for each item in the directory. When listing the contents of a directory, submodules have their "type" specified as "file". Logically, the value _should_ be "submodule". This behavior exists [for backwards compatibility purposes](https://git.io/v1YCW). In the next major version of the API, the type will be returned as "submodule".
     *
     * If the content is a symlink and the symlink's target is a normal file in the repository, then the API responds with the content of the file. Otherwise, the API responds with an object describing the symlink itself.
     *
     * If the content is a submodule, the `submodule_git_url` field identifies the location of the submodule repository, and the `sha` identifies a specific commit within the submodule repository. Git uses the given URL when cloning the submodule repository, and checks out the submodule at that specific commit. If the submodule repository is not hosted on github.com, the Git URLs (`git_url` and `_links["git"]`) and the github.com URLs (`html_url` and `_links["html"]`) will have null values.
     *
     * **Notes**:
     *
     * - To get a repository's contents recursively, you can [recursively get the tree](https://docs.github.com/rest/git/trees#get-a-tree).
     * - This API has an upper limit of 1,000 files for a directory. If you need to retrieve
     * more files, use the [Git Trees API](https://docs.github.com/rest/git/trees#get-a-tree).
     * - Download URLs expire and are meant to be used just once. To ensure the download URL does not expire, please use the contents API to obtain a fresh download URL for each download.
     * - If the requested file's size is:
     * - 1 MB or smaller: All features of this endpoint are supported.
     * - Between 1-100 MB: Only the `raw` or `object` custom media types are supported. Both will work as normal, except that when using the `object` media type, the `content` field will be an empty
     * string and the `encoding` field will be `"none"`. To get the contents of these larger files, use the `raw` media type.
     * - Greater than 100 MB: This endpoint is not supported.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param path path parameter
     * @param ref The name of the commit/branch/tag. Default: the repository's default branch.
     * @returns any Response
     * @throws ApiError
     */
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

    /**
     * Create or update file contents
     * Creates a new file or replaces an existing file in a repository.
     *
     * > [!NOTE]
     * > If you use this endpoint and the "[Delete a file](https://docs.github.com/rest/repos/contents/#delete-a-file)" endpoint in parallel, the concurrent requests will conflict and you will receive errors. You must use these endpoints serially instead.
     *
     * OAuth app tokens and personal access tokens (classic) need the `repo` scope to use this endpoint. The `workflow` scope is also required in order to modify files in the `.github/workflows` directory.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param path path parameter
     * @param requestBody
     * @returns file_commit Response
     * @throws ApiError
     */
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

    /**
     * Delete a file
     * Deletes a file in a repository.
     *
     * You can provide an additional `committer` parameter, which is an object containing information about the committer. Or, you can provide an `author` parameter, which is an object containing information about the author.
     *
     * The `author` section is optional and is filled in with the `committer` information if omitted. If the `committer` information is omitted, the authenticated user's information is used.
     *
     * You must provide values for both `name` and `email`, whether you choose to use `author` or `committer`. Otherwise, you'll receive a `422` status code.
     *
     * > [!NOTE]
     * > If you use this endpoint and the "[Create or update file contents](https://docs.github.com/rest/repos/contents/#create-or-update-file-contents)" endpoint in parallel, the concurrent requests will conflict and you will receive errors. You must use these endpoints serially instead.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param path path parameter
     * @param requestBody
     * @returns file_commit Response
     * @throws ApiError
     */
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

    /**
     * Get a repository README
     * Gets the preferred README for a repository.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw file contents. This is the default if you do not specify a media type.
     * - **`application/vnd.github.html+json`**: Returns the README in HTML. Markup languages are rendered to HTML using GitHub's open-source [Markup library](https://github.com/github/markup).
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param ref The name of the commit/branch/tag. Default: the repository's default branch.
     * @returns content_file Response
     * @throws ApiError
     */
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

    /**
     * List releases
     * This returns a list of releases, which does not include regular Git tags that have not been associated with a release. To get a list of Git tags, use the [Repository Tags API](https://docs.github.com/rest/repos/repos#list-repository-tags).
     *
     * Information about published releases are available to everyone. Only users with push access will receive listings for draft releases.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns release Response
     * @throws ApiError
     */
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

    /**
     * Create a release
     * Users with push access to the repository can create a release.
     *
     * This endpoint triggers [notifications](https://docs.github.com/github/managing-subscriptions-and-notifications-on-github/about-notifications). Creating content too quickly using this endpoint may result in secondary rate limiting. For more information, see "[Rate limits for the API](https://docs.github.com/rest/using-the-rest-api/rate-limits-for-the-rest-api#about-secondary-rate-limits)" and "[Best practices for using the REST API](https://docs.github.com/rest/guides/best-practices-for-using-the-rest-api)."
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns release Response
     * @throws ApiError
     */
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

    /**
     * Get a release by tag name
     * Get a published release with the specified tag.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param tag tag parameter
     * @returns release Response
     * @throws ApiError
     */
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

    /**
     * Get a release
     * Gets a public release with the specified release ID.
     *
     * > [!NOTE]
     * > This returns an `upload_url` key corresponding to the endpoint for uploading release assets. This key is a hypermedia resource. For more information, see "[Getting started with the REST API](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#hypermedia)."
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param releaseId The unique identifier of the release.
     * @returns release **Note:** This returns an `upload_url` key corresponding to the endpoint for uploading release assets. This key is a hypermedia resource. For more information, see "[Getting started with the REST API](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#hypermedia)."
     * @throws ApiError
     */
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

    /**
     * Update a release
     * Users with push access to the repository can edit a release.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param releaseId The unique identifier of the release.
     * @param requestBody
     * @returns release Response
     * @throws ApiError
     */
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

    /**
     * Delete a release
     * Users with push access to the repository can delete a release.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param releaseId The unique identifier of the release.
     * @returns void
     * @throws ApiError
     */
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

    /**
     * Get the weekly commit activity
     * Returns a weekly aggregate of the number of additions and deletions pushed to a repository.
     *
     * > [!NOTE]
     * > This endpoint can only be used for repositories with fewer than 10,000 commits. If the repository contains 10,000 or more commits, a 422 status code will be returned.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns code_frequency_stat Returns a weekly aggregate of the number of additions and deletions pushed to a repository.
     * @throws ApiError
     */
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

    /**
     * Get top referral paths
     * Get the top 10 popular contents over the last 14 days.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns content_traffic Response
     * @throws ApiError
     */
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

    /**
     * Get top referral sources
     * Get the top 10 referrers over the last 14 days.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns referrer_traffic Response
     * @throws ApiError
     */
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

    /**
     * List repositories for the authenticated user
     * Lists repositories that the authenticated user has explicit permission (`:read`, `:write`, or `:admin`) to access.
     *
     * The authenticated user has explicit permission to access repositories they own, repositories where they are a collaborator, and repositories that they can access through an organization membership.
     * @param visibility Limit results to repositories with the specified visibility.
     * @param affiliation Comma-separated list of values. Can include: * `owner`: Repositories that are owned by the authenticated user. * `collaborator`: Repositories that the user has been added to as a collaborator. * `organization_member`: Repositories that the user has access to through being a member of an organization. This includes every repository on every team that the user is on.
     * @param type Limit results to repositories of the specified type. Will cause a `422` error if used in the same request as **visibility** or **affiliation**.
     * @param sort The property to sort the results by.
     * @param direction The order to sort by. Default: `asc` when using `full_name`, otherwise `desc`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param since Only show repositories updated after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param before Only show repositories updated before the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @returns repository Response
     * @throws ApiError
     */
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

    /**
     * List repositories for a user
     * Lists public repositories for the specified user.
     * @param username The handle for the GitHub user account.
     * @param type Limit results to repositories of the specified type.
     * @param sort The property to sort the results by.
     * @param direction The order to sort by. Default: `asc` when using `full_name`, otherwise `desc`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns minimal_repository Response
     * @throws ApiError
     */
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
    /**
     * Get the authenticated user
     * OAuth app tokens and personal access tokens (classic) need the `user` scope in order for the response to include private profile information.
     * @returns any Response
     * @throws ApiError
     */
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

    /**
     * List users
     * Lists all users, in the order that they signed up on GitHub. This list includes personal user accounts and organization accounts.
     *
     * Note: Pagination is powered exclusively by the `since` parameter. Use the [Link header](https://docs.github.com/rest/guides/using-pagination-in-the-rest-api#using-link-headers) to get the URL for the next page of users.
     * @param since A user ID. Only return users with an ID greater than this ID.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns simple_user Response
     * @throws ApiError
     */
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

    /**
     * Get a user
     * Provides publicly available information about someone with a GitHub account.
     *
     * If you are requesting information about an [Enterprise Managed User](https://docs.github.com/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/about-enterprise-managed-users), or a GitHub App bot that is installed in an organization that uses Enterprise Managed Users, your requests must be authenticated as a user or GitHub App that has access to the organization to view that account's information. If you are not authorized, the request will return a `404 Not Found` status.
     *
     * The `email` key in the following response is the publicly visible email address from your GitHub [profile page](https://github.com/settings/profile). When setting up your profile, you can select a primary email address to be public which provides an email entry for this endpoint. If you do not set a public email address for `email`, then it will have a value of `null`. You only see publicly visible email addresses when authenticated with GitHub. For more information, see [Authentication](https://docs.github.com/rest/guides/getting-started-with-the-rest-api#authentication).
     *
     * The Emails API enables you to list all of your email addresses, and toggle a primary email to be visible publicly. For more information, see [Emails API](https://docs.github.com/rest/users/emails).
     * @param username The handle for the GitHub user account.
     * @returns any Response
     * @throws ApiError
     */
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

    /**
     * List followers of a user
     * Lists the people following the specified user.
     * @param username The handle for the GitHub user account.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns simple_user Response
     * @throws ApiError
     */
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

    /**
     * List the people a user follows
     * Lists the people who the specified user follows.
     * @param username The handle for the GitHub user account.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns simple_user Response
     * @throws ApiError
     */
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

