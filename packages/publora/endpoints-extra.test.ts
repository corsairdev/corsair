/**
 * Covers the operations added after the first version: method, path,
 * headers (Workspace id, Idempotency-Key, Accept), body or query, multipart
 * uploads and the event log. Every 2xx response shape in Publora's OpenAPI
 * (test-data/spec-responses.json, generated from
 * https://docs.publora.com/openapi.json) is run through its operation's
 * output schema. Network access is mocked, so this runs in CI.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { logEventFromContext } from 'corsair/core';
import * as extra from './endpoints/handlers-extra';
import { COMPANY_APPROVAL_ACCEPT } from './endpoints/handlers-extra';
import { isNonIdempotent } from './error-handlers';
import { publoraEndpointMeta, publoraEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Ctx = Parameters<typeof extra.testConnection>[0];

function makeCtx(): Ctx {
	return {
		key: 'sk_test.publora',
		options: {},
		db: {},
		database: undefined,
		$getAccountId: async () => 'test-account',
	} as unknown as Ctx;
}

const HEX = '507f1f77bcf86cd799439011';
const WS = '507f1f77bcf86cd799439022';
const MEDIA = '507f1f77bcf86cd799439033';
const HOOK = '507f1f77bcf86cd799439044';
const CONNECTION = 'linkedin-ABC123';
const URN = 'urn:li:share:7000000000000000000';

type Sent = {
	url: URL;
	method: string;
	headers: Record<string, string>;
	body?: string;
	form?: FormData;
};

let sent: Sent | undefined;
let reply: { body: unknown; contentType: string } = {
	body: { success: true },
	contentType: 'application/json',
};

beforeEach(() => {
	mockLogEvent.mockClear();
	sent = undefined;
	reply = { body: { success: true }, contentType: 'application/json' };
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		const headers: Record<string, string> = {};
		const raw = init?.headers;
		if (raw instanceof Headers) {
			raw.forEach((value, key) => {
				headers[key.toLowerCase()] = value;
			});
		} else {
			for (const [key, value] of Object.entries(
				(raw ?? {}) as Record<string, string>,
			)) {
				headers[key.toLowerCase()] = value;
			}
		}
		sent = {
			url: new URL(String(url)),
			method: init?.method ?? 'GET',
			headers,
			body: typeof init?.body === 'string' ? init.body : undefined,
			form: init?.body instanceof FormData ? init.body : undefined,
		};
		const text =
			typeof reply.body === 'string' ? reply.body : JSON.stringify(reply.body);
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': reply.contentType }),
			json: async () => JSON.parse(text),
			text: async () => text,
		};
	}) as unknown as typeof global.fetch;
});

/** The first 2xx sample from the spec for an operation, as the mock reply. */
type SpecEntry = {
	operationId: string;
	responses: { source: string; status: string; body: unknown }[];
};
const SPEC = JSON.parse(
	readFileSync(join(__dirname, 'test-data', 'spec-responses.json'), 'utf8'),
) as Record<string, SpecEntry>;

type Case = {
	op: string;
	call: (ctx: Ctx) => Promise<unknown>;
	method: string;
	path: string;
	workspace?: boolean;
	keyed?: boolean;
	body?: unknown;
	query?: Record<string, string>;
};

const g = `/api/v1/company/post-groups/${HEX}`;

