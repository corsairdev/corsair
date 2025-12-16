import type { organization_full } from '../models/organization_full';
import type { simple_user } from '../models/simple_user';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

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
