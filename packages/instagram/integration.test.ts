import 'dotenv/config';

import {
    describe,
    it,
    expect,
} from 'vitest';

import {
    createCorsair,
} from 'corsair/core';

import {
    createIntegrationAndAccount,
    createTestDatabase,
} from 'corsair/tests';

import {
    getValidFacebookAccessToken,
    makeInstagramRequest,
    makeAuthenticatedInstagramRequest,
} from './client';

import { instagram } from './index';
import type { PagesResponse } from './types';

describe(
    'Instagram Auth Integration',
    () => {

        async function createInstagramClient() {

            const appId =
                process.env.FACEBOOK_APP_ID;

            const appSecret =
                process.env.FACEBOOK_APP_SECRET;

            const accessToken =
                process.env.IG_ACCESS_TOKEN;

            if (
                !appId ||
                !appSecret ||
                !accessToken
            ) {
                throw new Error(
                    'Missing environment variables'
                );
            }

            const testDb =
                createTestDatabase();

            await createIntegrationAndAccount(
                testDb.db,
                'instagram'
            );

            const corsair =
                createCorsair({
                    plugins: [
                        instagram({
                            authType: 'oauth_2',
                        }),
                    ],
                    database: testDb.db,
                    kek:
                        process.env.CORSAIR_KEK!,
                });

            // Integration Keys
            await corsair.keys.instagram!
                .issue_new_dek();

            await corsair.keys.instagram!
                .set_client_id(appId);

            await corsair.keys.instagram!
                .set_client_secret(appSecret);

            // User Keys

            await corsair.instagram!.keys
                .issue_new_dek();

            await corsair.instagram!.keys
                .set_access_token(accessToken);

            return {
                corsair,
                testDb,
            };
        }

        it(
            'basic request works with stored keys',
            async () => {

                const {
                    corsair,
                    testDb,
                } =
                    await createInstagramClient();

                console.log(
                    '\n===== TEST 1 ====='
                );

                const token =
                    await corsair.instagram!.keys
                        .get_access_token();

                const me =
                    await makeInstagramRequest(
                        '/me',
                        token!,
                        {
                            query: {
                                fields:
                                    'id,name',
                            },
                        }
                    );

                console.log(
                    'User Data:',
                    me
                );

                expect(me)
                    .toBeDefined();

                testDb.cleanup();
            }
        );

        it(
            'refresh logic works with stored keys',
            async () => {

                const {
                    corsair,
                    testDb,
                } =
                    await createInstagramClient();

                console.log(
                    '\n===== TEST 2 ====='
                );

                const appId =
                    await corsair.keys.instagram!
                        .get_client_id();
                if (!appId) {
                    throw new Error(
                        'Missing app id'
                    );
                }

                const appSecret =
                    await corsair.keys.instagram!
                        .get_client_secret();
                if (!appSecret) {
                    throw new Error(
                        'Missing access token'
                    );
                }

                const accessToken =
                    await corsair.instagram!.keys
                        .get_access_token();
                if (!accessToken) {
                    throw new Error(
                        'Missing access token'
                    );
                }

                console.log(
                    'Old Token:',
                    accessToken
                );

                const refreshed =
                    await getValidFacebookAccessToken({
                        appId,
                        appSecret,
                        accessToken,
                        forceRefresh: true,
                    });

                console.log(
                    'New Token:',
                    refreshed.accessToken
                );

                expect(
                    refreshed.accessToken
                ).toBeDefined();

                testDb.cleanup();
            }
        );

        it(
            'retry logic works with stored keys',
            async () => {

                const {
                    corsair,
                    testDb,
                } =
                    await createInstagramClient();

                console.log(
                    '\n===== TEST 3 ====='
                );

                const appId =
                    await corsair.keys.instagram!
                        .get_client_id();
                if (!appId) {
                    throw new Error(
                        'Missing access token'
                    );
                }

                const appSecret =
                    await corsair.keys.instagram!
                        .get_client_secret();
                if (!appSecret) {
                    throw new Error(
                        'Missing access token'
                    );
                }

                const accessToken =
                    await corsair.instagram!.keys
                        .get_access_token();
                if (!accessToken) {
                    throw new Error(
                        'Missing access token'
                    );
                }

                const result =
                    await makeAuthenticatedInstagramRequest(
                        '/me',
                        {
                            key:
                                'INVALID_TOKEN',

                            _refreshAuth:
                                async () => {

                                    console.log(
                                        '\nRefreshing Token...'
                                    );

                                    const refreshed =
                                        await getValidFacebookAccessToken({
                                            appId,
                                            appSecret,
                                            accessToken,
                                            forceRefresh: true,
                                        });

                                    console.log(
                                        'Refreshed Token:',
                                        refreshed.accessToken
                                    );

                                    return refreshed.accessToken;
                                },
                        },

                        {
                            query: {
                                fields:
                                    'id,name',
                            },
                        }
                    );

                console.log(
                    'Final Response:',
                    result
                );

                expect(result)
                    .toBeDefined();

                testDb.cleanup();
            }
        );

        it(
            'instagram media api works',
            async () => {

                const {
                    corsair,
                    testDb,
                } =
                    await createInstagramClient();

                const token =
                    await corsair.instagram!.keys
                        .get_access_token();

                if (!token) {
                    throw new Error(
                        'Missing token'
                    );
                }

                const pages =
                    await makeInstagramRequest<PagesResponse>(
                        '/me/accounts',
                        token,
                        {
                            query: {
                                fields:
                                    'id,name,instagram_business_account',
                            },
                        }
                    );

                console.log(
                    'Pages:',
                    pages
                );

                const igUserId =
                    pages.data?.[0]
                        ?.instagram_business_account
                        ?.id;

                if (!igUserId) {
                    throw new Error(
                        'Instagram business account not linked'
                    );
                }

                const media =
                    await makeInstagramRequest(
                        `/${igUserId}/media`,
                        token,
                        {
                            query: {
                                fields:
                                    'id,caption,media_type,media_url',
                            },
                        }
                    );

                console.log(
                    'Instagram Media:',
                    media
                );

                expect(media)
                    .toBeDefined();

                testDb.cleanup();
            }
        );

    }
);