const CASES: Case[] = [
	{
		op: 'accounts.testConnection',
		call: (c) => extra.testConnection(c, { platformId: CONNECTION }),
		method: 'POST',
		path: `/api/v1/test-connection/${CONNECTION}`,
	},
	{
		op: 'accounts.getPlatformLimits',
		call: (c) => extra.getPlatformLimits(c, {}),
		method: 'GET',
		path: '/api/v1/platform-limits',
	},
	{
		op: 'posts.getLogs',
		call: (c) => extra.getPostLogs(c, { postGroupId: HEX }),
		method: 'GET',
		path: `/api/v1/post-logs/${HEX}`,
	},
	{
		op: 'media.attach',
		call: (c) =>
			extra.attachMedia(c, {
				postGroupId: HEX,
				file: {
					download_url: 'https://files.example.com/a.png',
					file_id: 'file_1',
				},
				idempotencyKey: 'attach-1',
			}),
		method: 'POST',
		path: `/api/v1/attach-media/${HEX}`,
		body: {
			file: {
				download_url: 'https://files.example.com/a.png',
				file_id: 'file_1',
			},
		},
	},
	{
		op: 'webhooks.regenerateSecret',
		call: (c) => extra.regenerateWebhookSecret(c, { id: HOOK }),
		method: 'POST',
		path: `/api/v1/webhooks/${HOOK}/regenerate-secret`,
	},
	{
		op: 'analytics.postStatistics',
		call: (c) =>
			extra.analyticsPostStatistics(c, {
				posts: [
					{
						platform: 'bluesky',
						platformId: 'bluesky-did',
						postedId: 'at://x',
					},
				],
			}),
		method: 'POST',
		path: '/api/v1/post-statistics',
		body: {
			posts: [
				{ platform: 'bluesky', platformId: 'bluesky-did', postedId: 'at://x' },
			],
		},
	},
	{
		op: 'analytics.profileStatistics',
		call: (c) =>
			extra.analyticsProfileStatistics(c, {
				platform: 'mastodon',
				platformId: 'mastodon-1',
			}),
		method: 'POST',
		path: '/api/v1/profile-statistics',
		body: { platform: 'mastodon', platformId: 'mastodon-1' },
	},
	{
		op: 'linkedin.postStatistics',
		call: (c) =>
			extra.linkedinPostStatistics(c, {
				postedId: URN,
				platformId: CONNECTION,
				queryTypes: 'ALL',
			}),
		method: 'POST',
		path: '/api/v1/linkedin-post-statistics',
		body: { postedId: URN, platformId: CONNECTION, queryTypes: 'ALL' },
	},
	{
		op: 'linkedin.accountStatistics',
		call: (c) =>
			extra.linkedinAccountStatistics(c, {
				platformId: CONNECTION,
				aggregation: 'DAILY',
				dateRange: {
					start: { year: 2026, month: 11, day: 1 },
					end: { year: 2026, month: 11, day: 25 },
				},
			}),
		method: 'POST',
		path: '/api/v1/linkedin-account-statistics',
		body: {
			platformId: CONNECTION,
			aggregation: 'DAILY',
			dateRange: {
				start: { year: 2026, month: 11, day: 1 },
				end: { year: 2026, month: 11, day: 25 },
			},
		},
	},
	{
		op: 'linkedin.profileSummary',
		call: (c) => extra.linkedinProfileSummary(c, { platformId: CONNECTION }),
		method: 'POST',
		path: '/api/v1/linkedin-profile-summary',
		body: { platformId: CONNECTION },
	},
	{
		op: 'linkedin.followers',
		call: (c) =>
			extra.linkedinFollowers(c, {
				platformId: CONNECTION,
				period: 'lifetime',
			}),
		method: 'POST',
		path: '/api/v1/linkedin-followers',
		body: { platformId: CONNECTION, period: 'lifetime' },
	},
	{
		op: 'linkedin.mentionables',
		call: (c) => extra.linkedinMentionables(c, { q: 'Jane', limit: 10 }),
		method: 'GET',
		path: '/api/v1/linkedin-mentionables',
		query: { q: 'Jane', limit: '10' },
	},
	{
		op: 'linkedin.addReaction',
		call: (c) =>
			extra.linkedinAddReaction(c, {
				postedId: URN,
				reactionType: 'LIKE',
				platformId: CONNECTION,
			}),
		method: 'POST',
		path: '/api/v1/linkedin-reactions',
		body: { postedId: URN, reactionType: 'LIKE', platformId: CONNECTION },
	},
	{
		op: 'linkedin.removeReaction',
		call: (c) =>
			extra.linkedinRemoveReaction(c, {
				postedId: URN,
				platformId: CONNECTION,
			}),
		method: 'DELETE',
		path: '/api/v1/linkedin-reactions',
		query: { postedId: URN, platformId: CONNECTION },
	},
	{
		op: 'linkedin.reshare',
		call: (c) =>
			extra.linkedinReshare(c, {
				platformId: CONNECTION,
				parent: URN,
				visibility: 'PUBLIC',
			}),
		method: 'POST',
		path: '/api/v1/linkedin-reshare',
		body: { platformId: CONNECTION, parent: URN, visibility: 'PUBLIC' },
	},
	{
		op: 'linkedin.createComment',
		call: (c) =>
			extra.linkedinCreateComment(c, {
				postedId: URN,
				message: 'Thanks!',
				platformId: CONNECTION,
			}),
		method: 'POST',
		path: '/api/v1/linkedin-comments',
		body: { postedId: URN, message: 'Thanks!', platformId: CONNECTION },
	},
	{
		op: 'linkedin.deleteComment',
		call: (c) =>
			extra.linkedinDeleteComment(c, {
				postedId: URN,
				commentId: '7001',
				platformId: CONNECTION,
			}),
		method: 'DELETE',
		path: '/api/v1/linkedin-comments',
		query: { postedId: URN, commentId: '7001', platformId: CONNECTION },
	},
	{
		op: 'company.listContexts',
		call: (c) => extra.companyListContexts(c, {}),
		method: 'GET',
		path: '/api/v1/company/contexts/v2',
	},
	{
		op: 'company.getWorkspaceContext',
		call: (c) =>
			extra.companyGetWorkspaceContext(c, { accountId: HEX, workspaceId: WS }),
		method: 'GET',
		path: `/api/v1/company/accounts/${HEX}/workspaces/${WS}/context`,
	},
	{
		op: 'company.listConnections',
		call: (c) =>
			extra.companyListConnections(c, {
				workspaceId: WS,
				includeLinkedinReconnectRecommended: true,
			}),
		method: 'GET',
		path: '/api/v1/company/connections',
		workspace: true,
		query: { includeLinkedinReconnectRecommended: '1' },
	},
	{
		op: 'company.listPlatforms',
		call: (c) => extra.companyListPlatforms(c, { includeXPremiumLimits: true }),
		method: 'GET',
		path: '/api/v1/company/platforms',
		query: { includeXPremiumLimits: 'true' },
	},
	{
		op: 'company.posts.createDraft',
		call: (c) =>
			extra.companyCreateDraft(c, {
				workspaceId: WS,
				content: 'Launch',
				platforms: [CONNECTION],
			}),
		method: 'POST',
		path: '/api/v1/company/post-groups',
		workspace: true,
		keyed: true,
		body: { content: 'Launch', platforms: [CONNECTION] },
	},
	{
		op: 'company.posts.updateDraft',
		call: (c) =>
			extra.companyUpdateDraft(c, {
				workspaceId: WS,
				postGroupId: HEX,
				notes: 'v2',
			}),
		method: 'PATCH',
		path: g,
		workspace: true,
		keyed: true,
		body: { notes: 'v2' },
	},
	{
		op: 'company.posts.get',
		call: (c) =>
			extra.companyGetPostGroup(c, { workspaceId: WS, postGroupId: HEX }),
		method: 'GET',
		path: g,
		workspace: true,
	},
	{
		op: 'company.posts.schedule',
		call: (c) =>
			extra.companySchedule(c, {
				workspaceId: WS,
				postGroupId: HEX,
				scheduledTime: '2026-12-01T15:00:00.000Z',
				includeValidationDetails: true,
			}),
		method: 'POST',
		path: `${g}/schedule`,
		workspace: true,
		keyed: true,
		body: { scheduledTime: '2026-12-01T15:00:00.000Z' },
		query: { includeValidationDetails: 'true' },
	},
	{
		op: 'company.posts.reschedule',
		call: (c) =>
			extra.companyReschedule(c, {
				workspaceId: WS,
				postGroupId: HEX,
				scheduledTime: '2026-12-02T15:00:00.000Z',
			}),
		method: 'POST',
		path: `${g}/reschedule`,
		workspace: true,
		keyed: true,
		body: { scheduledTime: '2026-12-02T15:00:00.000Z' },
	},
	{
		op: 'company.posts.unschedule',
		call: (c) =>
			extra.companyUnschedule(c, { workspaceId: WS, postGroupId: HEX }),
		method: 'POST',
		path: `${g}/unschedule`,
		workspace: true,
		keyed: true,
		body: {},
	},
	{
		op: 'company.posts.recover',
		call: (c) => extra.companyRecover(c, { workspaceId: WS, postGroupId: HEX }),
		method: 'POST',
		path: `${g}/recover`,
		workspace: true,
		keyed: true,
		body: {},
	},
	{
		op: 'company.posts.getApproval',
		call: (c) =>
			extra.companyGetApproval(c, { workspaceId: WS, postGroupId: HEX }),
		method: 'GET',
		path: `${g}/approval`,
		workspace: true,
	},
	{
		op: 'company.posts.requestApproval',
		call: (c) =>
			extra.companyRequestApproval(c, {
				workspaceId: WS,
				postGroupId: HEX,
				managerComment: 'Please review',
			}),
		method: 'POST',
		path: `${g}/approval`,
		workspace: true,
		keyed: true,
		body: { managerComment: 'Please review' },
	},
	{
		op: 'company.posts.cancelApproval',
		call: (c) =>
			extra.companyCancelApproval(c, { workspaceId: WS, postGroupId: HEX }),
		method: 'DELETE',
		path: `${g}/approval`,
		workspace: true,
		keyed: true,
		body: {},
	},
	{
		op: 'company.posts.retryApprovalNotification',
		call: (c) =>
			extra.companyRetryApprovalNotification(c, {
				workspaceId: WS,
				postGroupId: HEX,
			}),
		method: 'POST',
		path: `${g}/approval/notification`,
		workspace: true,
		body: {},
	},
	{
		op: 'company.posts.listMedia',
		call: (c) =>
			extra.companyListMedia(c, { workspaceId: WS, postGroupId: HEX }),
		method: 'GET',
		path: `${g}/media`,
		workspace: true,
	},
	{
		op: 'company.posts.reserveMedia',
		call: (c) =>
			extra.companyReserveMedia(c, {
				workspaceId: WS,
				postGroupId: HEX,
				fileName: 'a.png',
				contentType: 'image/png',
				sizeBytes: 1024,
			}),
		method: 'POST',
		path: `${g}/media/reservations`,
		workspace: true,
		keyed: true,
		body: { fileName: 'a.png', contentType: 'image/png', sizeBytes: 1024 },
	},
	{
		op: 'company.posts.completeMedia',
		call: (c) =>
			extra.companyCompleteMedia(c, {
				workspaceId: WS,
				postGroupId: HEX,
				mediaFileId: MEDIA,
			}),
		method: 'POST',
		path: `${g}/media/${MEDIA}/complete`,
		workspace: true,
		body: {},
	},
	{
		op: 'company.posts.removeMedia',
		call: (c) =>
			extra.companyRemoveMedia(c, {
				workspaceId: WS,
				postGroupId: HEX,
				mediaFileId: MEDIA,
			}),
		method: 'DELETE',
		path: `${g}/media/${MEDIA}`,
		workspace: true,
	},
	{
		op: 'company.webhooks.list',
		call: (c) => extra.companyListWebhooks(c, { workspaceId: WS }),
		method: 'GET',
		path: '/api/v1/company/webhooks',
		workspace: true,
	},
	{
		op: 'company.webhooks.create',
		call: (c) =>
			extra.companyCreateWebhook(c, {
				workspaceId: WS,
				name: 'Prod',
				url: 'https://example.com/hook',
				events: ['post.published'],
			}),
		method: 'POST',
		path: '/api/v1/company/webhooks',
		workspace: true,
		keyed: true,
		body: {
			name: 'Prod',
			url: 'https://example.com/hook',
			events: ['post.published'],
		},
	},
	{
		op: 'company.webhooks.update',
		call: (c) =>
			extra.companyUpdateWebhook(c, {
				workspaceId: WS,
				webhookId: HOOK,
				isActive: false,
			}),
		method: 'PATCH',
		path: `/api/v1/company/webhooks/${HOOK}`,
		workspace: true,
		keyed: true,
		body: { isActive: false },
	},
	{
		op: 'company.webhooks.delete',
		call: (c) =>
			extra.companyDeleteWebhook(c, { workspaceId: WS, webhookId: HOOK }),
		method: 'DELETE',
		path: `/api/v1/company/webhooks/${HOOK}`,
		workspace: true,
		keyed: true,
		body: {},
	},
	{
		op: 'company.webhooks.regenerateSecret',
		call: (c) =>
			extra.companyRegenerateWebhookSecret(c, {
				workspaceId: WS,
				webhookId: HOOK,
			}),
		method: 'POST',
		path: `/api/v1/company/webhooks/${HOOK}/regenerate-secret`,
		workspace: true,
		keyed: true,
		body: {},
	},
];

