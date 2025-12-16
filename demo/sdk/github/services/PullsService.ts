/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { commit } from '../models/commit';
import type { diff_entry } from '../models/diff_entry';
import type { pull_request } from '../models/pull_request';
import type { pull_request_merge_result } from '../models/pull_request_merge_result';
import type { pull_request_review } from '../models/pull_request_review';
import type { pull_request_review_comment } from '../models/pull_request_review_comment';
import type { pull_request_review_request } from '../models/pull_request_review_request';
import type { pull_request_simple } from '../models/pull_request_simple';
import type { review_comment } from '../models/review_comment';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
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
     * Create a pull request
     * Draft pull requests are available in public repositories with GitHub Free and GitHub Free for organizations, GitHub Pro, and legacy per-repository billing plans, and in public and private repositories with GitHub Team and GitHub Enterprise Cloud. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * To open or update a pull request in a public repository, you must have write access to the head or the source branch. For organization-owned repositories, you must be a member of the organization that owns the repository to open or update a pull request.
     *
     * This endpoint triggers [notifications](https://docs.github.com/github/managing-subscriptions-and-notifications-on-github/about-notifications). Creating content too quickly using this endpoint may result in secondary rate limiting. For more information, see "[Rate limits for the API](https://docs.github.com/rest/using-the-rest-api/rate-limits-for-the-rest-api#about-secondary-rate-limits)" and "[Best practices for using the REST API](https://docs.github.com/rest/guides/best-practices-for-using-the-rest-api)."
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
     * @returns pull_request Response
     * @throws ApiError
     */
    public static pullsCreate(
        owner: string,
        repo: string,
        requestBody: {
            /**
             * The title of the new pull request. Required unless `issue` is specified.
             */
            title?: string;
            /**
             * The name of the branch where your changes are implemented. For cross-repository pull requests in the same network, namespace `head` with a user like this: `username:branch`.
             */
            head: string;
            /**
             * The name of the repository where the changes in the pull request were made. This field is required for cross-repository pull requests if both repositories are owned by the same organization.
             */
            head_repo?: string;
            /**
             * The name of the branch you want the changes pulled into. This should be an existing branch on the current repository. You cannot submit a pull request to one repository that requests a merge to a base of another repository.
             */
            base: string;
            /**
             * The contents of the pull request.
             */
            body?: string;
            /**
             * Indicates whether [maintainers can modify](https://docs.github.com/articles/allowing-changes-to-a-pull-request-branch-created-from-a-fork/) the pull request.
             */
            maintainer_can_modify?: boolean;
            /**
             * Indicates whether the pull request is a draft. See "[Draft Pull Requests](https://docs.github.com/articles/about-pull-requests#draft-pull-requests)" in the GitHub Help documentation to learn more.
             */
            draft?: boolean;
            /**
             * An issue in the repository to convert to a pull request. The issue title, body, and comments will become the title, body, and comments on the new pull request. Required unless `title` is specified.
             */
            issue?: number;
        },
    ): CancelablePromise<pull_request> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/pulls',
            path: {
                'owner': owner,
                'repo': repo,
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
     * List review comments in a repository
     * Lists review comments for all pull requests in a repository. By default,
     * review comments are in ascending order by ID.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github-commitcomment.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github-commitcomment.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github-commitcomment.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github-commitcomment.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param sort
     * @param direction The direction to sort results. Ignored without `sort` parameter.
     * @param since Only show results that were last updated after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns pull_request_review_comment Response
     * @throws ApiError
     */
    public static pullsListReviewCommentsForRepo(
        owner: string,
        repo: string,
        sort?: 'created' | 'updated' | 'created_at',
        direction?: 'asc' | 'desc',
        since?: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<pull_request_review_comment>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/pulls/comments',
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
        });
    }
    /**
     * Get a review comment for a pull request
     * Provides details for a specified review comment.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github-commitcomment.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github-commitcomment.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github-commitcomment.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github-commitcomment.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param commentId The unique identifier of the comment.
     * @returns pull_request_review_comment Response
     * @throws ApiError
     */
    public static pullsGetReviewComment(
        owner: string,
        repo: string,
        commentId: number,
    ): CancelablePromise<pull_request_review_comment> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/pulls/comments/{comment_id}',
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
     * Update a review comment for a pull request
     * Edits the content of a specified review comment.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github-commitcomment.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github-commitcomment.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github-commitcomment.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github-commitcomment.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param commentId The unique identifier of the comment.
     * @param requestBody
     * @returns pull_request_review_comment Response
     * @throws ApiError
     */
    public static pullsUpdateReviewComment(
        owner: string,
        repo: string,
        commentId: number,
        requestBody: {
            /**
             * The text of the reply to the review comment.
             */
            body: string;
        },
    ): CancelablePromise<pull_request_review_comment> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/repos/{owner}/{repo}/pulls/comments/{comment_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'comment_id': commentId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a review comment for a pull request
     * Deletes a review comment.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param commentId The unique identifier of the comment.
     * @returns void
     * @throws ApiError
     */
    public static pullsDeleteReviewComment(
        owner: string,
        repo: string,
        commentId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/pulls/comments/{comment_id}',
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
     * Update a pull request
     * Draft pull requests are available in public repositories with GitHub Free and GitHub Free for organizations, GitHub Pro, and legacy per-repository billing plans, and in public and private repositories with GitHub Team and GitHub Enterprise Cloud. For more information, see [GitHub's products](https://docs.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
     *
     * To open or update a pull request in a public repository, you must have write access to the head or the source branch. For organization-owned repositories, you must be a member of the organization that owns the repository to open or update a pull request.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param pullNumber The number that identifies the pull request.
     * @param requestBody
     * @returns pull_request Response
     * @throws ApiError
     */
    public static pullsUpdate(
        owner: string,
        repo: string,
        pullNumber: number,
        requestBody?: {
            /**
             * The title of the pull request.
             */
            title?: string;
            /**
             * The contents of the pull request.
             */
            body?: string;
            /**
             * State of this Pull Request. Either `open` or `closed`.
             */
            state?: 'open' | 'closed';
            /**
             * The name of the branch you want your changes pulled into. This should be an existing branch on the current repository. You cannot update the base branch on a pull request to point to another repository.
             */
            base?: string;
            /**
             * Indicates whether [maintainers can modify](https://docs.github.com/articles/allowing-changes-to-a-pull-request-branch-created-from-a-fork/) the pull request.
             */
            maintainer_can_modify?: boolean;
        },
    ): CancelablePromise<pull_request> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/repos/{owner}/{repo}/pulls/{pull_number}',
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
     * List review comments on a pull request
     * Lists all review comments for a specified pull request. By default, review comments
     * are in ascending order by ID.
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
     * @param sort The property to sort the results by.
     * @param direction The direction to sort results. Ignored without `sort` parameter.
     * @param since Only show results that were last updated after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns pull_request_review_comment Response
     * @throws ApiError
     */
    public static pullsListReviewComments(
        owner: string,
        repo: string,
        pullNumber: number,
        sort: 'created' | 'updated' = 'created',
        direction?: 'asc' | 'desc',
        since?: string,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<pull_request_review_comment>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/pulls/{pull_number}/comments',
            path: {
                'owner': owner,
                'repo': repo,
                'pull_number': pullNumber,
            },
            query: {
                'sort': sort,
                'direction': direction,
                'since': since,
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * Create a review comment for a pull request
     * Creates a review comment on the diff of a specified pull request. To add a regular comment to a pull request timeline, see "[Create an issue comment](https://docs.github.com/rest/issues/comments#create-an-issue-comment)."
     *
     * If your comment applies to more than one line in the pull request diff, you should use the parameters `line`, `side`, and optionally `start_line` and `start_side` in your request.
     *
     * The `position` parameter is closing down. If you use `position`, the `line`, `side`, `start_line`, and `start_side` parameters are not required.
     *
     * This endpoint triggers [notifications](https://docs.github.com/github/managing-subscriptions-and-notifications-on-github/about-notifications). Creating content too quickly using this endpoint may result in secondary rate limiting. For more information, see "[Rate limits for the API](https://docs.github.com/rest/using-the-rest-api/rate-limits-for-the-rest-api#about-secondary-rate-limits)"
     * and "[Best practices for using the REST API](https://docs.github.com/rest/guides/best-practices-for-using-the-rest-api)."
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
     * @returns pull_request_review_comment Response
     * @throws ApiError
     */
    public static pullsCreateReviewComment(
        owner: string,
        repo: string,
        pullNumber: number,
        requestBody: {
            /**
             * The text of the review comment.
             */
            body: string;
            /**
             * The SHA of the commit needing a comment. Not using the latest commit SHA may render your comment outdated if a subsequent commit modifies the line you specify as the `position`.
             */
            commit_id: string;
            /**
             * The relative path to the file that necessitates a comment.
             */
            path: string;
            /**
             * **This parameter is closing down. Use `line` instead**. The position in the diff where you want to add a review comment. Note this value is not the same as the line number in the file. The position value equals the number of lines down from the first "@@" hunk header in the file you want to add a comment. The line just below the "@@" line is position 1, the next line is position 2, and so on. The position in the diff continues to increase through lines of whitespace and additional hunks until the beginning of a new file.
             * @deprecated
             */
            position?: number;
            /**
             * In a split diff view, the side of the diff that the pull request's changes appear on. Can be `LEFT` or `RIGHT`. Use `LEFT` for deletions that appear in red. Use `RIGHT` for additions that appear in green or unchanged lines that appear in white and are shown for context. For a multi-line comment, side represents whether the last line of the comment range is a deletion or addition. For more information, see "[Diff view options](https://docs.github.com/articles/about-comparing-branches-in-pull-requests#diff-view-options)" in the GitHub Help documentation.
             */
            side?: 'LEFT' | 'RIGHT';
            /**
             * **Required unless using `subject_type:file`**. The line of the blob in the pull request diff that the comment applies to. For a multi-line comment, the last line of the range that your comment applies to.
             */
            line?: number;
            /**
             * **Required when using multi-line comments unless using `in_reply_to`**. The `start_line` is the first line in the pull request diff that your multi-line comment applies to. To learn more about multi-line comments, see "[Commenting on a pull request](https://docs.github.com/articles/commenting-on-a-pull-request#adding-line-comments-to-a-pull-request)" in the GitHub Help documentation.
             */
            start_line?: number;
            /**
             * **Required when using multi-line comments unless using `in_reply_to`**. The `start_side` is the starting side of the diff that the comment applies to. Can be `LEFT` or `RIGHT`. To learn more about multi-line comments, see "[Commenting on a pull request](https://docs.github.com/articles/commenting-on-a-pull-request#adding-line-comments-to-a-pull-request)" in the GitHub Help documentation. See `side` in this table for additional context.
             */
            start_side?: 'LEFT' | 'RIGHT' | 'side';
            /**
             * The ID of the review comment to reply to. To find the ID of a review comment with ["List review comments on a pull request"](#list-review-comments-on-a-pull-request). When specified, all parameters other than `body` in the request body are ignored.
             */
            in_reply_to?: number;
            /**
             * The level at which the comment is targeted.
             */
            subject_type?: 'line' | 'file';
        },
    ): CancelablePromise<pull_request_review_comment> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/pulls/{pull_number}/comments',
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
     * Create a reply for a review comment
     * Creates a reply to a review comment for a pull request. For the `comment_id`, provide the ID of the review comment you are replying to. This must be the ID of a _top-level review comment_, not a reply to that comment. Replies to replies are not supported.
     *
     * This endpoint triggers [notifications](https://docs.github.com/github/managing-subscriptions-and-notifications-on-github/about-notifications). Creating content too quickly using this endpoint may result in secondary rate limiting. For more information, see "[Rate limits for the API](https://docs.github.com/rest/using-the-rest-api/rate-limits-for-the-rest-api#about-secondary-rate-limits)"
     * and "[Best practices for using the REST API](https://docs.github.com/rest/guides/best-practices-for-using-the-rest-api)."
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
     * @param commentId The unique identifier of the comment.
     * @param requestBody
     * @returns pull_request_review_comment Response
     * @throws ApiError
     */
    public static pullsCreateReplyForReviewComment(
        owner: string,
        repo: string,
        pullNumber: number,
        commentId: number,
        requestBody: {
            /**
             * The text of the review comment.
             */
            body: string;
        },
    ): CancelablePromise<pull_request_review_comment> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies',
            path: {
                'owner': owner,
                'repo': repo,
                'pull_number': pullNumber,
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
     * List commits on a pull request
     * Lists a maximum of 250 commits for a pull request. To receive a complete
     * commit list for pull requests with more than 250 commits, use the [List commits](https://docs.github.com/rest/commits/commits#list-commits)
     * endpoint.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param pullNumber The number that identifies the pull request.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns commit Response
     * @throws ApiError
     */
    public static pullsListCommits(
        owner: string,
        repo: string,
        pullNumber: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<commit>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/pulls/{pull_number}/commits',
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
     * List pull requests files
     * Lists the files in a specified pull request.
     *
     * > [!NOTE]
     * > Responses include a maximum of 3000 files. The paginated response returns 30 files per page by default.
     *
     * This endpoint supports the following custom media types. For more information, see "[Media types](https://docs.github.com/rest/using-the-rest-api/getting-started-with-the-rest-api#media-types)."
     *
     * - **`application/vnd.github.raw+json`**: Returns the raw markdown body. Response will include `body`. This is the default if you do not pass any specific media type.
     * - **`application/vnd.github.text+json`**: Returns a text only representation of the markdown body. Response will include `body_text`.
     * - **`application/vnd.github.html+json`**: Returns HTML rendered from the body's markdown. Response will include `body_html`.
     * - **`application/vnd.github.full+json`**: Returns raw, text, and HTML representations. Response will include `body`, `body_text`, and `body_html`.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param pullNumber The number that identifies the pull request.
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns diff_entry Response
     * @throws ApiError
     */
    public static pullsListFiles(
        owner: string,
        repo: string,
        pullNumber: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<diff_entry>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/pulls/{pull_number}/files',
            path: {
                'owner': owner,
                'repo': repo,
                'pull_number': pullNumber,
            },
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
                500: `Internal Error`,
                503: `Service unavailable`,
            },
        });
    }
    /**
     * Check if a pull request has been merged
     * Checks if a pull request has been merged into the base branch. The HTTP status of the response indicates whether or not the pull request has been merged; the response body is empty.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param pullNumber The number that identifies the pull request.
     * @returns void
     * @throws ApiError
     */
    public static pullsCheckIfMerged(
        owner: string,
        repo: string,
        pullNumber: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/pulls/{pull_number}/merge',
            path: {
                'owner': owner,
                'repo': repo,
                'pull_number': pullNumber,
            },
            errors: {
                404: `Not Found if pull request has not been merged`,
            },
        });
    }
    /**
     * Merge a pull request
     * Merges a pull request into the base branch.
     * This endpoint triggers [notifications](https://docs.github.com/github/managing-subscriptions-and-notifications-on-github/about-notifications). Creating content too quickly using this endpoint may result in secondary rate limiting. For more information, see "[Rate limits for the API](https://docs.github.com/rest/using-the-rest-api/rate-limits-for-the-rest-api#about-secondary-rate-limits)" and "[Best practices for using the REST API](https://docs.github.com/rest/guides/best-practices-for-using-the-rest-api)."
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param pullNumber The number that identifies the pull request.
     * @param requestBody
     * @returns pull_request_merge_result if merge was successful
     * @throws ApiError
     */
    public static pullsMerge(
        owner: string,
        repo: string,
        pullNumber: number,
        requestBody?: {
            /**
             * Title for the automatic commit message.
             */
            commit_title?: string;
            /**
             * Extra detail to append to automatic commit message.
             */
            commit_message?: string;
            /**
             * SHA that pull request head must match to allow merge.
             */
            sha?: string;
            /**
             * The merge method to use.
             */
            merge_method?: 'merge' | 'squash' | 'rebase';
        } | null,
    ): CancelablePromise<pull_request_merge_result> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/pulls/{pull_number}/merge',
            path: {
                'owner': owner,
                'repo': repo,
                'pull_number': pullNumber,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
                405: `Method Not Allowed if merge cannot be performed`,
                409: `Conflict if sha was provided and pull request head did not match`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Get all requested reviewers for a pull request
     * Gets the users or teams whose review is requested for a pull request. Once a requested reviewer submits a review, they are no longer considered a requested reviewer. Their review will instead be returned by the [List reviews for a pull request](https://docs.github.com/rest/pulls/reviews#list-reviews-for-a-pull-request) operation.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param pullNumber The number that identifies the pull request.
     * @returns pull_request_review_request Response
     * @throws ApiError
     */
    public static pullsListRequestedReviewers(
        owner: string,
        repo: string,
        pullNumber: number,
    ): CancelablePromise<pull_request_review_request> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers',
            path: {
                'owner': owner,
                'repo': repo,
                'pull_number': pullNumber,
            },
        });
    }
    /**
     * Request reviewers for a pull request
     * Requests reviews for a pull request from a given set of users and/or teams.
     * This endpoint triggers [notifications](https://docs.github.com/github/managing-subscriptions-and-notifications-on-github/about-notifications). Creating content too quickly using this endpoint may result in secondary rate limiting. For more information, see "[Rate limits for the API](https://docs.github.com/rest/using-the-rest-api/rate-limits-for-the-rest-api#about-secondary-rate-limits)" and "[Best practices for using the REST API](https://docs.github.com/rest/guides/best-practices-for-using-the-rest-api)."
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param pullNumber The number that identifies the pull request.
     * @param requestBody
     * @returns pull_request_simple Response
     * @throws ApiError
     */
    public static pullsRequestReviewers(
        owner: string,
        repo: string,
        pullNumber: number,
        requestBody?: {
            /**
             * An array of user `login`s that will be requested.
             */
            reviewers?: Array<string>;
            /**
             * An array of team `slug`s that will be requested.
             */
            team_reviewers?: Array<string>;
        },
    ): CancelablePromise<pull_request_simple> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers',
            path: {
                'owner': owner,
                'repo': repo,
                'pull_number': pullNumber,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                422: `Unprocessable Entity if user is not a collaborator`,
            },
        });
    }
    /**
     * Remove requested reviewers from a pull request
     * Removes review requests from a pull request for a given set of users and/or teams.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param pullNumber The number that identifies the pull request.
     * @param requestBody
     * @returns pull_request_simple Response
     * @throws ApiError
     */
    public static pullsRemoveRequestedReviewers(
        owner: string,
        repo: string,
        pullNumber: number,
        requestBody: {
            /**
             * An array of user `login`s that will be removed.
             */
            reviewers: Array<string>;
            /**
             * An array of team `slug`s that will be removed.
             */
            team_reviewers?: Array<string>;
        },
    ): CancelablePromise<pull_request_simple> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers',
            path: {
                'owner': owner,
                'repo': repo,
                'pull_number': pullNumber,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation failed, or the endpoint has been spammed.`,
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
            /**
             * The SHA of the commit that needs a review. Not using the latest commit SHA may render your review comment outdated if a subsequent commit modifies the line you specify as the `position`. Defaults to the most recent commit in the pull request when you do not specify a value.
             */
            commit_id?: string;
            /**
             * **Required** when using `REQUEST_CHANGES` or `COMMENT` for the `event` parameter. The body text of the pull request review.
             */
            body?: string;
            /**
             * The review action you want to perform. The review actions include: `APPROVE`, `REQUEST_CHANGES`, or `COMMENT`. By leaving this blank, you set the review action state to `PENDING`, which means you will need to [submit the pull request review](https://docs.github.com/rest/pulls/reviews#submit-a-review-for-a-pull-request) when you are ready.
             */
            event?: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT';
            /**
             * Use the following table to specify the location, destination, and contents of the draft review comment.
             */
            comments?: Array<{
                /**
                 * The relative path to the file that necessitates a review comment.
                 */
                path: string;
                /**
                 * The position in the diff where you want to add a review comment. Note this value is not the same as the line number in the file. The `position` value equals the number of lines down from the first "@@" hunk header in the file you want to add a comment. The line just below the "@@" line is position 1, the next line is position 2, and so on. The position in the diff continues to increase through lines of whitespace and additional hunks until the beginning of a new file.
                 */
                position?: number;
                /**
                 * Text of the review comment.
                 */
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
            /**
             * The body text of the pull request review.
             */
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
    /**
     * Delete a pending review for a pull request
     * Deletes a pull request review that has not been submitted. Submitted reviews cannot be deleted.
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
    public static pullsDeletePendingReview(
        owner: string,
        repo: string,
        pullNumber: number,
        reviewId: number,
    ): CancelablePromise<pull_request_review> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}',
            path: {
                'owner': owner,
                'repo': repo,
                'pull_number': pullNumber,
                'review_id': reviewId,
            },
            errors: {
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * List comments for a pull request review
     * Lists comments for a specific pull request review.
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
     * @param perPage The number of results per page (max 100). For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @param page The page number of the results to fetch. For more information, see "[Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."
     * @returns review_comment Response
     * @throws ApiError
     */
    public static pullsListCommentsForReview(
        owner: string,
        repo: string,
        pullNumber: number,
        reviewId: number,
        perPage: number = 30,
        page: number = 1,
    ): CancelablePromise<Array<review_comment>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments',
            path: {
                'owner': owner,
                'repo': repo,
                'pull_number': pullNumber,
                'review_id': reviewId,
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
     * Dismiss a review for a pull request
     * Dismisses a specified review on a pull request.
     *
     * > [!NOTE]
     * > To dismiss a pull request review on a [protected branch](https://docs.github.com/rest/branches/branch-protection), you must be a repository administrator or be included in the list of people or teams who can dismiss pull request reviews.
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
    public static pullsDismissReview(
        owner: string,
        repo: string,
        pullNumber: number,
        reviewId: number,
        requestBody: {
            /**
             * The message for the pull request review dismissal
             */
            message: string;
            event?: 'DISMISS';
        },
    ): CancelablePromise<pull_request_review> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals',
            path: {
                'owner': owner,
                'repo': repo,
                'pull_number': pullNumber,
                'review_id': reviewId,
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
     * Submit a review for a pull request
     * Submits a pending review for a pull request. For more information about creating a pending review for a pull request, see "[Create a review for a pull request](https://docs.github.com/rest/pulls/reviews#create-a-review-for-a-pull-request)."
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
    public static pullsSubmitReview(
        owner: string,
        repo: string,
        pullNumber: number,
        reviewId: number,
        requestBody: {
            /**
             * The body text of the pull request review
             */
            body?: string;
            /**
             * The review action you want to perform. The review actions include: `APPROVE`, `REQUEST_CHANGES`, or `COMMENT`. When you leave this blank, the API returns _HTTP 422 (Unrecognizable entity)_ and sets the review action state to `PENDING`, which means you will need to re-submit the pull request review using a review action.
             */
            event: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT';
        },
    ): CancelablePromise<pull_request_review> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events',
            path: {
                'owner': owner,
                'repo': repo,
                'pull_number': pullNumber,
                'review_id': reviewId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                404: `Resource not found`,
                422: `Validation failed, or the endpoint has been spammed.`,
            },
        });
    }
    /**
     * Update a pull request branch
     * Updates the pull request branch with the latest upstream changes by merging HEAD from the base branch into the pull request branch.
     * Note: If making a request on behalf of a GitHub App you must also have permissions to write the contents of the head repository.
     * @param owner The account owner of the repository. The name is not case sensitive.
     * @param repo The name of the repository without the `.git` extension. The name is not case sensitive.
     * @param pullNumber The number that identifies the pull request.
     * @param requestBody
     * @returns any Response
     * @throws ApiError
     */
    public static pullsUpdateBranch(
        owner: string,
        repo: string,
        pullNumber: number,
        requestBody?: {
            /**
             * The expected SHA of the pull request's HEAD ref. This is the most recent commit on the pull request's branch. If the expected SHA does not match the pull request's HEAD, you will receive a `422 Unprocessable Entity` status. You can use the "[List commits](https://docs.github.com/rest/commits/commits#list-commits)" endpoint to find the most recent commit SHA. Default: SHA of the pull request's current HEAD ref.
             */
            expected_head_sha?: string;
        } | null,
    ): CancelablePromise<{
        message?: string;
        url?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/repos/{owner}/{repo}/pulls/{pull_number}/update-branch',
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
}
