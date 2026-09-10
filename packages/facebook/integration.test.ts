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
 * Live Graph matrix for all FACEBOOK_* ops.
 *
 *   FB_ACCESS_TOKEN=... \
 *   FB_PAGE_ID=... \              # optional; auto from /me/accounts
 *   FB_RECIPIENT_ID=... \         # optional Messenger smoke
 *   FB_TEST_VIDEO_URL=... \       # optional; slow Graph video upload
 *   pnpm --filter @corsair-dev/facebook exec jest integration.test.ts --runInBand --forceExit
 */

const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const FB_RECIPIENT_ID = process.env.FB_RECIPIENT_ID;
const FB_TEST_IMAGE_URL =
	process.env.FB_TEST_IMAGE_URL ??
	'https://www.facebook.com/images/fb_icon_325x325.png';
/** Optional — video upload is slow; set to a public mp4 URL to exercise createVideoPost. */
const FB_TEST_VIDEO_URL = process.env.FB_TEST_VIDEO_URL;

type OpResult = 'pass' | 'skip' | 'fail';
const matrix: Array<{ op: string; result: OpResult; detail?: string }> = [];

function record(op: string, result: OpResult, detail?: string) {
	matrix.push({ op, result, detail });
}

function errMsg(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}

/** Auth / permission denials only — not invalid params (#100) or capability (#3). */
function isPermissionError(message: string): boolean {
	const lower = message.toLowerCase();
	return (
		lower.includes('(#10)') ||
		lower.includes('(#200)') ||
		lower.includes('(#190)') ||
		lower.includes('permission') ||
		lower.includes('not authorized') ||
		lower.includes('pages_manage_posts') ||
		lower.includes('pages_read_engagement') ||
		lower.includes('app review')
	);
}

function isDeprecatedPageSearchError(message: string): boolean {
	const lower = message.toLowerCase();
	return (
		lower.includes('(#10)') ||
		lower.includes('workplace') ||
		lower.includes('page public content access') ||
		lower.includes('page public metadata access')
	);
}

