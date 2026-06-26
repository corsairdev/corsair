import 'dotenv/config';

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

// Resource IDs are read from environment variables to avoid committing
// production account identifiers to source control.
const IG_ACCOUNT_ID      = process.env.IG_ACCOUNT_ID      ?? '';
const IG_PAGE_ID         = process.env.IG_PAGE_ID         ?? '';
const IG_MEDIA_ID        = process.env.IG_MEDIA_ID        ?? '';
const IG_COMMENT_ID      = process.env.IG_COMMENT_ID      ?? '';
const IG_MESSAGE_ID      = process.env.IG_MESSAGE_ID      ?? '';
const IG_RECIPIENT_ID    = process.env.IG_RECIPIENT_ID    ?? '';
const IG_CONVERSATION_ID = process.env.IG_CONVERSATION_ID ?? '';

describe(
    'Instagram Integration Test',
    () => {

        async function createInstagramClient() {

            const appId     = process.env.FACEBOOK_APP_ID;
            const appSecret = process.env.FACEBOOK_APP_SECRET;
            const accessToken = process.env.IG_ACCESS_TOKEN;

            if (!appId || !appSecret || !accessToken) {
                throw new Error('Missing environment variables');
            }

            const testDb = createTestDatabase();

            await createIntegrationAndAccount(testDb.db, 'instagram');

            const corsair = createCorsair({
                plugins: [
                    instagram({ authType: 'oauth_2' }),
                ],
                database: testDb.db,
                kek: process.env.CORSAIR_KEK!,
            });

            await corsair.keys.instagram.issue_new_dek();
            await corsair.keys.instagram.set_client_id(appId);
            await corsair.keys.instagram.set_client_secret(appSecret);

            await corsair.instagram.keys.issue_new_dek();
            await corsair.instagram.keys.set_access_token(accessToken);

            return { corsair, testDb };
        }

        it('basic request works with stored keys', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                const token = await corsair.instagram.keys.get_access_token();
                if (!token) throw new Error('Missing access token');

                const me = await makeInstagramRequest(
                    '/me',
                    token,
                    { query: { fields: 'id,name' } }
                );

                expect(me).toBeDefined();
            } finally {
                testDb.cleanup();
            }
        });

        it('refresh logic works with stored keys', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                const appId = process.env.FACEBOOK_APP_ID;
                if (!appId) throw new Error('Missing app id');

                const appSecret = process.env.FACEBOOK_APP_SECRET;
                if (!appSecret) throw new Error('Missing app secret');

                const accessToken = await corsair.instagram.keys.get_access_token();
                if (!accessToken) throw new Error('Missing access token');

                const refreshed = await getValidFacebookAccessToken({
                    appId,
                    appSecret,
                    accessToken,
                    forceRefresh: true,
                });

                expect(refreshed.accessToken).toBeDefined();
            } finally {
                testDb.cleanup();
            }
        });

        it('retry logic works with stored keys', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                const appId = process.env.FACEBOOK_APP_ID;
                if (!appId) throw new Error('Missing app id');

                const appSecret = process.env.FACEBOOK_APP_SECRET;
                if (!appSecret) throw new Error('Missing app secret');

                const accessToken = await corsair.instagram.keys.get_access_token();
                if (!accessToken) throw new Error('Missing access token');

                const result = await makeAuthenticatedInstagramRequest(
                    '/me',
                    {
                        key: 'INVALID_TOKEN',
                        _refreshAuth: async () => {
                            console.log('\nRefreshing Token...');
                            const refreshed = await getValidFacebookAccessToken({
                                appId,
                                appSecret,
                                accessToken,
                                forceRefresh: true,
                            });
                            return refreshed.accessToken;
                        },
                    },
                    { query: { fields: 'id,name' } }
                );

                expect(result).toBeDefined();
            } finally {
                testDb.cleanup();
            }
        });

        it('Get Instagram Account Details', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                const result = await corsair.instagram.api.profile.get({
                    ig_id: IG_ACCOUNT_ID,
                    q: 'id,biography,follows_count,followers_count,username,ig_id'
                });
                console.log(result);
            } finally {
                testDb.cleanup();
            }
        });

        it('Get Instagram Media List', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                await corsair.instagram.api.media.list({
                    ig_id: IG_ACCOUNT_ID,
                    q: 'username,media_url'
                });
            } finally {
                testDb.cleanup();
            }
        });

        it('Get Instagram Media', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                await corsair.instagram.api.media.get({
                    media_id: IG_MEDIA_ID,
                    q: 'id,username,media_url,is_comment_enabled,caption'
                });
            } finally {
                testDb.cleanup();
            }
        });

        it('List Instagram Conversations', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                const result = await corsair.instagram.api.conversations.list({
                    page_id: IG_PAGE_ID,
                    q: 'id,updated_time,messages'
                });
                if (result.data) {
                    console.log(result);
                }
            } finally {
                testDb.cleanup();
            }
        }, 1200000);

        it('Get Instagram Conversations', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                const result = await corsair.instagram.api.conversations.get({
                    page_id: IG_PAGE_ID,
                    q: 'id,message,created_time,from,attachments',
                    conversation_id: IG_CONVERSATION_ID
                });
                if (result.data) {
                    console.log(result);
                }
            } finally {
                testDb.cleanup();
            }
        }, 1200000);

        it('Get Instagram Message Details', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                const result = await corsair.instagram.api.messages.get({
                    page_id: IG_PAGE_ID,
                    q: 'id,message,created_time,from',
                    message_id: IG_MESSAGE_ID
                });
                if (result.id) {
                    console.log(result);
                }
            } finally {
                testDb.cleanup();
            }
        }, 1200000);

        it('Send Instagram Message', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                const result = await corsair.instagram.api.messages.send({
                    page_id: IG_PAGE_ID,
                    recipient: IG_RECIPIENT_ID,
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
                                        image_url: process.env.IG_TEST_IMAGE_URL,
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
                if (result.message_id) {
                    console.log(result);
                }
            } finally {
                testDb.cleanup();
            }
        }, 1200000);

        it('Get Instagram Comments', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                const result = await corsair.instagram.api.comments.list({
                    media_id: IG_MEDIA_ID,
                    q: 'id,text,username,timestamp'
                });
                if (result.data) {
                    console.log(result);
                }
            } finally {
                testDb.cleanup();
            }
        }, 1200000);

        it('Reply Instagram Comments', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                const result = await corsair.instagram.api.comments.reply({
                    comment_id: IG_COMMENT_ID,
                    message: 'This is a test reply'
                });
                if (result.id) {
                    console.log(result);
                }
            } finally {
                testDb.cleanup();
            }
        }, 1200000);

        it('Send Instagram Comment to media', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                const result = await corsair.instagram.api.comments.send({
                    media_id: IG_MEDIA_ID,
                    message: 'This is a test comment From instagram plugin'
                });
                if (result.id) {
                    console.log(result);
                }
            } finally {
                testDb.cleanup();
            }
        }, 1200000);

        it('Get Instagram Comment Details', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                const result = await corsair.instagram.api.comments.get({
                    comment_id: IG_COMMENT_ID,
                    q: 'id,text,username,timestamp,hidden,legacy_instagram_comment_id,media,parent_id,replies,user'
                });
                if (result.id) {
                    console.log(result);
                }
            } finally {
                testDb.cleanup();
            }
        }, 1200000);

        it('Update Instagram Comment', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                const result = await corsair.instagram.api.comments.update({
                    comment_id: IG_COMMENT_ID,
                    hide: false
                });
                if (result.success) {
                    console.log(result);
                }
            } finally {
                testDb.cleanup();
            }
        }, 1200000);

        it('Delete Instagram Comment', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                const result = await corsair.instagram.api.comments.remove({
                    comment_id: IG_COMMENT_ID
                });
                if (result.success) {
                    console.log(result);
                }
            } finally {
                testDb.cleanup();
            }
        }, 1200000);

        it('Post Instagram Image container', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                const result = await corsair.instagram.api.image.post({
                    ig_id: IG_ACCOUNT_ID,
                    image_url: process.env.IG_TEST_IMAGE_URL ?? '',
                    caption: 'Testing From Corsair',
                    alt_text: 'Test image'
                });
                console.log('Post Instagram Image container: ', result.id);
            } finally {
                testDb.cleanup();
            }
        }, 60000);

        it('Post Instagram Reel container', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                const result = await corsair.instagram.api.reel.post({
                    ig_id: IG_ACCOUNT_ID,
                    video_url: process.env.IG_TEST_VIDEO_URL ?? '',
                    media_type: 'REELS',
                    caption: 'From Corsair',
                    audio_name: 'Original Audio'
                });
                console.log('Post Instagram Reel container: ', result.id);
            } finally {
                testDb.cleanup();
            }
        }, 1200000);

        it('Post Instagram Image Story container', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                const result = await corsair.instagram.api.image.story({
                    ig_id: IG_ACCOUNT_ID,
                    image_url: process.env.IG_TEST_IMAGE_URL ?? '',
                });
                console.log('Post Instagram Image Story container: ', result.id);
            } finally {
                testDb.cleanup();
            }
        }, 1200000);

        it('Post Instagram Video Story Container', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                const result = await corsair.instagram.api.video.story({
                    ig_id: IG_ACCOUNT_ID,
                    video_url: process.env.IG_TEST_VIDEO_URL ?? '',
                });
                console.log('Post Instagram Video Story Container: ', result.id);
            } finally {
                testDb.cleanup();
            }
        }, 1200000);

        it('Post Instagram CAROUSEL', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                const children = (process.env.IG_CAROUSEL_CHILDREN ?? '').split(',');
                const result = await corsair.instagram.api.carousel.post({
                    ig_id: IG_ACCOUNT_ID,
                    media_type: 'CAROUSEL',
                    children,
                    caption: 'Hello! From Corsair'
                });
                console.log(result.id);
            } finally {
                testDb.cleanup();
            }
        }, 1200000);

        it('Create Instagram Video Container', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                const result = await corsair.instagram.api.video.container({
                    ig_id: IG_ACCOUNT_ID,
                    video_url: process.env.IG_TEST_VIDEO_URL ?? '',
                    caption: 'Hello! From Corsair'
                });
                console.log('createVideoContainer: ', result.id);
            } finally {
                testDb.cleanup();
            }
        }, 1200000);

        it('Get Instagram Media Insights', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                await corsair.instagram.api.media.insights({
                    media_id: IG_MEDIA_ID,
                    type: 'REELS'
                });
            } finally {
                testDb.cleanup();
            }
        }, 1200000);

        it('Get Instagram Account Insights', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                const result = await corsair.instagram.api.profile.insights({
                    ig_id: IG_ACCOUNT_ID,
                    metric: 'accounts_engaged,comments',
                    period: 'day',
                    metric_type: 'total_value'
                });
                if (result.data) {
                    console.log(result);
                }
            } finally {
                testDb.cleanup();
            }
        }, 1200000);

        it('Publish Instagram Media', async () => {
            const { corsair, testDb } = await createInstagramClient();
            try {
                const result = await corsair.instagram.api.publish.publish_media({
                    creation_id: process.env.IG_CREATION_ID ?? '',
                    ig_id: IG_ACCOUNT_ID
                });
                if (result.id) {
                    console.log(result);
                }
            } finally {
                testDb.cleanup();
            }
        }, 1200000);
    }
);