/** The 14 operations of the first version, covered in endpoints.test.ts. */
const FIRST_VERSION = [
	'accounts.list',
	'accounts.getContext',
	'posts.create',
	'posts.get',
	'posts.list',
	'posts.update',
	'posts.delete',
	'media.createUpload',
	'media.complete',
	'media.delete',
	'webhooks.list',
	'webhooks.create',
	'webhooks.update',
	'webhooks.delete',
];

const MULTIPART = [
	'media.uploadInstagramCover',
	'media.uploadYoutubeThumbnail',
];

describe('coverage', () => {
	it('every declared operation is tested here or in endpoints.test.ts', () => {
		expect(
			[...FIRST_VERSION, ...MULTIPART, ...CASES.map((c) => c.op)].sort(),
		).toEqual(Object.keys(publoraEndpointSchemas).sort());
	});

	it('every operation of the spec has a response sample (57 routes)', () => {
		expect(Object.keys(SPEC).sort()).toEqual(
			Object.keys(publoraEndpointSchemas).sort(),
		);
		expect(Object.keys(SPEC)).toHaveLength(57);
	});
});

describe('routing', () => {
	for (const c of CASES) {
		it(`${c.op} issues ${c.method} ${c.path}`, async () => {
			const sample = SPEC[c.op]?.responses[0];
			reply = { body: sample?.body, contentType: 'application/json' };
			const ctx = makeCtx();
			await c.call(ctx);

			expect(sent?.method).toBe(c.method);
			expect(sent?.url.pathname).toBe(c.path);
			expect(sent?.headers['x-publora-key']).toBe('sk_test.publora');
			expect(sent?.headers['x-publora-workspace-id']).toBe(
				c.workspace ? WS : undefined,
			);
			if (c.keyed) {
				expect(sent?.headers['idempotency-key']).toMatch(/^[!-+--~]{1,255}$/);
			} else if (c.op !== 'media.attach') {
				expect(sent?.headers['idempotency-key']).toBeUndefined();
			}
			if (c.body === undefined) {
				expect(sent?.body).toBeUndefined();
			} else {
				expect(JSON.parse(sent?.body ?? 'null')).toEqual(c.body);
			}
			expect(Object.fromEntries(sent?.url.searchParams ?? [])).toEqual(
				c.query ?? {},
			);
			expect(mockLogEvent).toHaveBeenCalledWith(
				ctx,
				`publora.${c.op}`,
				expect.any(Object),
				'completed',
			);
		});
	}
});

