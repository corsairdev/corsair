import 'dotenv/config';

import { createCorsair } from 'corsair/core';

import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';

import {
	getValidFacebookAccessToken,
	makeAuthenticatedInstagramRequest,
	makeInstagramRequest,
} from './client';

import { instagram } from './index';

// Resource IDs are read from environment variables to avoid committing
// production account identifiers to source control.
const IG_ACCOUNT_ID = process.env.IG_ACCOUNT_ID ?? '';
const IG_PAGE_ID = process.env.IG_PAGE_ID ?? '';
const IG_MEDIA_ID = process.env.IG_MEDIA_ID ?? '';
const IG_COMMENT_ID = process.env.IG_COMMENT_ID ?? '';
const IG_MESSAGE_ID = process.env.IG_MESSAGE_ID ?? '';
const IG_RECIPIENT_ID = process.env.IG_RECIPIENT_ID ?? '';
const IG_CONVERSATION_ID = process.env.IG_CONVERSATION_ID ?? '';

const appId = process.env.FACEBOOK_APP_ID;
const appSecret = process.env.FACEBOOK_APP_SECRET;
const accessToken = process.env.IG_ACCESS_TOKEN;
const hasEnv = !!(appId && appSecret && accessToken);

(hasEnv ? describe : describe.skip)('Instagram Integration Test', () => {
	async function createInstagramClient() {
		if (!appId || !appSecret || !accessToken) {
			throw new Error('Missing environment variables');
		}

		const testDb = createTestDatabase();

		await createIntegrationAndAccount(testDb.db, 'instagram');

		const corsair = createCorsair({
			plugins: [instagram({ authType: 'oauth_2' })],
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

			const me = await makeInstagramRequest('/me', token, {
				query: { fields: 'id,name' },
			});

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
				{ query: { fields: 'id,name' } },
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
				q: 'id,biography,follows_count,followers_count,username,ig_id',
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
				q: 'username,media_url',
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
				q: 'id,username,media_url,is_comment_enabled,caption',
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
				q: 'id,updated_time,messages',
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
				conversation_id: IG_CONVERSATION_ID,
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
				message_id: IG_MESSAGE_ID,
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
											title: 'Open GitHub',
										},
									],
								},
							],
						},
					},
				},
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
				q: 'id,text,username,timestamp',
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
				message: 'This is a test reply',
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
				message: 'This is a test comment From instagram plugin',
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
				q: 'id,text,username,timestamp,hidden,legacy_instagram_comment_id,media,parent_id,replies,user',
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
				hide: false,
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
				comment_id: IG_COMMENT_ID,
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
				alt_text: 'Test image',
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
				audio_name: 'Original Audio',
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
				caption: 'Hello! From Corsair',
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
				caption: 'Hello! From Corsair',
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
				type: 'REELS',
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
				metric_type: 'total_value',
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
				ig_id: IG_ACCOUNT_ID,
			});
			if (result.id) {
				console.log(result);
			}
		} finally {
			testDb.cleanup();
		}
	}, 1200000);
});

// ────────────────────────────────────────────────────────────────────────────
// Credential-free tests — run in CI without Meta environment variables
// ────────────────────────────────────────────────────────────────────────────

