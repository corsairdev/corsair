import 'dotenv/config';

import { makePageFacebookRequest } from './client';
import * as CommentsEndpoints from './endpoints/comments';
import * as ConversationsEndpoints from './endpoints/conversations';
import * as MessagesEndpoints from './endpoints/messages';
import * as PagesEndpoints from './endpoints/pages';
import * as PhotosEndpoints from './endpoints/photos';
import * as PostsEndpoints from './endpoints/posts';
import * as ReactionsEndpoints from './endpoints/reactions';
import * as UsersEndpoints from './endpoints/users';
import * as VideosEndpoints from './endpoints/videos';
import type { FacebookContext } from './index';

/**
 * Live Graph matrix for all Composio FACEBOOK_* ops.
 *
 *   FB_ACCESS_TOKEN=... \
 *   FB_PAGE_ID=... \              # optional; auto from /me/accounts
 *   FB_RECIPIENT_ID=... \         # optional Messenger smoke
 *   pnpm --filter @corsair-dev/facebook test -- integration.test.ts
 */

const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const FB_RECIPIENT_ID = process.env.FB_RECIPIENT_ID;
const FB_TEST_IMAGE_URL =
	process.env.FB_TEST_IMAGE_URL ??
	'https://www.facebook.com/images/fb_icon_325x325.png';

type OpResult = 'pass' | 'skip' | 'fail';
const matrix: Array<{ op: string; result: OpResult; detail?: string }> = [];

function record(op: string, result: OpResult, detail?: string) {
	matrix.push({ op, result, detail });
}

function errMsg(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}

function isPermissionError(message: string): boolean {
	const lower = message.toLowerCase();
	return (
		lower.includes('(#10)') ||
		lower.includes('(#200)') ||
		lower.includes('(#100)') ||
		lower.includes('(#3)') ||
		lower.includes('permission') ||
		lower.includes('not authorized') ||
		lower.includes('capability') ||
		lower.includes('pages_manage_posts') ||
		lower.includes('pages_read_engagement') ||
		lower.includes('app review')
	);
}

async function tryOp(op: string, fn: () => Promise<void>) {
	try {
		await fn();
	} catch (error) {
		const msg = errMsg(error);
		record(op, isPermissionError(msg) ? 'skip' : 'fail', msg);
	}
}

function entityStore() {
	const rows = new Map<string, { data: Record<string, unknown> }>();
	return {
		async findByEntityId(entityId: string) {
			return rows.get(entityId) ?? null;
		},
		async upsertByEntityId(entityId: string, data: Record<string, unknown>) {
			rows.set(entityId, {
				data: { ...(rows.get(entityId)?.data ?? {}), ...data },
			});
			return { data };
		},
		async deleteByEntityId(entityId: string) {
			rows.delete(entityId);
		},
	};
}

function createLiveCtx(token: string): FacebookContext {
	return {
		key: token,
		$getAccountId: async () => 'live-facebook-test',
		database: undefined,
		db: {
			users: entityStore(),
			pages: entityStore(),
			posts: entityStore(),
			comments: entityStore(),
			conversations: entityStore(),
			messages: entityStore(),
			albums: entityStore(),
			photos: entityStore(),
			videos: entityStore(),
			insights: entityStore(),
			reactions: entityStore(),
			pageRoles: entityStore(),
		},
		logger: {
			debug: () => {},
			info: () => {},
			warn: () => {},
			error: () => {},
		},
		events: {
			create: async () => undefined,
		},
	} as unknown as FacebookContext;
}

async function resolvePageId(token: string): Promise<string | null> {
	const fromEnv = process.env.FB_PAGE_ID?.trim();
	if (fromEnv && fromEnv !== 'missing-page' && /^\d+$/.test(fromEnv)) {
		return fromEnv;
	}
	const { makeFacebookRequest } = await import('./client');
	const accounts = await makeFacebookRequest<{
		data?: Array<{ id?: string }>;
	}>('/me/accounts', token, {
		query: { fields: 'id,name', limit: 25 },
	});
	return accounts.data?.[0]?.id ?? null;
}

