/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { issue } from '../models/issue';
import type { issue_comment } from '../models/issue_comment';
import type { issue_event } from '../models/issue_event';
import type { issue_event_for_issue } from '../models/issue_event_for_issue';
import type { label } from '../models/label';
import type { milestone } from '../models/milestone';
import type { simple_user } from '../models/simple_user';
import type { timeline_issue_events } from '../models/timeline_issue_events';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class IssuesService {
    /**
     * List issues assigned to the authenticated user
     * List issues assigned to the authenticated user across all visible repositories including owned repositories, member
     * repositories, and organization repositories. You can use the `filter` query parameter to fetch issues that are not
     * necessarily assigned to you.
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
     * @param collab
     * @param orgs
     * @param owned
     * @param pulls
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns issue Response
     * @throws ApiError
     */
    public static issuesList(
        filter: 'assigned' | 'created' | 'mentioned' | 'subscribed' | 'repos' | 'all' = 'assigned',
        state: 'open' | 'closed' | 'all' = 'open',
        labels?: string,
        sort: 'created' | 'updated' | 'comments' = 'created',
        direction: 'asc' | 'desc' = 'desc',
        since?: string,
        collab?: boolean,
        orgs?: boolean,
        owned?: boolean,
        pulls?: boolean,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<issue>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/issues',
            query: {
                'filter': filter,
                'state': state,
                'labels': labels,
                'sort': sort,
                'direction': direction,
                'since': since,
                'collab': collab,
                'orgs': orgs,
                'owned': owned,
                'pulls': pulls,
                'per_page': perPage,
                'page': page,
            },
            errors: {
                304: `Not modified`,
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List organization issues assigned to the authenticated user
     * List issues in an organization assigned to the authenticated user.
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
     * @param org The organization name. The name is not case sensitive.
     * @param filter Indicates which sorts of issues to return. `assigned` means issues assigned to you. `created` means issues created by you. `mentioned` means issues mentioning you. `subscribed` means issues you're subscribed to updates for. `all` or `repos` means all issues you can see, regardless of participation or creation.
     * @param state Indicates the state of the issues to return.
     * @param labels A list of comma separated label names. Example: `bug,ui,@high`
     * @param type Can be the name of an issue type.
     * @param sort What to sort results by.
     * @param direction The direction to sort the results by.
     * @param since Only show results that were last updated after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns issue Response
     * @throws ApiError
     */
    public static issuesListForOrg(
        org: string,
        filter: 'assigned' | 'created' | 'mentioned' | 'subscribed' | 'repos' | 'all' = 'assigned',
        state: 'open' | 'closed' | 'all' = 'open',
        labels?: string,
        type?: string,
        sort: 'created' | 'updated' | 'comments' = 'created',
        direction: 'asc' | 'desc' = 'desc',
        since?: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<issue>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/issues',
            path: {
                'org': org,
            },
            query: {
                'filter': filter,
                'state': state,
                'labels': labels,
                'type': type,
                'sort': sort,
                'direction': direction,
                'since': since,
                'per_page': perPage,
                'page': page,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * List assignees
     * Lists the [available assignees](https://docs.github.com/articles/assigning-issues-and-pull-requests-to-other-github-users/) for issues in a repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns simple_user Response
     * @throws ApiError
     */
    public static issuesListAssignees(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<simple_user>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/assignees',
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
     * Check if a user can be assigned
     * Checks if a user has permission to be assigned to an issue in this repository.
     *
     * If the `assignee` can be assigned to issues in the repository, a `204` header with no content is returned.
     *
     * Otherwise a `404` status code is returned.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param assignee
     * @returns void
     * @throws ApiError
     */
    public static issuesCheckUserCanBeAssigned(
        owner: string,
        repo: string,
        assignee: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/assignees/{assignee}',
            path: {
                'owner': owner,
                'repo': repo,
                'assignee': assignee,
            },
            errors: {
                404: `Otherwise a \`404\` status code is returned.`,
            },
        });
    }
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
            /**
             * The title of the issue.
             */
            title: (string | number);
            /**
             * The contents of the issue.
             */
            body?: string;
            /**
             * Login for the user that this issue should be assigned to. _NOTE: Only users with push access can set the assignee for new issues. The assignee is silently dropped otherwise. **This field is closing down.**_
             */
            assignee?: string | null;
            milestone?: (string | number) | null;
            /**
             * Labels to associate with this issue. _NOTE: Only users with push access can set labels for new issues. Labels are silently dropped otherwise._
             */
            labels?: Array<(string | {
                id?: number;
                name?: string;
                description?: string | null;
                color?: string | null;
            })>;
            /**
             * Logins for Users to assign to this issue. _NOTE: Only users with push access can set assignees for new issues. Assignees are silently dropped otherwise._
             */
            assignees?: Array<string>;
            /**
             * The name of the issue type to associate with this issue. _NOTE: Only users with push access can set the type for new issues. The type is silently dropped otherwise._
             */
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
     * List issue comments for a repository
     * You can use the REST API to list comments on issues and pull requests for a repository. Every pull request is an issue, but not every issue is a pull request.
     *
     * By default, issue comments are ordered by ascending ID.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param sort The property to sort the results by.
     * @param direction Either `asc` or `desc`. Ignored without the `sort` parameter.
     * @param since Only show results that were last updated after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns issue_comment Response
     * @throws ApiError
     */
    public static issuesListCommentsForRepo(
        owner: string,
        repo: string,
        sort: 'created' | 'updated' = 'created',
        direction?: 'asc' | 'desc',
        since?: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<issue_comment>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/issues/comments',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'sort': sort,
                'direction': direction,
                'since': since,
                'per_page': perPage,
                'page': page,
            },
            errors: {
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Get an issue comment
     * You can use the REST API to get comments on issues and pull requests. Every pull request is an issue, but not every issue is a pull request.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param commentId The unique identifier of the comment.
     * @returns issue_comment Response
     * @throws ApiError
     */
    public static issuesGetComment(
        owner: string,
        repo: string,
        commentId: number,
    ): CancelablePromise<issue_comment> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/issues/comments/{comment_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'comment_id': commentId,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Update an issue comment
     * You can use the REST API to update comments on issues and pull requests. Every pull request is an issue, but not every issue is a pull request.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param commentId The unique identifier of the comment.
     * @param requestBody
     * @returns issue_comment Response
     * @throws ApiError
     */
    public static issuesUpdateComment(
        owner: string,
        repo: string,
        commentId: number,
        requestBody: {
            /**
             * The contents of the comment.
             */
            body: string;
        },
    ): CancelablePromise<issue_comment> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/repos/{owner}/{repo}/issues/comments/{comment_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'comment_id': commentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Delete an issue comment
     * You can use the REST API to delete comments on issues and pull requests. Every pull request is an issue, but not every issue is a pull request.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param commentId The unique identifier of the comment.
     * @returns void
     * @throws ApiError
     */
    public static issuesDeleteComment(
        owner: string,
        repo: string,
        commentId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/issues/comments/{comment_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'comment_id': commentId,
            },
        });
    }
    /**
     * List issue events for a repository
     * Lists events for a repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns issue_event Response
     * @throws ApiError
     */
    public static issuesListEventsForRepo(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<issue_event>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/issues/events',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Get an issue event
     * Gets a single event by the event id.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param eventId
     * @returns issue_event Response
     * @throws ApiError
     */
    public static issuesGetEvent(
        owner: string,
        repo: string,
        eventId: number,
    ): CancelablePromise<issue_event> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/issues/events/{event_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'event_id': eventId,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
                410: `Gone`,
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
            /**
             * The title of the issue.
             */
            title?: (string | number) | null;
            /**
             * The contents of the issue.
             */
            body?: string | null;
            /**
             * Username to assign to this issue. **This field is closing down.**
             */
            assignee?: string | null;
            /**
             * The open or closed state of the issue.
             */
            state?: 'open' | 'closed';
            /**
             * The reason for the state change. Ignored unless `state` is changed.
             */
            state_reason?: 'completed' | 'not_planned' | 'duplicate' | 'reopened' | null;
            milestone?: (string | number) | null;
            /**
             * Labels to associate with this issue. Pass one or more labels to _replace_ the set of labels on this issue. Send an empty array (`[]`) to clear all labels from the issue. Only users with push access can set labels for issues. Without push access to the repository, label changes are silently dropped.
             */
            labels?: Array<(string | {
                id?: number;
                name?: string;
                description?: string | null;
                color?: string | null;
            })>;
            /**
             * Usernames to assign to this issue. Pass one or more user logins to _replace_ the set of assignees on this issue. Send an empty array (`[]`) to clear all assignees from the issue. Only users with push access can set assignees for new issues. Without push access to the repository, assignee changes are silently dropped.
             */
            assignees?: Array<string>;
            /**
             * The name of the issue type to associate with this issue or use `null` to remove the current issue type. Only users with push access can set the type for issues. Without push access to the repository, type changes are silently dropped.
             */
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
     * Add assignees to an issue
     * Adds up to 10 assignees to an issue. Users already assigned to an issue are not replaced.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param issueNumber The number that identifies the issue.
     * @param requestBody
     * @returns issue Response
     * @throws ApiError
     */
    public static issuesAddAssignees(
        owner: string,
        repo: string,
        issueNumber: number,
        requestBody?: {
            /**
             * Usernames of people to assign this issue to. _NOTE: Only users with push access can add assignees to an issue. Assignees are silently ignored otherwise._
             */
            assignees?: Array<string>;
        },
    ): CancelablePromise<issue> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/assignees',
            path: {
                'owner': owner,
                'repo': repo,
                'issue_number': issueNumber,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Remove assignees from an issue
     * Removes one or more assignees from an issue.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param issueNumber The number that identifies the issue.
     * @param requestBody
     * @returns issue Response
     * @throws ApiError
     */
    public static issuesRemoveAssignees(
        owner: string,
        repo: string,
        issueNumber: number,
        requestBody?: {
            /**
             * Usernames of assignees to remove from an issue. _NOTE: Only users with push access can remove assignees from an issue. Assignees are silently ignored otherwise._
             */
            assignees?: Array<string>;
        },
    ): CancelablePromise<issue> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/assignees',
            path: {
                'owner': owner,
                'repo': repo,
                'issue_number': issueNumber,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Check if a user can be assigned to a issue
     * Checks if a user has permission to be assigned to a specific issue.
     *
     * If the `assignee` can be assigned to this issue, a `204` status code with no content is returned.
     *
     * Otherwise a `404` status code is returned.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param issueNumber The number that identifies the issue.
     * @param assignee
     * @returns void
     * @throws ApiError
     */
    public static issuesCheckUserCanBeAssignedToIssue(
        owner: string,
        repo: string,
        issueNumber: number,
        assignee: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/assignees/{assignee}',
            path: {
                'owner': owner,
                'repo': repo,
                'issue_number': issueNumber,
                'assignee': assignee,
            },
            errors: {
                404: `Response if \`assignee\` can not be assigned to \`issue_number\``,
            },
        });
    }
    /**
     * List issue comments
     * You can use the REST API to list comments on issues and pull requests. Every pull request is an issue, but not every issue is a pull request.
     *
     * Issue comments are ordered by ascending ID.
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
     * @param since Only show results that were last updated after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns issue_comment Response
     * @throws ApiError
     */
    public static issuesListComments(
        owner: string,
        repo: string,
        issueNumber: number,
        since?: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<issue_comment>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/comments',
            path: {
                'owner': owner,
                'repo': repo,
                'issue_number': issueNumber,
            },
            query: {
                'since': since,
                'per_page': perPage,
                'page': page,
            },
            errors: {
                404: `Resource not found`,
                410: `Gone`,
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
            /**
             * The contents of the comment.
             */
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
     * List dependencies an issue is blocked by
     * You can use the REST API to list the dependencies an issue is blocked by.
     *
     * This endpoint supports the following custom media types. For more information, see [Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types).
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw Markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.text+json`**: Returns a text only representation of the Markdown body. Response will include `body_text`.
     * - **`application/vnd.github.html+json`**: Returns HTML rendered from the body's Markdown. Response will include `body_html`.
     * - **`application/vnd.github.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param issueNumber The number that identifies the issue.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns issue Response
     * @throws ApiError
     */
    public static issuesListDependenciesBlockedBy(
        owner: string,
        repo: string,
        issueNumber: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<issue>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by',
            path: {
                'owner': owner,
                'repo': repo,
                'issue_number': issueNumber,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                301: `Moved permanently`,
                404: `Resource not found`,
                410: `Gone`,
            },
        });
    }
    /**
     * Add a dependency an issue is blocked by
     * You can use the REST API to add a 'blocked by' relationship to an issue.
     *
     * Creating content too quickly using this endpoint may result in secondary rate limiting.
     * For more information, see [Rate limits for the API](https://docs.github.com/rest/using-the-rest-api/rate-limits-for-the-rest-api#about-secondary-rate-limits)
     * and [Best practices for using the REST API](https://docs.github.com/rest/guides/best-practices-for-using-the-rest-api).
     *
     * This endpoint supports the following custom media types. For more information, see [Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types).
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw Markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.text+json`**: Returns a text only representation of the Markdown body. Response will include `body_text`.
     * - **`application/vnd.github.html+json`**: Returns HTML rendered from the body's Markdown. Response will include `body_html`.
     * - **`application/vnd.github.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param issueNumber The number that identifies the issue.
     * @param requestBody
     * @returns issue Response
     * @throws ApiError
     */
    public static issuesAddBlockedByDependency(
        owner: string,
        repo: string,
        issueNumber: number,
        requestBody: {
            /**
             * The id of the issue that blocks the current issue
             */
            issue_id: number;
        },
    ): CancelablePromise<issue> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by',
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
            },
        });
    }
    /**
     * Remove dependency an issue is blocked by
     * You can use the REST API to remove a dependency that an issue is blocked by.
     *
     * Removing content too quickly using this endpoint may result in secondary rate limiting.
     * For more information, see [Rate limits for the API](https://docs.github.com/rest/using-the-rest-api/rate-limits-for-the-rest-api#about-secondary-rate-limits)
     * and [Best practices for using the REST API](https://docs.github.com/rest/guides/best-practices-for-using-the-rest-api).
     *
     * This endpoint supports the following custom media types. For more information, see [Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types).
     * - **`application/vnd.github.raw+json`**: Returns the raw Markdown body. Response will include `body`. This is the default if you do not pass a specific media type.
     * - **`application/vnd.github.text+json`**: Returns a text only representation of the Markdown body. Response will include `body_text`.
     * - **`application/vnd.github.html+json`**: Returns HTML rendered from the body's Markdown. Response will include `body_html`.
     * - **`application/vnd.github.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param issueNumber The number that identifies the issue.
     * @param issueId The id of the blocking issue to remove as a dependency
     * @returns issue Response
     * @throws ApiError
     */
    public static issuesRemoveDependencyBlockedBy(
        owner: string,
        repo: string,
        issueNumber: number,
        issueId: number,
    ): CancelablePromise<issue> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by/{issue_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'issue_number': issueNumber,
                'issue_id': issueId,
            },
            errors: {
                301: `Moved permanently`,
                400: `Bad Request`,
                401: `Requires authentication`,
                403: `Forbidden`,
                404: `Resource not found`,
                410: `Gone`,
            },
        });
    }
    /**
     * List dependencies an issue is blocking
     * You can use the REST API to list the dependencies an issue is blocking.
     *
     * This endpoint supports the following custom media types. For more information, see [Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types).
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw Markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.text+json`**: Returns a text only representation of the Markdown body. Response will include `body_text`.
     * - **`application/vnd.github.html+json`**: Returns HTML rendered from the body's Markdown. Response will include `body_html`.
     * - **`application/vnd.github.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param issueNumber The number that identifies the issue.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns issue Response
     * @throws ApiError
     */
    public static issuesListDependenciesBlocking(
        owner: string,
        repo: string,
        issueNumber: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<issue>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocking',
            path: {
                'owner': owner,
                'repo': repo,
                'issue_number': issueNumber,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                301: `Moved permanently`,
                404: `Resource not found`,
                410: `Gone`,
            },
        });
    }
    /**
     * List issue events
     * Lists all events for an issue.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param issueNumber The number that identifies the issue.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns issue_event_for_issue Response
     * @throws ApiError
     */
    public static issuesListEvents(
        owner: string,
        repo: string,
        issueNumber: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<issue_event_for_issue>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/events',
            path: {
                'owner': owner,
                'repo': repo,
                'issue_number': issueNumber,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                410: `Gone`,
            },
        });
    }
    /**
     * List labels for an issue
     * Lists all labels for an issue.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param issueNumber The number that identifies the issue.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns label Response
     * @throws ApiError
     */
    public static issuesListLabelsOnIssue(
        owner: string,
        repo: string,
        issueNumber: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<label>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/labels',
            path: {
                'owner': owner,
                'repo': repo,
                'issue_number': issueNumber,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                301: `Moved permanently`,
                404: `Resource not found`,
                410: `Gone`,
            },
        });
    }
    /**
     * Add labels to an issue
     * Adds labels to an issue. If you provide an empty array of labels, all labels are removed from the issue.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param issueNumber The number that identifies the issue.
     * @param requestBody
     * @returns label Response
     * @throws ApiError
     */
    public static issuesAddLabels(
        owner: string,
        repo: string,
        issueNumber: number,
        requestBody?: ({
            /**
             * The names of the labels to add to the issue's existing labels. You can pass an empty array to remove all labels. Alternatively, you can pass a single label as a `string` or an `array` of labels directly, but GitHub recommends passing an object with the `labels` key. You can also replace all of the labels for an issue. For more information, see "[Set labels for an issue](https://docs.github.com/rest/issues/labels#set-labels-for-an-issue)."
             */
            labels?: Array<string>;
        } | Array<string> | {
            labels?: Array<{
                name: string;
            }>;
        } | string),
    ): CancelablePromise<Array<label>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/labels',
            path: {
                'owner': owner,
                'repo': repo,
                'issue_number': issueNumber,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                301: `Moved permanently`,
                404: `Resource not found`,
                410: `Gone`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Set labels for an issue
     * Removes any previous labels and sets the new labels for an issue.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param issueNumber The number that identifies the issue.
     * @param requestBody
     * @returns label Response
     * @throws ApiError
     */
    public static issuesSetLabels(
        owner: string,
        repo: string,
        issueNumber: number,
        requestBody?: ({
            /**
             * The names of the labels to set for the issue. The labels you set replace any existing labels. You can pass an empty array to remove all labels. Alternatively, you can pass a single label as a `string` or an `array` of labels directly, but GitHub recommends passing an object with the `labels` key. You can also add labels to the existing labels for an issue. For more information, see "[Add labels to an issue](https://docs.github.com/rest/issues/labels#add-labels-to-an-issue)."
             */
            labels?: Array<string>;
        } | Array<string> | {
            labels?: Array<{
                name: string;
            }>;
        } | string),
    ): CancelablePromise<Array<label>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/labels',
            path: {
                'owner': owner,
                'repo': repo,
                'issue_number': issueNumber,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                301: `Moved permanently`,
                404: `Resource not found`,
                410: `Gone`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Remove all labels from an issue
     * Removes all labels from an issue.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param issueNumber The number that identifies the issue.
     * @returns void
     * @throws ApiError
     */
    public static issuesRemoveAllLabels(
        owner: string,
        repo: string,
        issueNumber: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/labels',
            path: {
                'owner': owner,
                'repo': repo,
                'issue_number': issueNumber,
            },
            errors: {
                301: `Moved permanently`,
                404: `Resource not found`,
                410: `Gone`,
            },
        });
    }
    /**
     * Remove a label from an issue
     * Removes the specified label from the issue, and returns the remaining labels on the issue. This endpoint returns a `404 Not Found` status if the label does not exist.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param issueNumber The number that identifies the issue.
     * @param name
     * @returns label Response
     * @throws ApiError
     */
    public static issuesRemoveLabel(
        owner: string,
        repo: string,
        issueNumber: number,
        name: string,
    ): CancelablePromise<Array<label>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/labels/{name}',
            path: {
                'owner': owner,
                'repo': repo,
                'issue_number': issueNumber,
                'name': name,
            },
            errors: {
                301: `Moved permanently`,
                404: `Resource not found`,
                410: `Gone`,
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
            /**
             * The reason for locking the issue or pull request conversation. Lock will fail if you don't use one of these reasons:
             * * `off-topic`
             * * `too heated`
             * * `resolved`
             * * `spam`
             */
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
     * Unlock an issue
     * Users with push access can unlock an issue's conversation.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param issueNumber The number that identifies the issue.
     * @returns void
     * @throws ApiError
     */
    public static issuesUnlock(
        owner: string,
        repo: string,
        issueNumber: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/lock',
            path: {
                'owner': owner,
                'repo': repo,
                'issue_number': issueNumber,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Get parent issue
     * You can use the REST API to get the parent issue of a sub-issue.
     *
     * This endpoint supports the following custom media types. For more information, see [Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types).
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
    public static issuesGetParent(
        owner: string,
        repo: string,
        issueNumber: number,
    ): CancelablePromise<issue> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/parent',
            path: {
                'owner': owner,
                'repo': repo,
                'issue_number': issueNumber,
            },
            errors: {
                301: `Moved permanently`,
                404: `Resource not found`,
                410: `Gone`,
            },
        });
    }
    /**
     * Remove sub-issue
     * You can use the REST API to remove a sub-issue from an issue.
     * Removing content too quickly using this endpoint may result in secondary rate limiting.
     * For more information, see "[Rate limits for the API](https://docs.github.com/rest/using-the-rest-api/rate-limits-for-the-rest-api#about-secondary-rate-limits)"
     * and "[Best practices for using the REST API](https://docs.github.com/rest/guides/best-practices-for-using-the-rest-api)."
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     * - **`application/vnd.github.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass a specific media type.
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
    public static issuesRemoveSubIssue(
        owner: string,
        repo: string,
        issueNumber: number,
        requestBody: {
            /**
             * The id of the sub-issue to remove
             */
            sub_issue_id: number;
        },
    ): CancelablePromise<issue> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/sub_issue',
            path: {
                'owner': owner,
                'repo': repo,
                'issue_number': issueNumber,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * List sub-issues
     * You can use the REST API to list the sub-issues on an issue.
     *
     * This endpoint supports the following custom media types. For more information, see [Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types).
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw Markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.text+json`**: Returns a text only representation of the Markdown body. Response will include `body_text`.
     * - **`application/vnd.github.html+json`**: Returns HTML rendered from the body's Markdown. Response will include `body_html`.
     * - **`application/vnd.github.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param issueNumber The number that identifies the issue.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns issue Response
     * @throws ApiError
     */
    public static issuesListSubIssues(
        owner: string,
        repo: string,
        issueNumber: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<issue>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/sub_issues',
            path: {
                'owner': owner,
                'repo': repo,
                'issue_number': issueNumber,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                404: `Resource not found`,
                410: `Gone`,
            },
        });
    }
    /**
     * Add sub-issue
     * You can use the REST API to add sub-issues to issues.
     *
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
     * @returns issue Response
     * @throws ApiError
     */
    public static issuesAddSubIssue(
        owner: string,
        repo: string,
        issueNumber: number,
        requestBody: {
            /**
             * The id of the sub-issue to add. The sub-issue must belong to the same repository owner as the parent issue
             */
            sub_issue_id: number;
            /**
             * Option that, when true, instructs the operation to replace the sub-issues current parent issue
             */
            replace_parent?: boolean;
        },
    ): CancelablePromise<issue> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/sub_issues',
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
     * Reprioritize sub-issue
     * You can use the REST API to reprioritize a sub-issue to a different position in the parent list.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param issueNumber The number that identifies the issue.
     * @param requestBody
     * @returns issue Response
     * @throws ApiError
     */
    public static issuesReprioritizeSubIssue(
        owner: string,
        repo: string,
        issueNumber: number,
        requestBody: {
            /**
             * The id of the sub-issue to reprioritize
             */
            sub_issue_id: number;
            /**
             * The id of the sub-issue to be prioritized after (either positional argument after OR before should be specified).
             */
            after_id?: number;
            /**
             * The id of the sub-issue to be prioritized before (either positional argument after OR before should be specified).
             */
            before_id?: number;
        },
    ): CancelablePromise<issue> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/sub_issues/priority',
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
                422: `Validation failed, or the endpoint has been spammed.`,
                503: `Service unavailable`,
            },
        });
    }
    /**
     * List timeline events for an issue
     * List all timeline events for an issue.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param issueNumber The number that identifies the issue.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns timeline_issue_events Response
     * @throws ApiError
     */
    public static issuesListEventsForTimeline(
        owner: string,
        repo: string,
        issueNumber: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<timeline_issue_events>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/issues/{issue_number}/timeline',
            path: {
                'owner': owner,
                'repo': repo,
                'issue_number': issueNumber,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                404: `Resource not found`,
                410: `Gone`,
            },
        });
    }
    /**
     * List labels for a repository
     * Lists all labels for a repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns label Response
     * @throws ApiError
     */
    public static issuesListLabelsForRepo(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<label>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/labels',
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
     * Create a label
     * Creates a label for the specified repository with the given name and color. The name and color parameters are required. The color must be a valid [hexadecimal color code](http://www.color-hex.com/).
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns label Response
     * @throws ApiError
     */
    public static issuesCreateLabel(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * The name of the label. Emoji can be added to label names, using either native emoji or colon-style markup. For example, typing `:strawberry:` will render the emoji ![:strawberry:](https://github.githubassets.com/images/icons/emoji/unicode/1f353.png ":strawberry:"). For a full list of available emoji and codes, see "[Emoji cheat sheet](https://github.com/ikatyang/emoji-cheat-sheet)."
             */
            name: string;
            /**
             * The [hexadecimal color code](http://www.color-hex.com/) for the label, without the leading `#`.
             */
            color?: string;
            /**
             * A short description of the label. Must be 100 characters or fewer.
             */
            description?: string;
        },
    ): CancelablePromise<label> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/labels',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Get a label
     * Gets a label using the given name.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param name
     * @returns label Response
     * @throws ApiError
     */
    public static issuesGetLabel(
        owner: string,
        repo: string,
        name: string,
    ): CancelablePromise<label> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/labels/{name}',
            path: {
                'owner': owner,
                'repo': repo,
                'name': name,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Update a label
     * Updates a label using the given label name.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param name
     * @param requestBody
     * @returns label Response
     * @throws ApiError
     */
    public static issuesUpdateLabel(
        owner: string,
        repo: string,
        name: string,
        requestBody?: {
            /**
             * The new name of the label. Emoji can be added to label names, using either native emoji or colon-style markup. For example, typing `:strawberry:` will render the emoji ![:strawberry:](https://github.githubassets.com/images/icons/emoji/unicode/1f353.png ":strawberry:"). For a full list of available emoji and codes, see "[Emoji cheat sheet](https://github.com/ikatyang/emoji-cheat-sheet)."
             */
            new_name?: string;
            /**
             * The [hexadecimal color code](http://www.color-hex.com/) for the label, without the leading `#`.
             */
            color?: string;
            /**
             * A short description of the label. Must be 100 characters or fewer.
             */
            description?: string;
        },
    ): CancelablePromise<label> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/repos/{owner}/{repo}/labels/{name}',
            path: {
                'owner': owner,
                'repo': repo,
                'name': name,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a label
     * Deletes a label using the given label name.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param name
     * @returns void
     * @throws ApiError
     */
    public static issuesDeleteLabel(
        owner: string,
        repo: string,
        name: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/labels/{name}',
            path: {
                'owner': owner,
                'repo': repo,
                'name': name,
            },
        });
    }
    /**
     * List milestones
     * Lists milestones for a repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param state The state of the milestone. Either `open`, `closed`, or `all`.
     * @param sort What to sort results by. Either `due_on` or `completeness`.
     * @param direction The direction of the sort. Either `asc` or `desc`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns milestone Response
     * @throws ApiError
     */
    public static issuesListMilestones(
        owner: string,
        repo: string,
        state: 'open' | 'closed' | 'all' = 'open',
        sort: 'due_on' | 'completeness' = 'due_on',
        direction: 'asc' | 'desc' = 'asc',
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<milestone>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/milestones',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'state': state,
                'sort': sort,
                'direction': direction,
                'per_page': perPage,
                'page': page,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Create a milestone
     * Creates a milestone.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns milestone Response
     * @throws ApiError
     */
    public static issuesCreateMilestone(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * The title of the milestone.
             */
            title: string;
            /**
             * The state of the milestone. Either `open` or `closed`.
             */
            state?: 'open' | 'closed';
            /**
             * A description of the milestone.
             */
            description?: string;
            /**
             * The milestone due date. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
             */
            due_on?: string;
        },
    ): CancelablePromise<milestone> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/milestones',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Get a milestone
     * Gets a milestone using the given milestone number.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param milestoneNumber The number that identifies the milestone.
     * @returns milestone Response
     * @throws ApiError
     */
    public static issuesGetMilestone(
        owner: string,
        repo: string,
        milestoneNumber: number,
    ): CancelablePromise<milestone> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/milestones/{milestone_number}',
            path: {
                'owner': owner,
                'repo': repo,
                'milestone_number': milestoneNumber,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Update a milestone
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param milestoneNumber The number that identifies the milestone.
     * @param requestBody
     * @returns milestone Response
     * @throws ApiError
     */
    public static issuesUpdateMilestone(
        owner: string,
        repo: string,
        milestoneNumber: number,
        requestBody?: {
            /**
             * The title of the milestone.
             */
            title?: string;
            /**
             * The state of the milestone. Either `open` or `closed`.
             */
            state?: 'open' | 'closed';
            /**
             * A description of the milestone.
             */
            description?: string;
            /**
             * The milestone due date. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
             */
            due_on?: string;
        },
    ): CancelablePromise<milestone> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/repos/{owner}/{repo}/milestones/{milestone_number}',
            path: {
                'owner': owner,
                'repo': repo,
                'milestone_number': milestoneNumber,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a milestone
     * Deletes a milestone using the given milestone number.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param milestoneNumber The number that identifies the milestone.
     * @returns void
     * @throws ApiError
     */
    public static issuesDeleteMilestone(
        owner: string,
        repo: string,
        milestoneNumber: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/milestones/{milestone_number}',
            path: {
                'owner': owner,
                'repo': repo,
                'milestone_number': milestoneNumber,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * List labels for issues in a milestone
     * Lists labels for issues in a milestone.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param milestoneNumber The number that identifies the milestone.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns label Response
     * @throws ApiError
     */
    public static issuesListLabelsForMilestone(
        owner: string,
        repo: string,
        milestoneNumber: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<label>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/milestones/{milestone_number}/labels',
            path: {
                'owner': owner,
                'repo': repo,
                'milestone_number': milestoneNumber,
            },
            query: {
                'per_page': perPage,
                'page': page,
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