describe('Instagram Schema Validation (credential-free)', () => {
	const { InstagramEndpointInputSchemas } = require('./endpoints/types');

	// ── Pagination cursor support ──────────────────────────────────────────
	describe('pagination cursors', () => {
		const schemasWithPagination = [
			'ListAllConversations',
			'ListAllMessages',
			'GetIgUserMedia',
			'GetIgUserStories',
			'GetIgUserTags',
			'GetIgMediaComments',
			'GetIgCommentReplies',
			'GetIgMediaChildren',
			'GetPageConversations',
			'GetPostComments',
			'GetUserMedia',
		] as const;

		for (const name of schemasWithPagination) {
			it(`${name} schema accepts after/before cursors`, () => {
				const schema = InstagramEndpointInputSchemas[name];
				expect(schema).toBeDefined();

				// Build a minimal valid input with cursors
				const shape = schema.shape;
				expect(shape.after).toBeDefined();
				expect(shape.before).toBeDefined();

				// Verify cursors are optional — schema should parse without them
				const requiredFields: Record<string, unknown> = {};
				for (const [key, field] of Object.entries(shape)) {
					if (key !== 'after' && key !== 'before') {
						const f = field as { isOptional: () => boolean };
						if (!f.isOptional()) {
							requiredFields[key] =
								key === 'platform' ? 'instagram' : 'test-id';
						}
					}
				}
				const result = schema.safeParse(requiredFields);
				expect(result.success).toBe(true);

				// Verify cursors are accepted
				const withCursors = schema.safeParse({
					...requiredFields,
					after: 'cursor-abc',
					before: 'cursor-xyz',
				});
				expect(withCursors.success).toBe(true);
			});
		}
	});

	// ── Messenger greeting field ───────────────────────────────────────────
	describe('UpdateMessengerProfile schema', () => {
		it('accepts greeting configuration', () => {
			const schema = InstagramEndpointInputSchemas.UpdateMessengerProfile;
			const result = schema.safeParse({
				ig_id: '12345',
				greeting: [
					{ locale: 'default', text: 'Hello! How can we help?' },
					{ locale: 'en_US', text: 'Welcome!' },
				],
			});
			expect(result.success).toBe(true);
		});

		it('accepts persistent_menu with typed structure', () => {
			const schema = InstagramEndpointInputSchemas.UpdateMessengerProfile;
			const result = schema.safeParse({
				ig_id: '12345',
				persistent_menu: [
					{
						locale: 'default',
						composer_input_disabled: false,
						call_to_actions: [
							{ type: 'web_url', title: 'Visit', url: 'https://example.com' },
							{ type: 'postback', title: 'Help', payload: 'HELP' },
						],
					},
				],
			});
			expect(result.success).toBe(true);
		});

		it('accepts ice_breakers with typed structure', () => {
			const schema = InstagramEndpointInputSchemas.UpdateMessengerProfile;
			const result = schema.safeParse({
				ig_id: '12345',
				ice_breakers: [
					{ question: 'What can you do?', payload: 'GET_STARTED' },
				],
			});
			expect(result.success).toBe(true);
		});

		it('rejects persistent_menu with untyped objects', () => {
			const schema = InstagramEndpointInputSchemas.UpdateMessengerProfile;
			// Missing required 'locale' field
			const result = schema.safeParse({
				ig_id: '12345',
				persistent_menu: [{ random_field: true }],
			});
			expect(result.success).toBe(false);
		});

		it('rejects ice_breakers with missing required fields', () => {
			const schema = InstagramEndpointInputSchemas.UpdateMessengerProfile;
			const result = schema.safeParse({
				ig_id: '12345',
				ice_breakers: [{ question: 'Hello?' }], // missing payload
			});
			expect(result.success).toBe(false);
		});
	});

	// ── Typed user tags ───────────────────────────────────────────────────
	describe('typed user_tags', () => {
		it('CreateMediaContainer rejects untyped user_tags', () => {
			const schema = InstagramEndpointInputSchemas.CreateMediaContainer;
			const result = schema.safeParse({
				ig_id: '12345',
				user_tags: [{ not_a_username: 'test' }],
			});
			expect(result.success).toBe(false);
		});

		it('CreateMediaContainer accepts typed user_tags', () => {
			const schema = InstagramEndpointInputSchemas.CreateMediaContainer;
			const result = schema.safeParse({
				ig_id: '12345',
				user_tags: [{ username: 'testuser', x: 0.5, y: 0.5 }],
			});
			expect(result.success).toBe(true);
		});

		it('PostIgUserMedia rejects untyped user_tags', () => {
			const schema = InstagramEndpointInputSchemas.PostIgUserMedia;
			const result = schema.safeParse({
				ig_id: '12345',
				user_tags: [{ not_a_username: 'test' }],
			});
			expect(result.success).toBe(false);
		});

		it('PostIgUserMedia accepts typed user_tags', () => {
			const schema = InstagramEndpointInputSchemas.PostIgUserMedia;
			const result = schema.safeParse({
				ig_id: '12345',
				user_tags: [{ username: 'testuser', x: 0.5, y: 0.5 }],
			});
			expect(result.success).toBe(true);
		});
	});

	// ── Handler module exports ────────────────────────────────────────────
	describe('handler module exports', () => {
		it('conversations module exports expected handlers', () => {
			const mod = require('./endpoints/conversations');
			expect(typeof mod.list).toBe('function');
			expect(typeof mod.get).toBe('function');
			expect(typeof mod.getConversation).toBe('function');
			expect(typeof mod.pageConversations).toBe('function');
			expect(typeof mod.listAll).toBe('function');
		});

		it('messages module exports expected handlers', () => {
			const mod = require('./endpoints/messages');
			expect(typeof mod.get).toBe('function');
			expect(typeof mod.send).toBe('function');
			expect(typeof mod.listAll).toBe('function');
			expect(typeof mod.markSeen).toBe('function');
			expect(typeof mod.sendImage).toBe('function');
			expect(typeof mod.sendTextMessage).toBe('function');
		});

		it('messenger-profile module exports expected handlers', () => {
			const mod = require('./endpoints/messenger-profile');
			expect(typeof mod.getProfile).toBe('function');
			expect(typeof mod.updateProfile).toBe('function');
			expect(typeof mod.deleteProfile).toBe('function');
		});

		it('profile module exports expected handlers', () => {
			const mod = require('./endpoints/profile');
			expect(typeof mod.get).toBe('function');
			expect(typeof mod.insights).toBe('function');
			expect(typeof mod.media).toBe('function');
			expect(typeof mod.stories).toBe('function');
			expect(typeof mod.tags).toBe('function');
			expect(typeof mod.info).toBe('function');
			expect(typeof mod.userInsights).toBe('function');
			expect(typeof mod.userMedia).toBe('function');
			expect(typeof mod.replyMentions).toBe('function');
			expect(typeof mod.contentPublishingLimit).toBe('function');
			expect(typeof mod.liveMedia).toBe('function');
		});

		it('media module exports expected handlers', () => {
			const mod = require('./endpoints/media');
			expect(typeof mod.list).toBe('function');
			expect(typeof mod.get).toBe('function');
			expect(typeof mod.status).toBe('function');
			expect(typeof mod.insights).toBe('function');
			expect(typeof mod.children).toBe('function');
			expect(typeof mod.comments).toBe('function');
			expect(typeof mod.getMediaInsights).toBe('function');
			expect(typeof mod.postIgUserMedia).toBe('function');
			expect(typeof mod.createMediaContainer).toBe('function');
		});

		it('comments module exports expected handlers', () => {
			const mod = require('./endpoints/comments');
			expect(typeof mod.list).toBe('function');
			expect(typeof mod.reply).toBe('function');
			expect(typeof mod.send).toBe('function');
			expect(typeof mod.get).toBe('function');
			expect(typeof mod.update).toBe('function');
			expect(typeof mod.remove).toBe('function');
			expect(typeof mod.getReplies).toBe('function');
			expect(typeof mod.postReplies).toBe('function');
			expect(typeof mod.postComments).toBe('function');
			expect(typeof mod.replyToComment).toBe('function');
		});
	});

	// ── Input schema validation ───────────────────────────────────────────
	describe('input schemas reject invalid payloads', () => {
		it('GetInstagramUser requires ig_id', () => {
			const result = InstagramEndpointInputSchemas.GetInstagramUser.safeParse(
				{},
			);
			expect(result.success).toBe(false);
		});

		it('SendMessage requires page_id and recipient', () => {
			const result = InstagramEndpointInputSchemas.SendMessage.safeParse({});
			expect(result.success).toBe(false);
		});

		it('GetMediaInsights requires media_id and type', () => {
			const result = InstagramEndpointInputSchemas.GetMediaInsights.safeParse(
				{},
			);
			expect(result.success).toBe(false);
		});

		it('CreateImageContainer requires ig_id and image_url', () => {
			const result =
				InstagramEndpointInputSchemas.CreateImageContainer.safeParse({
					ig_id: '12345',
				});
			expect(result.success).toBe(false);
		});
	});
});