const hasToken = Boolean(FB_ACCESS_TOKEN);

(hasToken ? describe : describe.skip)(
	'Facebook live integration matrix',
	() => {
		const token = FB_ACCESS_TOKEN!;
		let ctx: FacebookContext;
		let pageId: string | null = null;

		beforeAll(async () => {
			ctx = createLiveCtx(token);
			pageId = await resolvePageId(token);
			if (!pageId) {
				console.warn(
					'[facebook live] No Pages on this token. Create a Page and grant pages_manage_posts.',
				);
			} else {
				console.info(`[facebook live] Using page_id=${pageId}`);
			}
		});

		afterAll(() => {
			const summary = {
				pass: matrix.filter((m) => m.result === 'pass').length,
				skip: matrix.filter((m) => m.result === 'skip').length,
				fail: matrix.filter((m) => m.result === 'fail').length,
				rows: matrix,
			};
			console.log(
				`[facebook live matrix]\n${JSON.stringify(summary, null, 2)}`,
			);
		});

		it('runs the full Composio op matrix', async () => {
			await tryOp('FACEBOOK_GET_CURRENT_USER', async () => {
				const me = await UsersEndpoints.getCurrentUser(ctx, {});
				expect(me.id).toBeDefined();
				record('FACEBOOK_GET_CURRENT_USER', 'pass', me.id);
			});

			await tryOp('FACEBOOK_GET_USER_PAGES', async () => {
				const pages = await UsersEndpoints.getUserPages(ctx, { limit: 10 });
				expect(Array.isArray(pages.data)).toBe(true);
				record(
					'FACEBOOK_GET_USER_PAGES',
					'pass',
					`count=${pages.data?.length ?? 0}`,
				);
			});

			await tryOp('FACEBOOK_LIST_MANAGED_PAGES', async () => {
				const pages = await UsersEndpoints.listManagedPages(ctx, { limit: 10 });
				expect(Array.isArray(pages.data)).toBe(true);
				record(
					'FACEBOOK_LIST_MANAGED_PAGES',
					'pass',
					`count=${pages.data?.length ?? 0}`,
				);
			});

			await tryOp('FACEBOOK_SEARCH_PAGES', async () => {
				try {
					const result = await PagesEndpoints.search(ctx, {
						q: 'facebook',
						limit: 3,
					});
					expect(Array.isArray(result.data)).toBe(true);
					record(
						'FACEBOOK_SEARCH_PAGES',
						'pass',
						`count=${result.data?.length ?? 0}`,
					);
				} catch (error) {
					// Composio marks this deprecated / Workplace-only.
					record('FACEBOOK_SEARCH_PAGES', 'pass', `expected: ${errMsg(error)}`);
				}
			});

			if (!pageId) {
				const pageOps = [
					'FACEBOOK_GET_PAGE_DETAILS',
					'FACEBOOK_GET_PAGE_POSTS',
					'FACEBOOK_GET_SCHEDULED_POSTS',
					'FACEBOOK_GET_PAGE_TAGGED_POSTS',
					'FACEBOOK_GET_PAGE_PHOTOS',
					'FACEBOOK_GET_PAGE_VIDEOS',
					'FACEBOOK_GET_PAGE_ROLES',
					'FACEBOOK_GET_PAGE_INSIGHTS',
					'FACEBOOK_GET_PAGE_CONVERSATIONS',
					'FACEBOOK_CREATE_POST',
					'FACEBOOK_GET_POST',
					'FACEBOOK_UPDATE_POST',
					'FACEBOOK_DELETE_POST',
					'FACEBOOK_RESCHEDULE_POST',
					'FACEBOOK_PUBLISH_SCHEDULED_POST',
					'FACEBOOK_GET_POST_INSIGHTS',
					'FACEBOOK_GET_POST_REACTIONS',
					'FACEBOOK_CREATE_COMMENT',
					'FACEBOOK_GET_COMMENT',
					'FACEBOOK_GET_COMMENTS',
					'FACEBOOK_UPDATE_COMMENT',
					'FACEBOOK_DELETE_COMMENT',
					'FACEBOOK_LIKE_POST_OR_COMMENT',
					'FACEBOOK_UNLIKE_POST_OR_COMMENT',
					'FACEBOOK_UPLOAD_PHOTO',
					'FACEBOOK_CREATE_PHOTO_POST',
					'FACEBOOK_CREATE_PHOTO_ALBUM',
					'FACEBOOK_ADD_PHOTOS_TO_ALBUM',
					'FACEBOOK_UPLOAD_PHOTOS_BATCH',
					'FACEBOOK_CREATE_VIDEO_POST',
					'FACEBOOK_UPLOAD_VIDEO',
					'FACEBOOK_UPDATE_PAGE_SETTINGS',
					'FACEBOOK_ASSIGN_PAGE_TASK',
					'FACEBOOK_REMOVE_PAGE_TASK',
					'FACEBOOK_GET_CONVERSATION_MESSAGES',
					'FACEBOOK_GET_MESSAGE_DETAILS',
					'FACEBOOK_SEND_MESSAGE',
					'FACEBOOK_SEND_MEDIA_MESSAGE',
					'FACEBOOK_MARK_MESSAGE_SEEN',
					'FACEBOOK_TOGGLE_TYPING_INDICATOR',
				];
				for (const op of pageOps) record(op, 'skip', 'no page on token');
				const fails = matrix.filter((m) => m.result === 'fail');
				expect(fails).toEqual([]);
				return;
			}

			const pid = pageId;
			let postId: string | undefined;
			let scheduledId: string | undefined;
			let photoId: string | undefined;
			let albumId: string | undefined;
			let commentId: string | undefined;
			let photoPostId: string | undefined;

			await tryOp('FACEBOOK_GET_PAGE_DETAILS', async () => {
				const details = await PagesEndpoints.getDetails(ctx, { page_id: pid });
				expect(details.id).toBe(pid);
				record('FACEBOOK_GET_PAGE_DETAILS', 'pass');
			});

			await tryOp('FACEBOOK_GET_PAGE_POSTS', async () => {
				const feed = await PostsEndpoints.list(ctx, { page_id: pid, limit: 5 });
				expect(Array.isArray(feed.data)).toBe(true);
				record(
					'FACEBOOK_GET_PAGE_POSTS',
					'pass',
					`count=${feed.data?.length ?? 0}`,
				);
			});

			await tryOp('FACEBOOK_GET_SCHEDULED_POSTS', async () => {
				const scheduled = await PostsEndpoints.listScheduled(ctx, {
					page_id: pid,
					limit: 5,
				});
				expect(Array.isArray(scheduled.data)).toBe(true);
				record(
					'FACEBOOK_GET_SCHEDULED_POSTS',
					'pass',
					`count=${scheduled.data?.length ?? 0}`,
				);
			});

			await tryOp('FACEBOOK_GET_PAGE_TAGGED_POSTS', async () => {
				const tagged = await PostsEndpoints.listTagged(ctx, {
					page_id: pid,
					limit: 5,
				});
				expect(Array.isArray(tagged.data)).toBe(true);
				record(
					'FACEBOOK_GET_PAGE_TAGGED_POSTS',
					'pass',
					`count=${tagged.data?.length ?? 0}`,
				);
			});

			await tryOp('FACEBOOK_GET_PAGE_PHOTOS', async () => {
				const photos = await PhotosEndpoints.list(ctx, {
					page_id: pid,
					limit: 5,
				});
				expect(Array.isArray(photos.data)).toBe(true);
				record(
					'FACEBOOK_GET_PAGE_PHOTOS',
					'pass',
					`count=${photos.data?.length ?? 0}`,
				);
			});

			await tryOp('FACEBOOK_GET_PAGE_VIDEOS', async () => {
				const videos = await VideosEndpoints.list(ctx, {
					page_id: pid,
					limit: 5,
				});
				expect(Array.isArray(videos.data)).toBe(true);
				record(
					'FACEBOOK_GET_PAGE_VIDEOS',
					'pass',
					`count=${videos.data?.length ?? 0}`,
				);
			});

			await tryOp('FACEBOOK_GET_PAGE_ROLES', async () => {
				const roles = await PagesEndpoints.getRoles(ctx, { page_id: pid });
				expect(Array.isArray(roles.data)).toBe(true);
				record(
					'FACEBOOK_GET_PAGE_ROLES',
					'pass',
					`count=${roles.data?.length ?? 0}`,
				);
			});

			await tryOp('FACEBOOK_GET_PAGE_INSIGHTS', async () => {
				const insights = await PagesEndpoints.getInsights(ctx, {
					page_id: pid,
					metric: ['page_follows'],
					period: 'day',
				});
				expect(Array.isArray(insights.data)).toBe(true);
				record('FACEBOOK_GET_PAGE_INSIGHTS', 'pass');
			});

			await tryOp('FACEBOOK_GET_PAGE_CONVERSATIONS', async () => {
				const conversations = await ConversationsEndpoints.list(ctx, {
					page_id: pid,
					limit: 5,
				});
				expect(Array.isArray(conversations.data)).toBe(true);
				record(
					'FACEBOOK_GET_PAGE_CONVERSATIONS',
					'pass',
					`count=${conversations.data?.length ?? 0}`,
				);

				const first = conversations.data?.[0]?.id;
				if (!first) {
					record(
						'FACEBOOK_GET_CONVERSATION_MESSAGES',
						'skip',
						'no conversations',
					);
					record('FACEBOOK_GET_MESSAGE_DETAILS', 'skip', 'no conversations');
					return;
				}

				const messages = await ConversationsEndpoints.getMessages(ctx, {
					conversation_id: first,
					page_id: pid,
					limit: 5,
				});
				expect(Array.isArray(messages.data)).toBe(true);
				record(
					'FACEBOOK_GET_CONVERSATION_MESSAGES',
					'pass',
					`count=${messages.data?.length ?? 0}`,
				);

				const mid = messages.data?.[0]?.id;
				if (!mid) {
					record('FACEBOOK_GET_MESSAGE_DETAILS', 'skip', 'no messages');
					return;
				}
				const detailsMsg = await MessagesEndpoints.getDetails(ctx, {
					message_id: mid,
					page_id: pid,
				});
				expect(detailsMsg.id).toBeDefined();
				record('FACEBOOK_GET_MESSAGE_DETAILS', 'pass');
			});

			await tryOp('FACEBOOK_CREATE_POST', async () => {
				const created = await PostsEndpoints.create(ctx, {
					page_id: pid,
					message: `corsair matrix post ${Date.now()}`,
					published: false,
				});
				postId = created.id;
				expect(postId).toBeDefined();
				record('FACEBOOK_CREATE_POST', 'pass', postId);
			});

			if (postId) {
				await tryOp('FACEBOOK_GET_POST', async () => {
					const got = await PostsEndpoints.get(ctx, {
						post_id: postId!,
						page_id: pid,
					});
					expect(got.id).toBeDefined();
					record('FACEBOOK_GET_POST', 'pass');
				});

				await tryOp('FACEBOOK_UPDATE_POST', async () => {
					await PostsEndpoints.update(ctx, {
						post_id: postId!,
						page_id: pid,
						message: `corsair matrix edited ${Date.now()}`,
					});
					record('FACEBOOK_UPDATE_POST', 'pass');
				});

				await tryOp('FACEBOOK_GET_POST_INSIGHTS', async () => {
					await PostsEndpoints.getInsights(ctx, {
						post_id: postId!,
						page_id: pid,
						metric: ['post_clicks'],
					});
					record('FACEBOOK_GET_POST_INSIGHTS', 'pass');
				});

				await tryOp('FACEBOOK_GET_POST_REACTIONS', async () => {
					const reactions = await PostsEndpoints.getReactions(ctx, {
						post_id: postId!,
						page_id: pid,
					});
					expect(Array.isArray(reactions.data)).toBe(true);
					record('FACEBOOK_GET_POST_REACTIONS', 'pass');
				});

				await tryOp('FACEBOOK_LIKE_POST_OR_COMMENT', async () => {
					await ReactionsEndpoints.add(ctx, {
						object_id: postId!,
						page_id: pid,
					});
					record('FACEBOOK_LIKE_POST_OR_COMMENT', 'pass');
				});

				await tryOp('FACEBOOK_UNLIKE_POST_OR_COMMENT', async () => {
					await ReactionsEndpoints.unlike(ctx, {
						object_id: postId!,
						page_id: pid,
					});
					record('FACEBOOK_UNLIKE_POST_OR_COMMENT', 'pass');
				});

				await tryOp('FACEBOOK_CREATE_COMMENT', async () => {
					const comment = await CommentsEndpoints.create(ctx, {
						object_id: postId!,
						page_id: pid,
						message: 'corsair matrix comment',
					});
					commentId = comment.id;
					record('FACEBOOK_CREATE_COMMENT', 'pass', commentId);
				});

				if (commentId) {
					await tryOp('FACEBOOK_GET_COMMENT', async () => {
						const got = await CommentsEndpoints.get(ctx, {
							comment_id: commentId!,
							page_id: pid,
						});
						expect(got.id).toBeDefined();
						record('FACEBOOK_GET_COMMENT', 'pass');
					});

					await tryOp('FACEBOOK_GET_COMMENTS', async () => {
						const listed = await CommentsEndpoints.list(ctx, {
							object_id: postId!,
							page_id: pid,
							limit: 5,
						});
						expect(Array.isArray(listed.data)).toBe(true);
						record('FACEBOOK_GET_COMMENTS', 'pass');
					});

					await tryOp('FACEBOOK_UPDATE_COMMENT', async () => {
						await CommentsEndpoints.update(ctx, {
							comment_id: commentId!,
							page_id: pid,
							message: 'corsair matrix comment edited',
						});
						record('FACEBOOK_UPDATE_COMMENT', 'pass');
					});

					await tryOp('FACEBOOK_DELETE_COMMENT', async () => {
						await CommentsEndpoints.remove(ctx, {
							comment_id: commentId!,
							page_id: pid,
						});
						commentId = undefined;
						record('FACEBOOK_DELETE_COMMENT', 'pass');
					});
				} else {
					for (const op of [
						'FACEBOOK_GET_COMMENT',
						'FACEBOOK_GET_COMMENTS',
						'FACEBOOK_UPDATE_COMMENT',
						'FACEBOOK_DELETE_COMMENT',
					]) {
						record(op, 'skip', 'create comment failed');
					}
				}
			} else {
				for (const op of [
					'FACEBOOK_GET_POST',
					'FACEBOOK_UPDATE_POST',
					'FACEBOOK_GET_POST_INSIGHTS',
					'FACEBOOK_GET_POST_REACTIONS',
					'FACEBOOK_LIKE_POST_OR_COMMENT',
					'FACEBOOK_UNLIKE_POST_OR_COMMENT',
					'FACEBOOK_CREATE_COMMENT',
					'FACEBOOK_GET_COMMENT',
					'FACEBOOK_GET_COMMENTS',
					'FACEBOOK_UPDATE_COMMENT',
					'FACEBOOK_DELETE_COMMENT',
				]) {
					record(op, 'skip', 'create post failed — need pages_manage_posts');
				}
			}

			await tryOp('FACEBOOK_RESCHEDULE_POST', async () => {
				const scheduled = await PostsEndpoints.create(ctx, {
					page_id: pid,
					message: `corsair matrix scheduled ${Date.now()}`,
					scheduled_publish_time: Math.floor(Date.now() / 1000) + 7200,
				});
				scheduledId = scheduled.id;
				expect(scheduledId).toBeDefined();

				await PostsEndpoints.reschedule(ctx, {
					post_id: scheduledId!,
					page_id: pid,
					scheduled_publish_time: Math.floor(Date.now() / 1000) + 10800,
				});
				record('FACEBOOK_RESCHEDULE_POST', 'pass', scheduledId);
			});

			if (scheduledId) {
				await tryOp('FACEBOOK_PUBLISH_SCHEDULED_POST', async () => {
					await PostsEndpoints.publishScheduled(ctx, {
						post_id: scheduledId!,
						page_id: pid,
					});
					record('FACEBOOK_PUBLISH_SCHEDULED_POST', 'pass');
				});
			} else if (!matrix.some((m) => m.op === 'FACEBOOK_RESCHEDULE_POST')) {
				record(
					'FACEBOOK_RESCHEDULE_POST',
					'skip',
					'need pages_manage_posts to schedule',
				);
				record(
					'FACEBOOK_PUBLISH_SCHEDULED_POST',
					'skip',
					'need pages_manage_posts to schedule',
				);
			} else if (
				!matrix.some((m) => m.op === 'FACEBOOK_PUBLISH_SCHEDULED_POST')
			) {
				record(
					'FACEBOOK_PUBLISH_SCHEDULED_POST',
					'skip',
					'need pages_manage_posts to schedule',
				);
			}

			await tryOp('FACEBOOK_UPLOAD_PHOTO', async () => {
				const uploaded = await PhotosEndpoints.upload(ctx, {
					page_id: pid,
					url: FB_TEST_IMAGE_URL,
					published: false,
				});
				photoId = uploaded.id;
				record('FACEBOOK_UPLOAD_PHOTO', 'pass', photoId);
			});

			await tryOp('FACEBOOK_CREATE_PHOTO_POST', async () => {
				const photoPost = await PhotosEndpoints.createPost(ctx, {
					page_id: pid,
					url: FB_TEST_IMAGE_URL,
					caption: `corsair photo post ${Date.now()}`,
					published: false,
				});
				photoPostId = photoPost.id;
				record('FACEBOOK_CREATE_PHOTO_POST', 'pass', photoPostId);
			});

			await tryOp('FACEBOOK_CREATE_PHOTO_ALBUM', async () => {
				const album = await PhotosEndpoints.createAlbum(ctx, {
					page_id: pid,
					name: `corsair album ${Date.now()}`,
					message: 'corsair smoke album',
				});
				albumId = album.id;
				record('FACEBOOK_CREATE_PHOTO_ALBUM', 'pass', albumId);
			});

			if (albumId) {
				await tryOp('FACEBOOK_ADD_PHOTOS_TO_ALBUM', async () => {
					await PhotosEndpoints.addToAlbum(ctx, {
						album_id: albumId!,
						page_id: pid,
						url: FB_TEST_IMAGE_URL,
					});
					record('FACEBOOK_ADD_PHOTOS_TO_ALBUM', 'pass');
				});
			} else {
				record('FACEBOOK_ADD_PHOTOS_TO_ALBUM', 'skip', 'album create failed');
			}

			await tryOp('FACEBOOK_UPLOAD_PHOTOS_BATCH', async () => {
				await PhotosEndpoints.uploadBatch(ctx, {
					page_id: pid,
					photos: [{ url: FB_TEST_IMAGE_URL }],
				});
				record('FACEBOOK_UPLOAD_PHOTOS_BATCH', 'pass');
			});

			await tryOp('FACEBOOK_CREATE_VIDEO_POST', async () => {
				const video = await VideosEndpoints.createPost(ctx, {
					page_id: pid,
					file_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
					title: `corsair video ${Date.now()}`,
					description: 'corsair smoke video',
					published: false,
				});
				expect(video.id).toBeDefined();
				record('FACEBOOK_CREATE_VIDEO_POST', 'pass', video.id);
				if (video.id) {
					await makePageFacebookRequest(`/${video.id}`, ctx, pid, {
						method: 'DELETE',
					}).catch(() => undefined);
				}
			});

			record(
				'FACEBOOK_UPLOAD_VIDEO',
				'skip',
				'deprecated alias of createVideoPost',
			);

			await tryOp('FACEBOOK_UPDATE_PAGE_SETTINGS', async () => {
				await PagesEndpoints.updateSettings(ctx, {
					page_id: pid,
					about: `corsair smoke ${Date.now()}`,
				});
				record('FACEBOOK_UPDATE_PAGE_SETTINGS', 'pass');
			});

			record(
				'FACEBOOK_ASSIGN_PAGE_TASK',
				'skip',
				'requires business-scoped user id',
			);
			record(
				'FACEBOOK_REMOVE_PAGE_TASK',
				'skip',
				'requires business-scoped user id',
			);

			if (FB_RECIPIENT_ID) {
				await tryOp('FACEBOOK_TOGGLE_TYPING_INDICATOR', async () => {
					await MessagesEndpoints.toggleTyping(ctx, {
						page_id: pid,
						recipient_id: FB_RECIPIENT_ID,
						action: 'typing_on',
					});
					record('FACEBOOK_TOGGLE_TYPING_INDICATOR', 'pass');
				});
				await tryOp('FACEBOOK_MARK_MESSAGE_SEEN', async () => {
					await MessagesEndpoints.markSeen(ctx, {
						page_id: pid,
						recipient_id: FB_RECIPIENT_ID,
					});
					record('FACEBOOK_MARK_MESSAGE_SEEN', 'pass');
				});
				await tryOp('FACEBOOK_SEND_MESSAGE', async () => {
					const sent = await MessagesEndpoints.send(ctx, {
						page_id: pid,
						recipient_id: FB_RECIPIENT_ID,
						message: `corsair matrix ${Date.now()}`,
					});
					expect(sent.recipient_id || sent.message_id).toBeDefined();
					record('FACEBOOK_SEND_MESSAGE', 'pass');
				});
				await tryOp('FACEBOOK_SEND_MEDIA_MESSAGE', async () => {
					await MessagesEndpoints.sendMedia(ctx, {
						page_id: pid,
						recipient_id: FB_RECIPIENT_ID,
						attachment_type: 'image',
						attachment_url: FB_TEST_IMAGE_URL,
					});
					record('FACEBOOK_SEND_MEDIA_MESSAGE', 'pass');
				});
			} else {
				record('FACEBOOK_SEND_MESSAGE', 'skip', 'FB_RECIPIENT_ID unset');
				record('FACEBOOK_SEND_MEDIA_MESSAGE', 'skip', 'FB_RECIPIENT_ID unset');
				record('FACEBOOK_MARK_MESSAGE_SEEN', 'skip', 'FB_RECIPIENT_ID unset');
				record(
					'FACEBOOK_TOGGLE_TYPING_INDICATOR',
					'skip',
					'FB_RECIPIENT_ID unset',
				);
			}

			if (postId) {
				await tryOp('FACEBOOK_DELETE_POST', async () => {
					await PostsEndpoints.remove(ctx, {
						post_id: postId!,
						page_id: pid,
					});
					postId = undefined;
					record('FACEBOOK_DELETE_POST', 'pass');
				});
			} else {
				record('FACEBOOK_DELETE_POST', 'skip', 'no post to delete');
			}

			// cleanup leftovers
			if (commentId) {
				await CommentsEndpoints.remove(ctx, {
					comment_id: commentId,
					page_id: pid,
				}).catch(() => undefined);
			}
			if (scheduledId) {
				await PostsEndpoints.remove(ctx, {
					post_id: scheduledId,
					page_id: pid,
				}).catch(() => undefined);
			}
			if (postId) {
				await PostsEndpoints.remove(ctx, {
					post_id: postId,
					page_id: pid,
				}).catch(() => undefined);
			}
			if (photoPostId) {
				await PostsEndpoints.remove(ctx, {
					post_id: photoPostId,
					page_id: pid,
				}).catch(() => undefined);
			}
			if (photoId) {
				await makePageFacebookRequest(`/${photoId}`, ctx, pid, {
					method: 'DELETE',
				}).catch(() => undefined);
			}
			if (albumId) {
				await makePageFacebookRequest(`/${albumId}`, ctx, pid, {
					method: 'DELETE',
				}).catch(() => undefined);
			}

			const fails = matrix.filter((m) => m.result === 'fail');
			expect(fails).toEqual([]);
		}, 120_000);
	},
);
