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
            await corsair.keys.instagram
                .issue_new_dek();

            await corsair.keys.instagram
                .set_client_id(appId);

            await corsair.keys.instagram
                .set_client_secret(appSecret);

            // User Keys

            await corsair.instagram.keys
                .issue_new_dek();

            await corsair.instagram.keys
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

                const token =
                    await corsair.instagram.keys
                        .get_access_token();

                if (!token) {
                    throw new Error(
                        'Missing access token'
                    );
                }

                const me =
                    await makeInstagramRequest(
                        '/me',
                        token,
                        {
                            query: {
                                fields:
                                    'id,name',
                            },
                        }
                    );

                // console.log(
                //     'User Data:',
                //     me
                // );

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

                const appId =
                    await corsair.keys.instagram
                        .get_client_id();
                if (!appId) {
                    throw new Error(
                        'Missing app id'
                    );
                }

                const appSecret =
                    await corsair.keys.instagram
                        .get_client_secret();
                if (!appSecret) {
                    throw new Error(
                        'Missing access token'
                    );
                }

                const accessToken =
                    await corsair.instagram.keys
                        .get_access_token();
                if (!accessToken) {
                    throw new Error(
                        'Missing access token'
                    );
                }

                // console.log(
                //     'Old Token:',
                //     accessToken
                // );

                const refreshed =
                    await getValidFacebookAccessToken({
                        appId,
                        appSecret,
                        accessToken,
                        forceRefresh: true,
                    });

                // console.log(
                //     'New Token:',
                //     refreshed.accessToken
                // );

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

                const appId =
                    await corsair.keys.instagram
                        .get_client_id();
                if (!appId) {
                    throw new Error(
                        'Missing access token'
                    );
                }

                const appSecret =
                    await corsair.keys.instagram
                        .get_client_secret();
                if (!appSecret) {
                    throw new Error(
                        'Missing access token'
                    );
                }

                const accessToken =
                    await corsair.instagram.keys
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

                                    // console.log(
                                    //     'Refreshed Token:',
                                    //     refreshed.accessToken
                                    // );

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

                // console.log(
                //     'Final Response:',
                //     result
                // );

                expect(result)
                    .toBeDefined();

                testDb.cleanup();
            }
        );

        it('Get FaceBook User', async () => {
            const { corsair, testDb } =
                await createInstagramClient();

            console.log(
                Object.keys(corsair.instagram)
            );

            const result = await corsair.instagram.api.profile.GetFacebookUser({});

            // console.log(
            //     corsair.instagram
            // );

            testDb.cleanup();
        });

        it('Get FaceBook Pages and Instagram Account Id', async () => {
            const { corsair, testDb } =
                await createInstagramClient();

            const result = await corsair.instagram.api.profile.GetFacebookPages({});

            testDb.cleanup();
        });

        it('Get Instagram Account Details', async () => {
            const { corsair, testDb } =
                await createInstagramClient();

            const result = await corsair.instagram.api.profile.GetInstagramUser({
                ig_id: '17841434848107311',
                q: 'id,biography,follows_count,followers_count,username,ig_id'
            });

            testDb.cleanup();
        });
        it('Get Instagram Media List', async () => {
            const { corsair, testDb } =
                await createInstagramClient();

            const result = await corsair.instagram.api.media.list({
                ig_id: '17841434848107311',
                q: 'username, media_url'
            });

            // console.log(result);

            testDb.cleanup();
        });
        it('Get Instagram Media', async () => {
            const { corsair, testDb } =
                await createInstagramClient();

            const result = await corsair.instagram.api.media.get({
                media_id: '17949779841178404',
                q: 'id,username,media_url,is_comment_enabled,caption'
            });

            // console.log(result);

            testDb.cleanup();
        });

        it('Post Instagram Image container', async () => {

            const { corsair, testDb } =
                await createInstagramClient();

            console.time('instagram-post');
            const result = await corsair.instagram.api.image.post({
                ig_id: '17841434848107311',
                image_url: 'https://scontent.cdninstagram.com/v/t51.82787-15/708468999_18082194101161604_3462304361651356345_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=108&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=vpz-N-HLOwEQ7kNvwFw_1Jg&_nc_oc=AdrB7aF-cnmrbaQnhlU1PTS4i5-X4iDBGjuWcu-MieRuAuu8s22Dx3OQkF8QufgtAg0Z2XX_AlkuXFo9J3br5RSS&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&edm=AM6HXa8EAAAA&_nc_gid=xlfqVKrJ4lLVycs84MBUrQ&oh=00_Af_KZgFi7fihqoGJIltdB4OjAbnJ6oHHSWZ0fS8rg3GnlQ&oe=6A236717',
                caption: 'Tesing From Corsair',
                alt_text: 'Hiii'
            });

            console.log('Post Instagram Image container: ', result.id);

            console.log(result.id);

            console.timeEnd('instagram-post');

            testDb.cleanup();
        }, 60000);

        it('Post Instagram Reel container', async () => {

            const { corsair, testDb } =
                await createInstagramClient();

            console.time('instagram-post');
            const result = await corsair.instagram.api.reel.post({
                ig_id: '17841434848107311',
                video_url: 'https://res.cloudinary.com/dgj2pjcxm/video/upload/v1780329988/ILWIS_Software_Installation_Demo_iebgx7.mp4',
                media_type: 'REELS',
                caption: 'From Corsair',
                audio_name: 'Original Audio'
            });

            console.log('Post Instagram Reel container: ', result.id);

            console.timeEnd('instagram-post');

            testDb.cleanup();
        }, 1200000);

        it('Post Instagram Image Story contaoiner', async () => {

            const { corsair, testDb } =
                await createInstagramClient();

            console.time('instagram-post');
            const result = await corsair.instagram.api.image.story({
                ig_id: '17841434848107311',
                image_url: 'https://scontent.cdninstagram.com/v/t51.82787-15/708468999_18082194101161604_3462304361651356345_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=108&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=vpz-N-HLOwEQ7kNvwFw_1Jg&_nc_oc=AdrB7aF-cnmrbaQnhlU1PTS4i5-X4iDBGjuWcu-MieRuAuu8s22Dx3OQkF8QufgtAg0Z2XX_AlkuXFo9J3br5RSS&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&edm=AM6HXa8EAAAA&_nc_gid=xlfqVKrJ4lLVycs84MBUrQ&oh=00_Af_KZgFi7fihqoGJIltdB4OjAbnJ6oHHSWZ0fS8rg3GnlQ&oe=6A236717',
                media_type: 'STORIES',
            });

            console.log('Post Instagram Image Story contaoiner: ', result.id);

            console.timeEnd('instagram-post');

            testDb.cleanup();
        }, 1200000);
        it('Post Instagram Video Story Container', async () => {

            const { corsair, testDb } =
                await createInstagramClient();

            console.time('instagram-post');
            const result = await corsair.instagram.api.video.story({
                ig_id: '17841434848107311',
                video_url: 'https://res.cloudinary.com/dgj2pjcxm/video/upload/v1780374435/nisarg_rtlcvq.mp4',
                media_type: 'STORIES',
            });

            console.log('Post Instagram Video Story Container: ', result.id);

            console.timeEnd('instagram-post');

            console.log(result);

            testDb.cleanup();
        }, 1200000);

        it('Post Instagram CAROUSEL', async () => {

            const { corsair, testDb } =
                await createInstagramClient();

            console.time('instagram-post');
            const result = await corsair.instagram.api.carousel.post({
                ig_id: '17841434848107311',
                media_type: 'CAROUSEL',
                children: ['18084281993161604', '18084282047161604'], // image or video container-id was allowed
                caption: 'Hello! From Corsair'
            });

            console.log(result.id);

            console.timeEnd('instagram-post');

            testDb.cleanup();
        }, 1200000);

        it('Create Instagram Video Container', async () => {

            const { corsair, testDb } =
                await createInstagramClient();

            console.time('instagram-post');
            const result = await corsair.instagram.api.video.createCarouselContainer({
                ig_id: '17841434848107311',
                video_url: 'https://res.cloudinary.com/dgj2pjcxm/video/upload/v1780374435/nisarg_rtlcvq.mp4',
                media_type: 'VIDEO',
                is_carousel_item: true,
                caption: 'Hello! From Corsair'
            });

            console.log('createCarouselContainer: ', result.id)

            console.timeEnd('instagram-post');

            testDb.cleanup();
        }, 1200000);

        it('Get Instagram Media Insights', async () => {

            const { corsair, testDb } =
                await createInstagramClient();

            console.time('instagram-post');
            const result = await corsair.instagram.api.media.insights({
                media_id: '18116571484771229',
                type: 'REELS'
            });


            console.timeEnd('instagram-post');

            testDb.cleanup();
        }, 1200000);

        it('Get Instagram Account Insights', async () => {

            const { corsair, testDb } =
                await createInstagramClient();

            console.time('instagram-post');
            const result = await corsair.instagram.api.profile.insights({
                ig_id: '17841434848107311',
                metric: 'accounts_engaged, comments',
                period: 'day',
                metric_type: 'total_value'
            });

            if (result.data) {
                console.log(result);
            }

            console.timeEnd('instagram-post');

            testDb.cleanup();
        }, 1200000);

        it('List Instagram Conversations', async () => {

            const { corsair, testDb } =
                await createInstagramClient();

            console.time('instagram-post');
            const result = await corsair.instagram.api.conversations.list({
                page_id: '1198094130045031',
                q: 'id,updated_time,messages'
            });

            if (result.data) {
                console.log(result);
            }

            console.timeEnd('instagram-post');

            testDb.cleanup();
        }, 1200000);

        it('Get Instagram Conversations', async () => {

            const { corsair, testDb } =
                await createInstagramClient();

            console.time('instagram-post');
            const result = await corsair.instagram.api.conversations.get({
                page_id: '1198094130045031',
                q: 'id,message,created_time,from,attachments',
                conversation_id: 'aWdfZAG06MTpJR01lc3NhZA2VUaHJlYWQ6MTc4NDE0MzQ4NDgxMDczMTE6MzQwMjgyMzY2ODQxNzEwMzAxMjQ0MjU5Njc5NjQyMjA4MjM3Mzc1'
            });

            if (result.data) {
                console.log(result);
            }

            console.timeEnd('instagram-post');

            testDb.cleanup();
        }, 1200000);

        it('Get Instagram Message Details', async () => {

            const { corsair, testDb } =
                await createInstagramClient();

            console.time('instagram-post');
            const result = await corsair.instagram.api.messages.get({
                page_id: '1198094130045031',
                q: 'id,message,created_time,from',
                message_id: 'aWdfZAG1faXRlbToxOklHTWVzc2FnZAUlEOjE3ODQxNDM0ODQ4MTA3MzExOjM0MDI4MjM2Njg0MTcxMDMwMTI0NDI1OTY3OTY0MjIwODIzNzM3NTozMjg0MzY1NTgxNTM4MjU1NzE0OTY5ODM3MzY2MzU4ODM1MgZDZD'
            });

            if (result.id) {
                console.log(result);
            }

            console.timeEnd('instagram-post');

            testDb.cleanup();
        }, 1200000);

        it('Send Instagram Message', async () => {

            const { corsair, testDb } =
                await createInstagramClient();

            console.time('instagram-post');
            // const result = await corsair.instagram.api.messages.send({
            //     page_id: '1198094130045031',
            //     recipient: '1315250483912523',
            //     message: {
            //         attachments: [
            //             {
            //                 type: 'image',
            //                 payload: {
            //                     url: 'https://scontent.cdninstagram.com/v/t51.82787-15/708468999_18082194101161604_3462304361651356345_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=108&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=vpz-N-HLOwEQ7kNvwFw_1Jg&_nc_oc=AdrB7aF-cnmrbaQnhlU1PTS4i5-X4iDBGjuWcu-MieRuAuu8s22Dx3OQkF8QufgtAg0Z2XX_AlkuXFo9J3br5RSS&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&edm=AM6HXa8EAAAA&_nc_gid=xlfqVKrJ4lLVycs84MBUrQ&oh=00_Af_KZgFi7fihqoGJIltdB4OjAbnJ6oHHSWZ0fS8rg3GnlQ&oe=6A236717',
            //                     is_resuable: true,
            //                 }
            //             },
            //             {
            //                 type: 'image',
            //                 payload: {
            //                     url: 'https://scontent.cdninstagram.com/v/t51.82787-15/708468999_18082194101161604_3462304361651356345_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=108&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=vpz-N-HLOwEQ7kNvwFw_1Jg&_nc_oc=AdrB7aF-cnmrbaQnhlU1PTS4i5-X4iDBGjuWcu-MieRuAuu8s22Dx3OQkF8QufgtAg0Z2XX_AlkuXFo9J3br5RSS&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&edm=AM6HXa8EAAAA&_nc_gid=xlfqVKrJ4lLVycs84MBUrQ&oh=00_Af_KZgFi7fihqoGJIltdB4OjAbnJ6oHHSWZ0fS8rg3GnlQ&oe=6A236717',
            //                     is_resuable: true,
            //                 }
            //             },
            //         ]
            //     }
            // });

            const result = await corsair.instagram.api.messages.send({
                page_id: '1198094130045031',
                recipient: '1315250483912523',
                messaging_type: 'RESPONSE',
                message: {
                    attachment: {
                        type: 'template',
                        payload: {
                            template_type: 'generic',
                            elements: [
                                {
                                    title: 'Corsair Test Card',
                                    subtitle: 'Testing Generic Template',
                                    image_url: 'https://picsum.photos/800/400',
                                    buttons: [
                                        {
                                            type: 'web_url',
                                            url: 'https://github.com',
                                            title: 'Open GitHub'
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            });
            console.timeEnd('instagram-post');

            if (result.message_id) {
                console.log(result);
            }

            testDb.cleanup();
        }, 1200000);

        it('Get Instagram Comments', async () => {
            const { corsair, testDb } =
                await createInstagramClient();

            const result = await corsair.instagram.api.comments.list({
                media_id: '17949779841178404',
                q: 'id,text,username,timestamp'
            });

            if (result.data) {
                console.log(result);
            }

            testDb.cleanup();
        }
        )

        it('Reply Instagram Comments', async () => {
            const { corsair, testDb } =
                await createInstagramClient();

            const result = await corsair.instagram.api.comments.reply({
                comment_id: '18051832979592461',
                message: 'This is a test reply'
            });

            if (result.id) {
                console.log(result);
            }

            testDb.cleanup();
        }
        )
        it('Send Instagram Comment to media', async () => {
            const { corsair, testDb } =
                await createInstagramClient();

            const result = await corsair.instagram.api.comments.send({
                media_id: '17949779841178404',
                message: 'This is a test comment From instagram plugin'
            });

            if (result.id) {
                console.log(result);
            }

            testDb.cleanup();
            }, 1200000
        )

        it('Get Instagram Comment Details', async () => {
            const { corsair, testDb } =
                await createInstagramClient();

            const result = await corsair.instagram.api.comments.get({
                comment_id: '18051832979592461',
                q: 'id,text,username,timestamp,hidden,legacy_instagram_comment_id,media,parent_id,replies,user'
            });

            if (result.id) {
                console.log(result);
            }

            testDb.cleanup();
            }, 1200000
        )
        it('Update Instagram Comment', async () => {
            const { corsair, testDb } =
                await createInstagramClient();

            const result = await corsair.instagram.api.comments.update({
                comment_id: '18051832979592461',
                hide: false
            });

            if (result.success) {
                console.log(result);
            }

            testDb.cleanup();
            }, 1200000
        )
        it('Delete Instagram Comment', async () => {
            const { corsair, testDb } =
                await createInstagramClient();

            const result = await corsair.instagram.api.comments.remove({
                comment_id: '18051832979592461'
            });

            if (result.success) {
                console.log(result);
            }

            testDb.cleanup();
            }, 1200000
        )

        it('Publish Instagram Media', async () => {
            const { corsair, testDb } =
                await createInstagramClient();

            const result = await corsair.instagram.api.publish.publish_media({
                creation_id: '18084282017161604',
                ig_id: '17841434848107311'
            });

            if (result.id) {
                console.log(result);
            }

            testDb.cleanup();
            }, 1200000
        );
    }
);