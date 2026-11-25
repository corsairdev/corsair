import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { twitterGeneratedEndpointsNested } from './endpoints/catalog';
import { twitterOperationFor } from './endpoints/openapi-schema';
import { authProblem, fileNameFor } from './endpoints/operations';
import * as Tweets from './endpoints/tweets';
import type { TwitterContext } from './index';
import { buildCtx, mockFetch } from './test-helpers';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

const mockedLogEvent = jest.mocked(logEventFromContext);

// `unknown` because the endpoint tree holds functions of many input types.
type AnyEndpoint = (ctx: TwitterContext, input: unknown) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = twitterGeneratedEndpointsNested;
	for (const part of id.split('.')) {
		node = (node as Record<string, unknown>)[part];
	}
	if (typeof node !== 'function') throw new Error(`no endpoint ${id}`);
	return node as AnyEndpoint;
}

const realFetch = global.fetch;
afterEach(() => {
	global.fetch = realFetch;
	mockedLogEvent.mockReset();
});

describe('generated operations', () => {
	it('users.me calls GET https://api.x.com/2/users/me with the user token', async () => {
		const { sent } = mockFetch({
			body: {
				data: {
					id: '2244994945',
					name: 'X Developers',
					username: 'XDevelopers',
				},
			},
		});
		const result = await endpointFor('users.me')(buildCtx(), {
			'user.fields': ['created_at', 'public_metrics'],
		});
		expect(sent).toHaveLength(1);
		expect(sent[0]!.method).toBe('GET');
		expect(sent[0]!.url).toBe(
			'https://api.x.com/2/users/me?user.fields=created_at%2Cpublic_metrics',
		);
		expect(sent[0]!.headers.authorization).toBe('Bearer x-user-token');
		expect(result).toEqual({
			data: { id: '2244994945', name: 'X Developers', username: 'XDevelopers' },
		});
		// Only the operation id is logged, never the inputs or the result.
		expect(mockedLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'twitter.operation',
			{ operationId: 'users.me' },
			'completed',
		);
	});

	it('posts.search.recent joins list parameters with commas and keeps unknown response fields', async () => {
		const { sent } = mockFetch({
			body: {
				data: [{ id: '1', text: 'hello', edit_history_tweet_ids: ['1'] }],
				meta: {
					result_count: 1,
					newest_id: '1',
					oldest_id: '1',
					next_token: 'b26v89c19zqg8o3f',
				},
				extra_field_x_adds_later: true,
			},
		});
		const result = (await endpointFor('posts.search.recent')(buildCtx(), {
			query: 'from:XDevelopers -is:retweet',
			max_results: 10,
			'post.fields': ['created_at', 'public_metrics'],
			expansions: ['author_id'],
		})) as { meta: { next_token: string }; extra_field_x_adds_later: boolean };
		const url = new URL(sent[0]!.url);
		expect(url.origin + url.pathname).toBe(
			'https://api.x.com/2/tweets/search/recent',
		);
		expect(url.searchParams.get('query')).toBe('from:XDevelopers -is:retweet');
		expect(url.searchParams.get('max_results')).toBe('10');
		expect(url.searchParams.get('post.fields')).toBe(
			'created_at,public_metrics',
		);
		expect(url.searchParams.get('expansions')).toBe('author_id');
		expect(result.meta.next_token).toBe('b26v89c19zqg8o3f');
		expect(result.extra_field_x_adds_later).toBe(true);
	});

	it('users.getByUsername puts the username in the path, encoded', async () => {
		const { sent } = mockFetch({
			body: { data: { id: '1', name: 'n', username: 'XDevelopers' } },
		});
		await endpointFor('users.getByUsername')(buildCtx(), {
			username: 'XDevelopers',
		});
		expect(sent[0]!.url).toBe(
			'https://api.x.com/2/users/by/username/XDevelopers',
		);
	});

	it('refuses a path value that would leave its route, before anything is sent', async () => {
		const { fetchMock } = mockFetch();
		await expect(
			endpointFor('users.get')(buildCtx(), { id: '../me' }),
		).rejects.toThrow(/Invalid input for twitter users\.get: id/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('directMessages.sendToParticipant POSTs the JSON body to the participant route', async () => {
		const { sent } = mockFetch({
			status: 201,
			body: { data: { dm_conversation_id: '123-456', dm_event_id: '789' } },
		});
		const result = await endpointFor('directMessages.sendToParticipant')(
			buildCtx(),
			{
				participant_id: '2244994945',
				text: 'Thanks for trying the beta!',
			},
		);
		expect(sent[0]!.method).toBe('POST');
		expect(sent[0]!.url).toBe(
			'https://api.x.com/2/dm_conversations/with/2244994945/messages',
		);
		expect(sent[0]!.headers['content-type']).toBe('application/json');
		expect(sent[0]!.body).toEqual({ text: 'Thanks for trying the beta!' });
		expect(result).toEqual({
			data: { dm_conversation_id: '123-456', dm_event_id: '789' },
		});
	});

	it('directMessages.sendToParticipant needs text or attachments', async () => {
		const { fetchMock } = mockFetch();
		await expect(
			endpointFor('directMessages.sendToParticipant')(buildCtx(), {
				participant_id: '2244994945',
			}),
		).rejects.toThrow(/set at least one of: text, attachments/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('posts.create sends X field names and nested objects as JSON', async () => {
		const { sent } = mockFetch({
			status: 201,
			body: { data: { id: '42', text: 'hi' } },
		});
		await endpointFor('posts.create')(buildCtx(), {
			text: 'hi',
			reply: { in_reply_to_tweet_id: '1460323737035677698' },
		});
		expect(sent[0]!.url).toBe('https://api.x.com/2/tweets');
		expect(sent[0]!.body).toEqual({
			text: 'hi',
			reply: { in_reply_to_tweet_id: '1460323737035677698' },
		});
	});

	it('posts.delete sends DELETE with the id in the path', async () => {
		const { sent } = mockFetch({ body: { data: { deleted: true } } });
		const result = await endpointFor('posts.delete')(buildCtx(), {
			id: '1460323737035677698',
		});
		expect(sent[0]!.method).toBe('DELETE');
		expect(sent[0]!.url).toBe('https://api.x.com/2/tweets/1460323737035677698');
		expect(result).toEqual({ data: { deleted: true } });
	});

	it('media.upload.single turns a file input into base64 in the JSON body', async () => {
		const { sent } = mockFetch({
			body: {
				data: { id: '1880028106020515840', media_key: '3_1880028106020515840' },
			},
		});
		await endpointFor('media.upload.single')(buildCtx(), {
			media: {
				base64: Buffer.from('png-bytes').toString('base64'),
				filename: 'a.png',
			},
			media_category: 'tweet_image',
		});
		expect(sent[0]!.url).toBe('https://api.x.com/2/media/upload');
		expect(sent[0]!.body).toEqual({
			media: Buffer.from('png-bytes').toString('base64'),
			media_category: 'tweet_image',
		});
	});

	it('compliance.jobs.upload sends the file as the raw body', async () => {
		const ctx = buildCtx({ authType: 'api_key' });
		const { sent } = mockFetch({ body: { data: {} } });
		await endpointFor('compliance.jobs.upload')(ctx, {
			id: '1460323737035677698',
			token: 'signed-upload-token',
			file: {
				base64: Buffer.from('1\n2\n').toString('base64'),
				filename: 'ids.txt',
			},
		});
		expect(sent[0]!.method).toBe('PUT');
		expect(sent[0]!.url).toBe(
			'https://api.x.com/2/compliance/jobs/1460323737035677698/upload?token=signed-upload-token',
		);
		expect(sent[0]!.headers['content-type']).toBe('application/octet-stream');
		expect(sent[0]!.body).toBeInstanceOf(Blob);
		expect(await (sent[0]!.body as Blob).text()).toBe('1\n2\n');
	});

	it('directMessages.media.download returns the bytes as a file output', async () => {
		mockFetch({
			bytes: new Uint8Array([1, 2, 3]),
			headers: { 'content-type': 'image/jpeg' },
		});
		const result = (await endpointFor('directMessages.media.download')(
			buildCtx(),
			{
				dm_id: '1',
				media_id: '2',
				resource_id: '3',
			},
		)) as { filename?: string; contentType?: string };
		expect(result.filename).toBe('2');
		expect(result.contentType).toBe('image/jpeg');
	});

	it('reports a token of the wrong kind before sending anything', async () => {
		const { fetchMock } = mockFetch();
		await expect(
			endpointFor('usage.get')(buildCtx({ authType: 'oauth_2' }), {}),
		).rejects.toThrow(/app-only auth on usage\.get/);
		await expect(
			endpointFor('users.me')(buildCtx({ authType: 'api_key' }), {}),
		).rejects.toThrow(/user's OAuth 2\.0 token for users\.me/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("usage.get runs with the app's Bearer token", async () => {
		const ctx = {
			...buildCtx({ authType: 'api_key' }),
			key: 'x-app-bearer',
		} as TwitterContext;
		const { sent } = mockFetch({
			body: { data: { project_usage: '12', project_cap: '1000' } },
		});
		await endpointFor('usage.get')(ctx, { days: 7 });
		expect(sent[0]!.url).toBe('https://api.x.com/2/usage/tweets?days=7');
		expect(sent[0]!.headers.authorization).toBe('Bearer x-app-bearer');
	});

	it('raises ApiError with the status and X reason, without the sent text', async () => {
		mockFetch({
			status: 403,
			body: {
				title: 'Forbidden',
				detail: 'You are not permitted to perform this action.',
				type: 'about:blank',
				status: 403,
			},
		});
		const error = await endpointFor('directMessages.sendToParticipant')(
			buildCtx(),
			{
				participant_id: '2244994945',
				text: 'a private message only the recipient should read',
			},
		).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(ApiError);
		const apiError = error as ApiError;
		expect(apiError.status).toBe(403);
		expect(apiError.message).toBe(
			'X 403: You are not permitted to perform this action.',
		);
		expect(JSON.stringify(apiError.request)).not.toContain('private message');
		expect(JSON.stringify(apiError.request)).not.toContain('x-user-token');
	});

	it('rejects a response that is not the documented shape', async () => {
		mockFetch({ body: { data: 'not an object' } });
		await expect(endpointFor('users.me')(buildCtx(), {})).rejects.toThrow(
			/X users\.me response did not match its documented schema: data/,
		);
	});
});

describe('legacy tweets endpoints', () => {
	it('tweets.create maps camelCase inputs to X fields and saves the post', async () => {
		const upsert = jest.fn();
		const ctx = {
			...buildCtx(),
			db: { tweets: { upsertByEntityId: upsert } },
		} as unknown as TwitterContext;
		const { sent } = mockFetch({
			status: 201,
			body: { data: { id: '42', text: 'hello' } },
		});
		const result = await Tweets.create(ctx, {
			text: 'hello',
			quoteTweetId: '7',
			mediaIds: ['m1'],
			replySettings: 'following',
		});
		expect(sent[0]!.url).toBe('https://api.x.com/2/tweets');
		expect(sent[0]!.body).toEqual({
			text: 'hello',
			quote_tweet_id: '7',
			media: { media_ids: ['m1'] },
			reply_settings: 'following',
		});
		expect(result).toEqual({ data: { id: '42', text: 'hello' } });
		expect(upsert).toHaveBeenCalledWith('42', { id: '42', text: 'hello' });
	});

	it('tweets.createReply posts a reply', async () => {
		const { sent } = mockFetch({
			status: 201,
			body: { data: { id: '43', text: 'thanks' } },
		});
		await Tweets.createReply(buildCtx(), {
			text: 'thanks',
			inReplyToTweetId: '42',
			excludeReplyUserIds: ['9'],
		});
		expect(sent[0]!.body).toEqual({
			text: 'thanks',
			reply: { in_reply_to_tweet_id: '42', exclude_reply_user_ids: ['9'] },
		});
	});
});

describe('helpers', () => {
	it('authProblem follows the spec security of each route', () => {
		expect(
			authProblem(twitterOperationFor('posts.search.recent'), 'oauth_2'),
		).toBeUndefined();
		expect(
			authProblem(twitterOperationFor('posts.search.recent'), 'api_key'),
		).toBeUndefined();
		expect(
			authProblem(twitterOperationFor('compliance.jobs.list'), 'oauth_2'),
		).toMatch(/app-only/);
		expect(
			authProblem(twitterOperationFor('directMessages.events.list'), 'api_key'),
		).toMatch(/user/);
	});

	it('names downloaded files after the call', () => {
		expect(fileNameFor('compliance.jobs.downloadResults', { id: '9' })).toBe(
			'compliance-job-9.json',
		);
		expect(fileNameFor('chat.media.download', { media_hash_key: 'abc' })).toBe(
			'abc',
		);
	});
});