/** Meta throttle / "reduce the amount of data" during a heavy live matrix. */
function isTransientGraphError(message: string): boolean {
	const lower = message.toLowerCase();
	return (
		lower.includes('reduce the amount of data') ||
		lower.includes('request limit') ||
		lower.includes('too many calls') ||
		lower.includes('rate limit') ||
		lower.includes('(#4)') ||
		lower.includes('(#17)') ||
		lower.includes('(#613)') ||
		lower.includes('(#80004)')
	);
}

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function tryOp(
	op: string,
	fn: () => Promise<string | undefined | void>,
): Promise<void> {
	try {
		const detail = await fn();
		if (!matrix.some((m) => m.op === op)) {
			record(op, 'pass', detail || undefined);
		}
	} catch (error) {
		const msg = errMsg(error);
		if (matrix.some((m) => m.op === op)) return;
		if (isPermissionError(msg) || isTransientGraphError(msg)) {
			record(op, 'skip', msg);
			return;
		}
		record(op, 'fail', msg);
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

		it('runs the full FACEBOOK_* op matrix', async () => {
			await tryOp('FACEBOOK_GET_CURRENT_USER', async () => {
				const me = await UsersEndpoints.getCurrentUser(ctx, {});
				expect(me.id).toBeDefined();
				return me.id;
			});

			await tryOp('FACEBOOK_GET_USER_PAGES', async () => {
				const pages = await UsersEndpoints.getUserPages(ctx, { limit: 10 });
				expect(Array.isArray(pages.data)).toBe(true);
				return `count=${pages.data?.length ?? 0}`;
			});

			await tryOp('FACEBOOK_LIST_MANAGED_PAGES', async () => {
				const pages = await UsersEndpoints.listManagedPages(ctx, {
					limit: 10,
				});
				expect(Array.isArray(pages.data)).toBe(true);
				return `count=${pages.data?.length ?? 0}`;
			});

			await tryOp('FACEBOOK_SEARCH_PAGES', async () => {
				try {
					const result = await PagesEndpoints.search(ctx, {
						q: 'facebook',
						limit: 3,
					});
					expect(Array.isArray(result.data)).toBe(true);
					return `count=${result.data?.length ?? 0}`;
				} catch (error) {
					const msg = errMsg(error);
					if (isDeprecatedPageSearchError(msg) || isPermissionError(msg)) {
						record('FACEBOOK_SEARCH_PAGES', 'skip', msg);
						return;
					}
					throw error;
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

			try {
				await tryOp('FACEBOOK_GET_PAGE_DETAILS', async () => {
					const details = await PagesEndpoints.getDetails(ctx, {
						page_id: pid,
					});
					expect(details.id).toBe(pid);
				});

				await tryOp('FACEBOOK_GET_PAGE_POSTS', async () => {
					const feed = await PostsEndpoints.list(ctx, {
						page_id: pid,
						limit: 5,
					});
					expect(Array.isArray(feed.data)).toBe(true);
					return `count=${feed.data?.length ?? 0}`;
				});

				await tryOp('FACEBOOK_GET_SCHEDULED_POSTS', async () => {
					const scheduled = await PostsEndpoints.listScheduled(ctx, {
						page_id: pid,
						limit: 5,
					});
					expect(Array.isArray(scheduled.data)).toBe(true);
					return `count=${scheduled.data?.length ?? 0}`;
				});

				await tryOp('FACEBOOK_GET_PAGE_TAGGED_POSTS', async () => {
					const tagged = await PostsEndpoints.listTagged(ctx, {
						page_id: pid,
						limit: 5,
					});
					expect(Array.isArray(tagged.data)).toBe(true);
					return `count=${tagged.data?.length ?? 0}`;
				});

				await tryOp('FACEBOOK_GET_PAGE_PHOTOS', async () => {
					const photos = await PhotosEndpoints.list(ctx, {
						page_id: pid,
						limit: 5,
					});
					expect(Array.isArray(photos.data)).toBe(true);
					return `count=${photos.data?.length ?? 0}`;
				});

				await tryOp('FACEBOOK_GET_PAGE_VIDEOS', async () => {
					const videos = await VideosEndpoints.list(ctx, {
						page_id: pid,
						limit: 5,
					});
					expect(Array.isArray(videos.data)).toBe(true);
					return `count=${videos.data?.length ?? 0}`;
				});

				await tryOp('FACEBOOK_GET_PAGE_ROLES', async () => {
					const roles = await PagesEndpoints.getRoles(ctx, {
						page_id: pid,
					});
					expect(Array.isArray(roles.data)).toBe(true);
					return `count=${roles.data?.length ?? 0}`;
				});

				await tryOp('FACEBOOK_GET_PAGE_INSIGHTS', async () => {
					const insights = await PagesEndpoints.getInsights(ctx, {
						page_id: pid,
						metric: ['page_follows'],
						period: 'day',
					});
					expect(Array.isArray(insights.data)).toBe(true);
				});

				await tryOp('FACEBOOK_GET_PAGE_CONVERSATIONS', async () => {
					const conversations = await ConversationsEndpoints.list(ctx, {
						page_id: pid,
						limit: 5,
					});
					expect(Array.isArray(conversations.data)).toBe(true);

					const first = conversations.data?.[0]?.id;
					if (!first) {
						record(
							'FACEBOOK_GET_CONVERSATION_MESSAGES',
							'skip',
							'no conversations',
						);
						record('FACEBOOK_GET_MESSAGE_DETAILS', 'skip', 'no conversations');
						return `count=${conversations.data?.length ?? 0}`;
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
						return `count=${conversations.data?.length ?? 0}`;
					}
					const detailsMsg = await MessagesEndpoints.getDetails(ctx, {
						message_id: mid,
						page_id: pid,
					});
					expect(detailsMsg.id).toBeDefined();
					record('FACEBOOK_GET_MESSAGE_DETAILS', 'pass');
					return `count=${conversations.data?.length ?? 0}`;
				});

				await tryOp('FACEBOOK_CREATE_POST', async () => {
					const created = await PostsEndpoints.create(ctx, {
						page_id: pid,
						message: `corsair matrix post ${Date.now()}`,
						published: false,
					});
					postId = created.id;
					expect(postId).toBeDefined();
					return postId;
				});

				if (postId) {
					await tryOp('FACEBOOK_GET_POST', async () => {
						const got = await PostsEndpoints.get(ctx, {
							post_id: postId!,
							page_id: pid,
						});
						expect(got.id).toBeDefined();
					});

					await tryOp('FACEBOOK_UPDATE_POST', async () => {
						await PostsEndpoints.update(ctx, {
							post_id: postId!,
							page_id: pid,
							message: `corsair matrix edited ${Date.now()}`,
						});
					});

					await tryOp('FACEBOOK_GET_POST_INSIGHTS', async () => {
						await PostsEndpoints.getInsights(ctx, {
							post_id: postId!,
							page_id: pid,
							metric: ['post_clicks'],
						});
					});

					await tryOp('FACEBOOK_GET_POST_REACTIONS', async () => {
						const reactions = await PostsEndpoints.getReactions(ctx, {
							post_id: postId!,
							page_id: pid,
						});
						expect(Array.isArray(reactions.data)).toBe(true);
					});

					await tryOp('FACEBOOK_LIKE_POST_OR_COMMENT', async () => {
						await ReactionsEndpoints.add(ctx, {
							object_id: postId!,
							page_id: pid,
						});
					});

					await tryOp('FACEBOOK_UNLIKE_POST_OR_COMMENT', async () => {
						await ReactionsEndpoints.unlike(ctx, {
							object_id: postId!,
							page_id: pid,
						});
					});

					await tryOp('FACEBOOK_CREATE_COMMENT', async () => {
						const comment = await CommentsEndpoints.create(ctx, {
							object_id: postId!,
							page_id: pid,
							message: 'corsair matrix comment',
						});
						commentId = comment.id;
						return commentId;
					});

					if (commentId) {
						await tryOp('FACEBOOK_GET_COMMENT', async () => {
							const got = await CommentsEndpoints.get(ctx, {
								comment_id: commentId!,
								page_id: pid,
							});
							expect(got.id).toBeDefined();
						});

						await tryOp('FACEBOOK_GET_COMMENTS', async () => {
							const listed = await CommentsEndpoints.list(ctx, {
								object_id: postId!,
								page_id: pid,
								limit: 5,
							});
							expect(Array.isArray(listed.data)).toBe(true);
						});

						await tryOp('FACEBOOK_UPDATE_COMMENT', async () => {
							await CommentsEndpoints.update(ctx, {
								comment_id: commentId!,
								page_id: pid,
								message: 'corsair matrix comment edited',
							});
						});

						await tryOp('FACEBOOK_DELETE_COMMENT', async () => {
							await CommentsEndpoints.remove(ctx, {
								comment_id: commentId!,
								page_id: pid,
							});
							commentId = undefined;
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
					return scheduledId;
				});

				if (scheduledId) {
					await tryOp('FACEBOOK_PUBLISH_SCHEDULED_POST', async () => {
						// Brief backoff — Matrix creates many posts; Graph may throttle publish.
						await sleep(1500);
						try {
							await PostsEndpoints.publishScheduled(ctx, {
								post_id: scheduledId!,
								page_id: pid,
							});
						} catch (error) {
							if (!isTransientGraphError(errMsg(error))) throw error;
							await sleep(3000);
							await PostsEndpoints.publishScheduled(ctx, {
								post_id: scheduledId!,
								page_id: pid,
							});
						}
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
					return photoId;
				});

				await tryOp('FACEBOOK_CREATE_PHOTO_POST', async () => {
					const photoPost = await PhotosEndpoints.createPost(ctx, {
						page_id: pid,
						url: FB_TEST_IMAGE_URL,
						caption: `corsair photo post ${Date.now()}`,
						published: false,
					});
					photoPostId = photoPost.id;
					return photoPostId;
				});

				await tryOp('FACEBOOK_CREATE_PHOTO_ALBUM', async () => {
					try {
						const album = await PhotosEndpoints.createAlbum(ctx, {
							page_id: pid,
							name: `corsair album ${Date.now()}`,
							message: 'corsair smoke album',
						});
						albumId = album.id;
						return albumId;
					} catch (error) {
						const msg = errMsg(error);
						// Meta app-level capability gate — not an auth/permission miss.
						if (msg.includes('(#3)')) {
							record('FACEBOOK_CREATE_PHOTO_ALBUM', 'skip', msg);
							return;
						}
						throw error;
					}
				});

				if (albumId) {
					await tryOp('FACEBOOK_ADD_PHOTOS_TO_ALBUM', async () => {
						await PhotosEndpoints.addToAlbum(ctx, {
							album_id: albumId!,
							page_id: pid,
							url: FB_TEST_IMAGE_URL,
						});
					});
				} else {
					record('FACEBOOK_ADD_PHOTOS_TO_ALBUM', 'skip', 'album create failed');
				}

				await tryOp('FACEBOOK_UPLOAD_PHOTOS_BATCH', async () => {
					await PhotosEndpoints.uploadBatch(ctx, {
						page_id: pid,
						photos: [{ url: FB_TEST_IMAGE_URL }],
					});
				});

				if (FB_TEST_VIDEO_URL) {
					await tryOp('FACEBOOK_CREATE_VIDEO_POST', async () => {
						const video = await VideosEndpoints.createPost(ctx, {
							page_id: pid,
							file_url: FB_TEST_VIDEO_URL,
							title: `corsair video ${Date.now()}`,
							description: 'corsair smoke video',
							published: false,
						});
						expect(video.id).toBeDefined();
						if (video.id) {
							await makePageFacebookRequest(`/${video.id}`, ctx, pid, {
								method: 'DELETE',
							}).catch(() => undefined);
						}
						return video.id;
					});
				} else {
					record(
						'FACEBOOK_CREATE_VIDEO_POST',
						'skip',
						'set FB_TEST_VIDEO_URL to exercise (slow Graph upload)',
					);
				}

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
					});
					await tryOp('FACEBOOK_MARK_MESSAGE_SEEN', async () => {
						await MessagesEndpoints.markSeen(ctx, {
							page_id: pid,
							recipient_id: FB_RECIPIENT_ID,
						});
					});
					await tryOp('FACEBOOK_SEND_MESSAGE', async () => {
						const sent = await MessagesEndpoints.send(ctx, {
							page_id: pid,
							recipient_id: FB_RECIPIENT_ID,
							message: `corsair matrix ${Date.now()}`,
						});
						expect(sent.recipient_id || sent.message_id).toBeDefined();
					});
					await tryOp('FACEBOOK_SEND_MEDIA_MESSAGE', async () => {
						await MessagesEndpoints.sendMedia(ctx, {
							page_id: pid,
							recipient_id: FB_RECIPIENT_ID,
							attachment_type: 'image',
							attachment_url: FB_TEST_IMAGE_URL,
						});
					});
				} else {
					record('FACEBOOK_SEND_MESSAGE', 'skip', 'FB_RECIPIENT_ID unset');
					record(
						'FACEBOOK_SEND_MEDIA_MESSAGE',
						'skip',
						'FB_RECIPIENT_ID unset',
					);
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
					});
				} else {
					record('FACEBOOK_DELETE_POST', 'skip', 'no post to delete');
				}
			} finally {
				await Promise.allSettled([
					commentId
						? CommentsEndpoints.remove(ctx, {
								comment_id: commentId,
								page_id: pid,
							})
						: Promise.resolve(),
					scheduledId
						? PostsEndpoints.remove(ctx, {
								post_id: scheduledId,
								page_id: pid,
							})
						: Promise.resolve(),
					postId
						? PostsEndpoints.remove(ctx, {
								post_id: postId,
								page_id: pid,
							})
						: Promise.resolve(),
					photoPostId
						? PostsEndpoints.remove(ctx, {
								post_id: photoPostId,
								page_id: pid,
							})
						: Promise.resolve(),
					photoId
						? makePageFacebookRequest(`/${photoId}`, ctx, pid, {
								method: 'DELETE',
							})
						: Promise.resolve(),
					albumId
						? makePageFacebookRequest(`/${albumId}`, ctx, pid, {
								method: 'DELETE',
							})
						: Promise.resolve(),
				]);
			}

			const fails = matrix.filter((m) => m.result === 'fail');
			expect(fails).toEqual([]);
		}, 180_000);
	},
);