describe('spec response shapes', () => {
	for (const [op, entry] of Object.entries(SPEC)) {
		for (const [i, response] of entry.responses.entries()) {
			it(`${op} parses the ${response.source} ${response.status} reply (#${i})`, () => {
				const schema =
					publoraEndpointSchemas[op as keyof typeof publoraEndpointSchemas]
						.output;
				const parsed = schema.safeParse(response.body);
				expect(parsed.error?.issues).toBeUndefined();
				expect(parsed.success).toBe(true);
			});
		}
	}
});

describe('company', () => {
	beforeEach(() => {
		reply = {
			body: SPEC['company.posts.createDraft']?.responses[0]?.body,
			contentType: 'application/json',
		};
	});

	it('uses the given Idempotency-Key and generates a fresh one otherwise', async () => {
		const ctx = makeCtx();
		await extra.companyCreateDraft(ctx, {
			workspaceId: WS,
			idempotencyKey: 'draft-42',
		});
		expect(sent?.headers['idempotency-key']).toBe('draft-42');
		expect(JSON.parse(sent?.body ?? 'null')).toEqual({});

		await extra.companyCreateDraft(ctx, { workspaceId: WS });
		const first = sent?.headers['idempotency-key'];
		await extra.companyCreateDraft(ctx, { workspaceId: WS });
		expect(sent?.headers['idempotency-key']).not.toBe(first);
	});

	it('rejects a workspace or post group id that is not a 24-character hex id', async () => {
		const ctx = makeCtx();
		await expect(
			extra.companyListConnections(ctx, { workspaceId: 'abc\r\nx: 1' }),
		).rejects.toThrow();
		await expect(
			extra.companyGetPostGroup(ctx, {
				workspaceId: WS,
				postGroupId: '../webhooks',
			}),
		).rejects.toThrow();
		expect(sent).toBeUndefined();
	});

	it('requires the millisecond UTC form for scheduledTime', async () => {
		await expect(
			extra.companySchedule(makeCtx(), {
				workspaceId: WS,
				postGroupId: HEX,
				scheduledTime: '2026-12-01T15:00:00Z',
			}),
		).rejects.toThrow();
		expect(sent).toBeUndefined();
	});

	it('asks for the approval v2 media type and parses its JSON body', async () => {
		reply = {
			body: JSON.stringify({
				success: true,
				data: {
					postGroupId: HEX,
					status: 'declined',
					requestedAt: '2026-11-25T09:00:00.000Z',
					decidedAt: '2026-11-25T10:00:00.000Z',
					expiresAt: null,
					reviewId: HEX,
					managerComment: null,
					reviewUrl: 'https://review.publora.com/r/abc',
					expired: false,
					decision: { comment: 'Not this week' },
					notificationStatus: 'sent',
				},
			}),
			contentType: 'application/vnd.publora.company-approval.v2+json',
		};
		const result = await extra.companyGetApproval(makeCtx(), {
			workspaceId: WS,
			postGroupId: HEX,
		});
		expect(sent?.headers.accept).toBe(COMPANY_APPROVAL_ACCEPT);
		expect(result.data.status).toBe('declined');
	});

	it('sends includeApproval with the approval media type on posts.get', async () => {
		reply = {
			body: SPEC['company.posts.get']?.responses[0]?.body,
			contentType: 'application/json',
		};
		await extra.companyGetPostGroup(makeCtx(), {
			workspaceId: WS,
			postGroupId: HEX,
			includeApproval: true,
		});
		expect(sent?.url.searchParams.get('includeApproval')).toBe('true');
		expect(sent?.headers.accept).toBe(COMPANY_APPROVAL_ACCEPT);
	});

	it('update webhook needs at least one field', async () => {
		await expect(
			extra.companyUpdateWebhook(makeCtx(), {
				workspaceId: WS,
				webhookId: HOOK,
			}),
		).rejects.toThrow();
	});

	it('keeps draft text out of the event log', async () => {
		const ctx = makeCtx();
		await extra.companyCreateDraft(ctx, {
			workspaceId: WS,
			content: 'Secret launch text',
		});
		const payload = JSON.stringify(mockLogEvent.mock.calls[0]?.[2]);
		expect(payload).not.toContain('Secret launch text');
		expect(payload).toContain('content');
	});
});

