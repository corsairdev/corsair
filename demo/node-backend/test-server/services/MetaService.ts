/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { api_overview } from '../models/api_overview';
import type { root } from '../models/root';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
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
     * Get all API versions
     * Get all supported GitHub API versions.
     * @returns string Response
     * @throws ApiError
     */
    public static metaGetAllVersions(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/versions',
            errors: {
                404: `Resource not found`,
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
