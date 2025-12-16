import type { api_overview } from '../models/api_overview';
import type { root } from '../models/root';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

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