describe('linkedin', () => {
	it('refuses a blank comment without an image', async () => {
		await expect(
			extra.linkedinCreateComment(makeCtx(), {
				postedId: URN,
				message: '   ',
				platformId: CONNECTION,
			}),
		).rejects.toThrow();
		expect(sent).toBeUndefined();
	});

	it('takes an empty message with an image', async () => {
		await extra.linkedinCreateComment(makeCtx(), {
			postedId: URN,
			message: '',
			platformId: CONNECTION,
			imageUrl: 'https://cdn.example.com/a.png',
		});
		expect(JSON.parse(sent?.body ?? 'null')).toMatchObject({
			message: '',
			imageUrl: 'https://cdn.example.com/a.png',
		});
	});

	it('keeps comment text out of the event log', async () => {
		const ctx = makeCtx();
		await extra.linkedinCreateComment(ctx, {
			postedId: URN,
			message: 'Private words',
			platformId: CONNECTION,
		});
		expect(JSON.stringify(mockLogEvent.mock.calls[0]?.[2])).not.toContain(
			'Private words',
		);
	});
});

describe('multipart uploads', () => {
	const PNG = Buffer.from('89504e470d0a1a0a', 'hex').toString('base64');

	it('uploadInstagramCover posts the cover and postGroupId as form fields', async () => {
		reply = {
			body: SPEC['media.uploadInstagramCover']?.responses[0]?.body,
			contentType: 'application/json',
		};
		const ctx = makeCtx();
		await extra.uploadInstagramCover(ctx, {
			postGroupId: HEX,
			cover: { base64: PNG, filename: 'cover.png', contentType: 'image/png' },
		});
		expect(sent?.method).toBe('POST');
		expect(sent?.url.pathname).toBe('/api/v1/upload-instagram-cover');
		expect(sent?.form?.get('postGroupId')).toBe(HEX);
		const file = sent?.form?.get('cover') as File;
		expect(file.name).toBe('cover.png');
		expect(file.type).toBe('image/png');
		expect(sent?.headers['content-type']).toBeUndefined();
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'publora.media.uploadInstagramCover',
			{ postGroupId: HEX, contentType: 'image/png' },
			'completed',
		);
	});

	it('uploadYoutubeThumbnail posts the thumbnail field', async () => {
		reply = {
			body: SPEC['media.uploadYoutubeThumbnail']?.responses[0]?.body,
			contentType: 'application/json',
		};
		await extra.uploadYoutubeThumbnail(makeCtx(), {
			postGroupId: HEX,
			thumbnail: {
				base64: PNG,
				filename: 'thumb.png',
				contentType: 'image/png',
			},
		});
		expect(sent?.url.pathname).toBe('/api/v1/upload-youtube-thumbnail');
		expect((sent?.form?.get('thumbnail') as File).name).toBe('thumb.png');
	});
});

