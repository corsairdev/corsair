import type { code_frequency_stat } from '../models/code_frequency_stat';
import type { commit } from '../models/commit';
import type { content_directory } from '../models/content_directory';
import type { content_file } from '../models/content_file';
import type { content_submodule } from '../models/content_submodule';
import type { content_symlink } from '../models/content_symlink';
import type { content_traffic } from '../models/content_traffic';
import type { file_commit } from '../models/file_commit';
import type { full_repository } from '../models/full_repository';
import type { minimal_repository } from '../models/minimal_repository';
import type { referrer_traffic } from '../models/referrer_traffic';
import type { release } from '../models/release';
import type { repository } from '../models/repository';
import type { short_branch } from '../models/short_branch';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

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
