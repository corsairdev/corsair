/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { event } from '../models/event';
import type { feed } from '../models/feed';
import type { minimal_repository } from '../models/minimal_repository';
import type { repository } from '../models/repository';
import type { repository_subscription } from '../models/repository_subscription';
import type { simple_user } from '../models/simple_user';
import type { stargazer } from '../models/stargazer';
import type { starred_repository } from '../models/starred_repository';
import type { thread } from '../models/thread';
import type { thread_subscription } from '../models/thread_subscription';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ActivityService {
    /**
     * List public events
     * > [!NOTE]
     * > This API is not built to serve real-time use cases. Depending on the time of day, event latency can be anywhere from 30s to 6h.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns event Response
     * @throws ApiError
     */
    public static activityListPublicEvents(
        perPage: number = 15,
        page: number = 1,
    ): CancelablePromise<Array<event>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events',
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                304: `Not modified`,
                403: `Forbidden`,
                503: `Service unavailable`,
            },
        });
    }
    /**
     * Get feeds
     * Lists the feeds available to the authenticated user. The response provides a URL for each feed. You can then get a specific feed by sending a request to one of the feed URLs.
     *
     * *   **Timeline**: The GitHub global public timeline
     * *   **User**: The public timeline for any user, using `uri_template`. For more information, see "[Hypermedia](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#hypermedia)."
     * *   **Current user public**: The public timeline for the authenticated user
     * *   **Current user**: The private timeline for the authenticated user
     * *   **Current user actor**: The private timeline for activity created by the authenticated user
     * *   **Current user organizations**: The private timeline for the organizations the authenticated user is a member of.
     * *   **Security advisories**: A collection of public announcements that provide information about security-related vulnerabilities in software on GitHub.
     *
     * By default, timeline resources are returned in JSON. You can specify the `application/atom+xml` type in the `Accept` header to return timeline resources in Atom format. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * > [!NOTE]
     * > Private feeds are only returned when [authenticating via Basic Auth](https://docs.github.com/rest/authentication/authenticating-to-the-rest-api#using-basic-authentication) since current feed URIs use the older, non revocable auth tokens.
     * @returns feed Response
     * @throws ApiError
     */
    public static activityGetFeeds(): CancelablePromise<feed> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feeds',
        });
    }
    /**
     * List public events for a network of repositories
     * > [!NOTE]
     * > This API is not built to serve real-time use cases. Depending on the time of day, event latency can be anywhere from 30s to 6h.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns event Response
     * @throws ApiError
     */
    public static activityListPublicEventsForRepoNetwork(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<event>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/networks/{owner}/{repo}/events',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                301: `Moved permanently`,
                304: `Not modified`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * List notifications for the authenticated user
     * List all notifications for the current user, sorted by most recently updated.
     * @param all If `true`, show notifications marked as read.
     * @param participating If `true`, only shows notifications in which the user is directly participating or mentioned.
     * @param since Only show results that were last updated after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param before Only show notifications updated before the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param perPage The number of results per page (max 50). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns thread Response
     * @throws ApiError
     */
    public static activityListNotificationsForAuthenticatedUser(
        all: boolean = false,
        participating: boolean = false,
        since?: string,
        before?: string,
        page: number = 1,
        perPage: number = 50,
    ): CancelablePromise<Array<thread>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notifications',
            query: {
                'all': all,
                'participating': participating,
                'since': since,
                'before': before,
                'page': page,
                'per_page': perPage,
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
     * Mark notifications as read
     * Marks all notifications as "read" for the current user. If the number of notifications is too large to complete in one request, you will receive a `202 Accepted` status and GitHub will run an asynchronous process to mark notifications as "read." To check whether any "unread" notifications remain, you can use the [List notifications for the authenticated user](https://docs.github.com/rest/activity/notifications#list-notifications-for-the-authenticated-user) endpoint and pass the query parameter `all=false`.
     * @param requestBody
     * @returns any Response
     * @throws ApiError
     */
    public static activityMarkNotificationsAsRead(
        requestBody?: {
            /**
             * Describes the last point that notifications were checked. Anything updated since this time will not be marked as read. If you omit this parameter, all notifications are marked as read. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`. Default: The current timestamp.
             */
            last_read_at?: string;
            /**
             * Whether the notification has been read.
             */
            read?: boolean;
        },
    ): CancelablePromise<{
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/notifications',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                304: `Not modified`,
                401: `Requires authentication`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Get a thread
     * Gets information about a notification thread.
     * @param threadId The unique identifier of the notification thread. This corresponds to the value returned in the `id` field when you retrieve notifications (for example with the [`GET /notifications` operation](https://docs.github.com/rest/activity/notifications#list-notifications-for-the-authenticated-user)).
     * @returns thread Response
     * @throws ApiError
     */
    public static activityGetThread(
        threadId: number,
    ): CancelablePromise<thread> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notifications/threads/{thread_id}',
            path: {
                'thread_id': threadId,
            },
            errors: {
                304: `Not modified`,
                401: `Requires authentication`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Mark a thread as read
     * Marks a thread as "read." Marking a thread as "read" is equivalent to clicking a notification in your notification inbox on GitHub: https://github.com/notifications.
     * @param threadId The unique identifier of the notification thread. This corresponds to the value returned in the `id` field when you retrieve notifications (for example with the [`GET /notifications` operation](https://docs.github.com/rest/activity/notifications#list-notifications-for-the-authenticated-user)).
     * @returns any Reset Content
     * @throws ApiError
     */
    public static activityMarkThreadAsRead(
        threadId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/notifications/threads/{thread_id}',
            path: {
                'thread_id': threadId,
            },
            errors: {
                304: `Not modified`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Mark a thread as done
     * Marks a thread as "done." Marking a thread as "done" is equivalent to marking a notification in your notification inbox on GitHub as done: https://github.com/notifications.
     * @param threadId The unique identifier of the notification thread. This corresponds to the value returned in the `id` field when you retrieve notifications (for example with the [`GET /notifications` operation](https://docs.github.com/rest/activity/notifications#list-notifications-for-the-authenticated-user)).
     * @returns void
     * @throws ApiError
     */
    public static activityMarkThreadAsDone(
        threadId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/notifications/threads/{thread_id}',
            path: {
                'thread_id': threadId,
            },
        });
    }
    /**
     * Get a thread subscription for the authenticated user
     * This checks to see if the current user is subscribed to a thread. You can also [get a repository subscription](https://docs.github.com/rest/activity/watching#get-a-repository-subscription).
     *
     * Note that subscriptions are only generated if a user is participating in a conversation--for example, they've replied to the thread, were **@mentioned**, or manually subscribe to a thread.
     * @param threadId The unique identifier of the notification thread. This corresponds to the value returned in the `id` field when you retrieve notifications (for example with the [`GET /notifications` operation](https://docs.github.com/rest/activity/notifications#list-notifications-for-the-authenticated-user)).
     * @returns thread_subscription Response
     * @throws ApiError
     */
    public static activityGetThreadSubscriptionForAuthenticatedUser(
        threadId: number,
    ): CancelablePromise<thread_subscription> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notifications/threads/{thread_id}/subscription',
            path: {
                'thread_id': threadId,
            },
            errors: {
                304: `Not modified`,
                401: `Requires authentication`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Set a thread subscription
     * If you are watching a repository, you receive notifications for all threads by default. Use this endpoint to ignore future notifications for threads until you comment on the thread or get an **@mention**.
     *
     * You can also use this endpoint to subscribe to threads that you are currently not receiving notifications for or to subscribed to threads that you have previously ignored.
     *
     * Unsubscribing from a conversation in a repository that you are not watching is functionally equivalent to the [Delete a thread subscription](https://docs.github.com/rest/activity/notifications#delete-a-thread-subscription) endpoint.
     * @param threadId The unique identifier of the notification thread. This corresponds to the value returned in the `id` field when you retrieve notifications (for example with the [`GET /notifications` operation](https://docs.github.com/rest/activity/notifications#list-notifications-for-the-authenticated-user)).
     * @param requestBody
     * @returns thread_subscription Response
     * @throws ApiError
     */
    public static activitySetThreadSubscription(
        threadId: number,
        requestBody?: {
            /**
             * Whether to block all notifications from a thread.
             */
            ignored?: boolean;
        },
    ): CancelablePromise<thread_subscription> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/notifications/threads/{thread_id}/subscription',
            path: {
                'thread_id': threadId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                304: `Not modified`,
                401: `Requires authentication`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Delete a thread subscription
     * Mutes all future notifications for a conversation until you comment on the thread or get an **@mention**. If you are watching the repository of the thread, you will still receive notifications. To ignore future notifications for a repository you are watching, use the [Set a thread subscription](https://docs.github.com/rest/activity/notifications#set-a-thread-subscription) endpoint and set `ignore` to `true`.
     * @param threadId The unique identifier of the notification thread. This corresponds to the value returned in the `id` field when you retrieve notifications (for example with the [`GET /notifications` operation](https://docs.github.com/rest/activity/notifications#list-notifications-for-the-authenticated-user)).
     * @returns void
     * @throws ApiError
     */
    public static activityDeleteThreadSubscription(
        threadId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/notifications/threads/{thread_id}/subscription',
            path: {
                'thread_id': threadId,
            },
            errors: {
                304: `Not modified`,
                401: `Requires authentication`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * List public organization events
     * > [!NOTE]
     * > This API is not built to serve real-time use cases. Depending on the time of day, event latency can be anywhere from 30s to 6h.
     * @param org The organization name. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns event Response
     * @throws ApiError
     */
    public static activityListPublicOrgEvents(
        org: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<event>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orgs/{org}/events',
            path: {
                'org': org,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * List repository events
     * > [!NOTE]
     * > This API is not built to serve real-time use cases. Depending on the time of day, event latency can be anywhere from 30s to 6h.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns event Response
     * @throws ApiError
     */
    public static activityListRepoEvents(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<event>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/events',
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
     * List repository notifications for the authenticated user
     * Lists all notifications for the current user in the specified repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param all If `true`, show notifications marked as read.
     * @param participating If `true`, only shows notifications in which the user is directly participating or mentioned.
     * @param since Only show results that were last updated after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param before Only show notifications updated before the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns thread Response
     * @throws ApiError
     */
    public static activityListRepoNotificationsForAuthenticatedUser(
        owner: string,
        repo: string,
        all: boolean = false,
        participating: boolean = false,
        since?: string,
        before?: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<thread>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/notifications',
            path: {
                'owner': owner,
                'repo': repo,
            },
            query: {
                'all': all,
                'participating': participating,
                'since': since,
                'before': before,
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * Mark repository notifications as read
     * Marks all notifications in a repository as "read" for the current user. If the number of notifications is too large to complete in one request, you will receive a `202 Accepted` status and GitHub will run an asynchronous process to mark notifications as "read." To check whether any "unread" notifications remain, you can use the [List repository notifications for the authenticated user](https://docs.github.com/rest/activity/notifications#list-repository-notifications-for-the-authenticated-user) endpoint and pass the query parameter `all=false`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns any Response
     * @throws ApiError
     */
    public static activityMarkRepoNotificationsAsRead(
        owner: string,
        repo: string,
        requestBody?: {
            /**
             * Describes the last point that notifications were checked. Anything updated since this time will not be marked as read. If you omit this parameter, all notifications are marked as read. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`. Default: The current timestamp.
             */
            last_read_at?: string;
        },
    ): CancelablePromise<{
        message?: string;
        url?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/notifications',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List stargazers
     * Lists the people that have starred the repository.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.star+json`**: Includes a timestamp of when the star was created.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static activityListStargazersForRepo(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<(Array<simple_user> | Array<stargazer>)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/stargazers',
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
     * List watchers
     * Lists the people watching the specified repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns simple_user Response
     * @throws ApiError
     */
    public static activityListWatchersForRepo(
        owner: string,
        repo: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<simple_user>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/subscribers',
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
     * Get a repository subscription
     * Gets information about whether the authenticated user is subscribed to the repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns repository_subscription if you subscribe to the repository
     * @throws ApiError
     */
    public static activityGetRepoSubscription(
        owner: string,
        repo: string,
    ): CancelablePromise<repository_subscription> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/subscription',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                403: `Forbidden`,
                404: `Not Found if you don't subscribe to the repository`,
            },
        });
    }
    /**
     * Set a repository subscription
     * If you would like to watch a repository, set `subscribed` to `true`. If you would like to ignore notifications made within a repository, set `ignored` to `true`. If you would like to stop watching a repository, [delete the repository's subscription](https://docs.github.com/rest/activity/watching#delete-a-repository-subscription) completely.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param requestBody
     * @returns repository_subscription Response
     * @throws ApiError
     */
    public static activitySetRepoSubscription(
        owner: string,
        repo: string,
        requestBody?: {
            /**
             * Determines if notifications should be received from this repository.
             */
            subscribed?: boolean;
            /**
             * Determines if all notifications should be blocked from this repository.
             */
            ignored?: boolean;
        },
    ): CancelablePromise<repository_subscription> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/subscription',
            path: {
                'owner': owner,
                'repo': repo,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a repository subscription
     * This endpoint should only be used to stop watching a repository. To control whether or not you wish to receive notifications from a repository, [set the repository's subscription manually](https://docs.github.com/rest/activity/watching#set-a-repository-subscription).
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns void
     * @throws ApiError
     */
    public static activityDeleteRepoSubscription(
        owner: string,
        repo: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/subscription',
            path: {
                'owner': owner,
                'repo': repo,
            },
        });
    }
    /**
     * List repositories starred by the authenticated user
     * Lists repositories the authenticated user has starred.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.star+json`**: Includes a timestamp of when the star was created.
     * @param sort The property to sort the results by. `created` means when the repository was starred. `updated` means when the repository was last pushed to.
     * @param direction The direction to sort the results by.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns repository Response
     * @throws ApiError
     */
    public static activityListReposStarredByAuthenticatedUser(
        sort: 'created' | 'updated' = 'created',
        direction: 'asc' | 'desc' = 'desc',
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<repository>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/starred',
            query: {
                'sort': sort,
                'direction': direction,
                'per_page': perPage,
                'page': page,
            },
            errors: {
                304: `Not modified`,
                401: `Requires authentication`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Check if a repository is starred by the authenticated user
     * Whether the authenticated user has starred the repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns void
     * @throws ApiError
     */
    public static activityCheckRepoIsStarredByAuthenticatedUser(
        owner: string,
        repo: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/starred/{owner}/{repo}',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                304: `Not modified`,
                401: `Requires authentication`,
                403: `Forbidden`,
                404: `Not Found if this repository is not starred by you`,
            },
        });
    }
    /**
     * Star a repository for the authenticated user
     * Note that you'll need to set `Content-Length` to zero when calling out to this endpoint. For more information, see "[HTTP method](https://docs.github.com/rest/guides/getting-started-with-the-rest-api#http-method)."
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns void
     * @throws ApiError
     */
    public static activityStarRepoForAuthenticatedUser(
        owner: string,
        repo: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/user/starred/{owner}/{repo}',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                304: `Not modified`,
                401: `Requires authentication`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Unstar a repository for the authenticated user
     * Unstar a repository that the authenticated user has previously starred.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @returns void
     * @throws ApiError
     */
    public static activityUnstarRepoForAuthenticatedUser(
        owner: string,
        repo: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/starred/{owner}/{repo}',
            path: {
                'owner': owner,
                'repo': repo,
            },
            errors: {
                304: `Not modified`,
                401: `Requires authentication`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * List repositories watched by the authenticated user
     * Lists repositories the authenticated user is watching.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns minimal_repository Response
     * @throws ApiError
     */
    public static activityListWatchedReposForAuthenticatedUser(
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<minimal_repository>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/subscriptions',
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                304: `Not modified`,
                401: `Requires authentication`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * List events for the authenticated user
     * If you are authenticated as the given user, you will see your private events. Otherwise, you'll only see public events. _Optional_: use the fine-grained token with following permission set to view private events: "Events" user permissions (read).
     *
     * > [!NOTE]
     * > This API is not built to serve real-time use cases. Depending on the time of day, event latency can be anywhere from 30s to 6h.
     * @param username The handle for the GitHub user account.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns event Response
     * @throws ApiError
     */
    public static activityListEventsForAuthenticatedUser(
        username: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<event>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{username}/events',
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
     * List organization events for the authenticated user
     * This is the user's organization dashboard. You must be authenticated as the user to view this.
     *
     * > [!NOTE]
     * > This API is not built to serve real-time use cases. Depending on the time of day, event latency can be anywhere from 30s to 6h.
     * @param username The handle for the GitHub user account.
     * @param org The organization name. The name is not case sensitive.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns event Response
     * @throws ApiError
     */
    public static activityListOrgEventsForAuthenticatedUser(
        username: string,
        org: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<event>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{username}/events/orgs/{org}',
            path: {
                'username': username,
                'org': org,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * List public events for a user
     * > [!NOTE]
     * > This API is not built to serve real-time use cases. Depending on the time of day, event latency can be anywhere from 30s to 6h.
     * @param username The handle for the GitHub user account.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns event Response
     * @throws ApiError
     */
    public static activityListPublicEventsForUser(
        username: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<event>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{username}/events/public',
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
     * List events received by the authenticated user
     * These are events that you've received by watching repositories and following users. If you are authenticated as the
     * given user, you will see private events. Otherwise, you'll only see public events.
     *
     * > [!NOTE]
     * > This API is not built to serve real-time use cases. Depending on the time of day, event latency can be anywhere from 30s to 6h.
     * @param username The handle for the GitHub user account.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns event Response
     * @throws ApiError
     */
    public static activityListReceivedEventsForUser(
        username: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<event>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{username}/received_events',
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
     * List public events received by a user
     * > [!NOTE]
     * > This API is not built to serve real-time use cases. Depending on the time of day, event latency can be anywhere from 30s to 6h.
     * @param username The handle for the GitHub user account.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns event Response
     * @throws ApiError
     */
    public static activityListReceivedPublicEventsForUser(
        username: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<event>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{username}/received_events/public',
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
     * List repositories starred by a user
     * Lists repositories a user has starred.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.star+json`**: Includes a timestamp of when the star was created.
     * @param username The handle for the GitHub user account.
     * @param sort The property to sort the results by. `created` means when the repository was starred. `updated` means when the repository was last pushed to.
     * @param direction The direction to sort the results by.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns any Response
     * @throws ApiError
     */
    public static activityListReposStarredByUser(
        username: string,
        sort: 'created' | 'updated' = 'created',
        direction: 'asc' | 'desc' = 'desc',
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<(Array<starred_repository> | Array<repository>)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{username}/starred',
            path: {
                'username': username,
            },
            query: {
                'sort': sort,
                'direction': direction,
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * List repositories watched by a user
     * Lists repositories a user is watching.
     * @param username The handle for the GitHub user account.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns minimal_repository Response
     * @throws ApiError
     */
    public static activityListReposWatchedByUser(
        username: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<minimal_repository>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{username}/subscriptions',
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
