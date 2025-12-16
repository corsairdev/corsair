/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { base_gist } from '../models/base_gist';
import type { gist_comment } from '../models/gist_comment';
import type { gist_commit } from '../models/gist_commit';
import type { gist_simple } from '../models/gist_simple';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GistsService {
    /**
     * List gists for the authenticated user
     * Lists the authenticated user's gists or if called anonymously, this endpoint returns all public gists:
     * @param since Only show results that were last updated after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns base_gist Response
     * @throws ApiError
     */
    public static gistsList(
        since?: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<base_gist>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gists',
            query: {
                'since': since,
                'per_page': perPage,
                'page': page,
            },
            errors: {
                304: `Not modified`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Create a gist
     * Allows you to add a new gist with one or more files.
     *
     * > [!NOTE]
     * > Don't name your files "gistfile" with a numerical suffix. This is the format of the automatic naming scheme that Gist uses internally.
     * @param requestBody
     * @returns gist_simple Response
     * @throws ApiError
     */
    public static gistsCreate(
        requestBody: {
            /**
             * Description of the gist
             */
            description?: string;
            /**
             * Names and content for the files that make up the gist
             */
            files: Record<string, {
                /**
                 * Content of the file
                 */
                content: string;
            }>;
            public?: (boolean | 'true' | 'false');
        },
    ): CancelablePromise<gist_simple> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gists',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                304: `Not modified`,
                403: `Forbidden`,
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List public gists
     * List public gists sorted by most recently updated to least recently updated.
     *
     * Note: With [pagination](https://docs.github.com/rest/guides/using-pagination-in-the-rest-api), you can fetch up to 3000 gists. For example, you can fetch 100 pages with 30 gists per page or 30 pages with 100 gists per page.
     * @param since Only show results that were last updated after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns base_gist Response
     * @throws ApiError
     */
    public static gistsListPublic(
        since?: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<base_gist>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gists/public',
            query: {
                'since': since,
                'per_page': perPage,
                'page': page,
            },
            errors: {
                304: `Not modified`,
                403: `Forbidden`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List starred gists
     * List the authenticated user's starred gists:
     * @param since Only show results that were last updated after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns base_gist Response
     * @throws ApiError
     */
    public static gistsListStarred(
        since?: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<base_gist>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gists/starred',
            query: {
                'since': since,
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
     * Get a gist
     * Gets a specified gist.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw markdown. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.base64+json`**: Returns the base64-encoded contents. This can be useful if your gist contains any invalid UTF-8 sequences.
     * @param gistId The unique identifier of the gist.
     * @returns gist_simple Response
     * @throws ApiError
     */
    public static gistsGet(
        gistId: string,
    ): CancelablePromise<gist_simple> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gists/{gist_id}',
            path: {
                'gist_id': gistId,
            },
            errors: {
                304: `Not modified`,
                403: `Forbidden Gist`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Update a gist
     * Allows you to update a gist's description and to update, delete, or rename gist files. Files
     * from the previous version of the gist that aren't explicitly changed during an edit
     * are unchanged.
     *
     * At least one of `description` or `files` is required.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw markdown. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.base64+json`**: Returns the base64-encoded contents. This can be useful if your gist contains any invalid UTF-8 sequences.
     * @param gistId The unique identifier of the gist.
     * @param requestBody
     * @returns gist_simple Response
     * @throws ApiError
     */
    public static gistsUpdate(
        gistId: string,
        requestBody: {
            /**
             * The description of the gist.
             */
            description?: string;
            /**
             * The gist files to be updated, renamed, or deleted. Each `key` must match the current filename
             * (including extension) of the targeted gist file. For example: `hello.py`.
             *
             * To delete a file, set the whole file to null. For example: `hello.py : null`. The file will also be
             * deleted if the specified object does not contain at least one of `content` or `filename`.
             */
            files?: Record<string, {
                /**
                 * The new content of the file.
                 */
                content?: string;
                /**
                 * The new filename for the file.
                 */
                filename?: string | null;
            } | null>;
        } | null,
    ): CancelablePromise<gist_simple> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/gists/{gist_id}',
            path: {
                'gist_id': gistId,
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
     * Delete a gist
     * @param gistId The unique identifier of the gist.
     * @returns void
     * @throws ApiError
     */
    public static gistsDelete(
        gistId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/gists/{gist_id}',
            path: {
                'gist_id': gistId,
            },
            errors: {
                304: `Not modified`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * List gist comments
     * Lists the comments on a gist.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw markdown. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.base64+json`**: Returns the base64-encoded contents. This can be useful if your gist contains any invalid UTF-8 sequences.
     * @param gistId The unique identifier of the gist.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns gist_comment Response
     * @throws ApiError
     */
    public static gistsListComments(
        gistId: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<gist_comment>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gists/{gist_id}/comments',
            path: {
                'gist_id': gistId,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                304: `Not modified`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Create a gist comment
     * Creates a comment on a gist.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw markdown. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.base64+json`**: Returns the base64-encoded contents. This can be useful if your gist contains any invalid UTF-8 sequences.
     * @param gistId The unique identifier of the gist.
     * @param requestBody
     * @returns gist_comment Response
     * @throws ApiError
     */
    public static gistsCreateComment(
        gistId: string,
        requestBody: {
            /**
             * The comment text.
             */
            body: string;
        },
    ): CancelablePromise<gist_comment> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gists/{gist_id}/comments',
            path: {
                'gist_id': gistId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                304: `Not modified`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Get a gist comment
     * Gets a comment on a gist.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw markdown. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.base64+json`**: Returns the base64-encoded contents. This can be useful if your gist contains any invalid UTF-8 sequences.
     * @param gistId The unique identifier of the gist.
     * @param commentId The unique identifier of the comment.
     * @returns gist_comment Response
     * @throws ApiError
     */
    public static gistsGetComment(
        gistId: string,
        commentId: number,
    ): CancelablePromise<gist_comment> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gists/{gist_id}/comments/{comment_id}',
            path: {
                'gist_id': gistId,
                'comment_id': commentId,
            },
            errors: {
                304: `Not modified`,
                403: `Forbidden Gist`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Update a gist comment
     * Updates a comment on a gist.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw markdown. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.base64+json`**: Returns the base64-encoded contents. This can be useful if your gist contains any invalid UTF-8 sequences.
     * @param gistId The unique identifier of the gist.
     * @param commentId The unique identifier of the comment.
     * @param requestBody
     * @returns gist_comment Response
     * @throws ApiError
     */
    public static gistsUpdateComment(
        gistId: string,
        commentId: number,
        requestBody: {
            /**
             * The comment text.
             */
            body: string;
        },
    ): CancelablePromise<gist_comment> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/gists/{gist_id}/comments/{comment_id}',
            path: {
                'gist_id': gistId,
                'comment_id': commentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Resource not found`,
            },
        });
    }
    /**
     * Delete a gist comment
     * @param gistId The unique identifier of the gist.
     * @param commentId The unique identifier of the comment.
     * @returns void
     * @throws ApiError
     */
    public static gistsDeleteComment(
        gistId: string,
        commentId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/gists/{gist_id}/comments/{comment_id}',
            path: {
                'gist_id': gistId,
                'comment_id': commentId,
            },
            errors: {
                304: `Not modified`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * List gist commits
     * @param gistId The unique identifier of the gist.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns gist_commit Response
     * @throws ApiError
     */
    public static gistsListCommits(
        gistId: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<gist_commit>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gists/{gist_id}/commits',
            path: {
                'gist_id': gistId,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                304: `Not modified`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * List gist forks
     * @param gistId The unique identifier of the gist.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns gist_simple Response
     * @throws ApiError
     */
    public static gistsListForks(
        gistId: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<gist_simple>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gists/{gist_id}/forks',
            path: {
                'gist_id': gistId,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                304: `Not modified`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Fork a gist
     * @param gistId The unique identifier of the gist.
     * @returns base_gist Response
     * @throws ApiError
     */
    public static gistsFork(
        gistId: string,
    ): CancelablePromise<base_gist> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gists/{gist_id}/forks',
            path: {
                'gist_id': gistId,
            },
            errors: {
                304: `Not modified`,
                403: `Forbidden`,
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Check if a gist is starred
     * @param gistId The unique identifier of the gist.
     * @returns void
     * @throws ApiError
     */
    public static gistsCheckIsStarred(
        gistId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gists/{gist_id}/star',
            path: {
                'gist_id': gistId,
            },
            errors: {
                304: `Not modified`,
                403: `Forbidden`,
                404: `Not Found if gist is not starred`,
            },
        });
    }
    /**
     * Star a gist
     * Note that you'll need to set `Content-Length` to zero when calling out to this endpoint. For more information, see "[HTTP method](https://docs.github.com/rest/guides/getting-started-with-the-rest-api#http-method)."
     * @param gistId The unique identifier of the gist.
     * @returns void
     * @throws ApiError
     */
    public static gistsStar(
        gistId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/gists/{gist_id}/star',
            path: {
                'gist_id': gistId,
            },
            errors: {
                304: `Not modified`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Unstar a gist
     * @param gistId The unique identifier of the gist.
     * @returns void
     * @throws ApiError
     */
    public static gistsUnstar(
        gistId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/gists/{gist_id}/star',
            path: {
                'gist_id': gistId,
            },
            errors: {
                304: `Not modified`,
                403: `Forbidden`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Get a gist revision
     * Gets a specified gist revision.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw markdown. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.base64+json`**: Returns the base64-encoded contents. This can be useful if your gist contains any invalid UTF-8 sequences.
     * @param gistId The unique identifier of the gist.
     * @param sha
     * @returns gist_simple Response
     * @throws ApiError
     */
    public static gistsGetRevision(
        gistId: string,
        sha: string,
    ): CancelablePromise<gist_simple> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gists/{gist_id}/{sha}',
            path: {
                'gist_id': gistId,
                'sha': sha,
            },
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List gists for a user
     * Lists public gists for the specified user:
     * @param username The handle for the GitHub user account.
     * @param since Only show results that were last updated after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns base_gist Response
     * @throws ApiError
     */
    public static gistsListForUser(
        username: string,
        since?: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<base_gist>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{username}/gists',
            path: {
                'username': username,
            },
            query: {
                'since': since,
                'per_page': perPage,
                'page': page,
            },
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
}