describe('endpoint meta', () => {
	const destructive = [
		'webhooks.regenerateSecret',
		'linkedin.reshare',
		'linkedin.createComment',
		'linkedin.deleteComment',
		'company.posts.schedule',
		'company.posts.reschedule',
		'company.posts.retryApprovalNotification',
		'company.posts.removeMedia',
		'company.webhooks.delete',
		'company.webhooks.regenerateSecret',
	];

	it('publishing, sending, deleting and secret rotation are destructive', () => {
		for (const op of destructive) {
			expect([
				op,
				publoraEndpointMeta[op as keyof typeof publoraEndpointMeta].riskLevel,
			]).toEqual([op, 'destructive']);
		}
	});

	it('analytics and lookups stay read', () => {
		for (const op of [
			'analytics.postStatistics',
			'linkedin.postStatistics',
			'linkedin.followers',
			'company.listContexts',
			'company.posts.get',
		] as const) {
			expect(publoraEndpointMeta[op].riskLevel).toBe('read');
		}
	});

	it('5xx and network retries cover exactly the read operations', () => {
		for (const [op, meta] of Object.entries(publoraEndpointMeta)) {
			expect([op, isNonIdempotent(op)]).toEqual([
				op,
				meta.riskLevel !== 'read',
			]);
		}
	});
});
