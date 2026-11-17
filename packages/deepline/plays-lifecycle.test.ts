import { logEventFromContext } from 'corsair/core';
import * as plays from './endpoints/plays';
import type { DeeplineContext } from './index';
import { playsMeta, playsSchemas } from './registry-plays';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));
const fetchMock = jest.fn();
const originalFetch = global.fetch;
const ctx = {
	key: 'tenant-resolved-key',
	database: {},
	options: { key: 'wrong-option-key' },
} as DeeplineContext;
// Response bodies are arbitrary JSON fixtures, including deliberately malformed
// ones, so the helper takes unknown; a stricter type would block those cases.
function reply(value: unknown, status = 200) {
	return new Response(JSON.stringify(value), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}
beforeEach(() => {
	jest.clearAllMocks();
	fetchMock.mockReset();
	global.fetch = fetchMock;
});
afterAll(() => {
	global.fetch = originalFetch;
});
function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return { url: new URL(url), init };
}

// Response fixtures follow the SDK types; cost, paths, versions and trigger
// inventory match envelopes read from the live API on 2026-11-17.
const settingsResult = {
	playDefinitionId: 'def-1',
	ownerUserId: 'user-1',
	ownerName: 'Pat Doe',
	settings: {
		path: { root: 'team', folders: ['Research'] },
		displayName: null,
	},
};
const triggerView = {
	name: 'my play',
	playDefinitionId: 'def-1',
	liveRevisionId: 'rev-2',
	liveVersion: 2,
	readOnly: null,
	cron: {
		bindingId: 'bind-cron',
		schedule: '0 9 * * 1-5',
		timezone: 'America/New_York',
		input: { domain: 'example.com' },
		status: 'active',
		nextScheduledAt: 1794904632389,
		lastScheduledAt: null,
		blockedReasonCode: null,
		blockedReason: null,
	},
	webhook: {
		bindingId: 'bind-hook',
		url: 'https://code.deepline.com/api/v2/webhooks/plays/abc',
		status: 'active',
		auth: { type: 'hmac', secretEnv: 'HOOK_SECRET' },
	},
};
const shareStatus = {
	playName: 'my play',
	share: {
		shareSlug: 'slug',
		orgSlug: 'acme',
		publishedRevisionId: 'rev-2',
		publishedVersion: 2,
		visibility: 'unlisted',
		seoIndexing: 'noindex',
		showAverageDeeplineCost: true,
		showAverageLatency: false,
		publicPath: '/p/acme/my-play',
		canonicalPath: '/p/acme/my-play/v/2',
		createdAt: 1,
		updatedAt: 2,
	},
	publishedCopy: { headline: 'Find emails' },
	revisions: [
		{
			revisionId: 'rev-2',
			version: 2,
			isLive: true,
			isWorking: true,
			isPublished: true,
			hasMap: true,
			hasCard: true,
			createdAt: 1,
		},
	],
};
const encoded = 'my%20play%2F%3F%23';
const weird = 'my play/?#';

type Case = {
	name: keyof typeof playsSchemas;
	call: () => Promise<unknown>;
	method: string;
	path: string;
	query?: Record<string, string>;
	body?: unknown;
	response: unknown;
};
const cases: Case[] = [
	{
		name: 'plays.cost',
		call: () =>
			plays.cost(ctx, {
				name: 'prebuilt/company-domain-to-linkedin-employees-harvestapi',
			}),
		method: 'GET',
		path: '/api/v2/plays/prebuilt%2Fcompany-domain-to-linkedin-employees-harvestapi/cost',
		response: {
			reference: 'prebuilt/company-domain-to-linkedin-employees-harvestapi',
			costEstimate: {
				status: 'available',
				source: 'observed',
				unit: 'row',
				lowCredits: 0.0334,
				highCredits: 0.0334,
				sampleRunCount: 49,
				basedOnRunId: null,
				modelVersion: 'define-play-cost-paths-v4',
			},
			observedCost: {
				status: 'available',
				unit: 'row',
				avgCredits: 0.0334,
				maxCredits: 0.78,
				medianCredits: 0.0364,
				sampleRunCount: 49,
				windowDays: 30,
				computedAt: '2026-11-17T00:53:44.529Z',
				displayText: '0.0334 avg',
			},
		},
	},
	{
		name: 'plays.paths',
		call: () =>
			plays.paths(ctx, { root: 'team', limit: 5, cursor: 'next page' }),
		method: 'GET',
		path: '/api/v2/plays/settings/paths',
		query: { root: 'team', limit: '5', cursor: 'next page' },
		response: {
			paths: [
				{
					path: { root: 'team', folders: ['Research'] },
					ownerUserId: 'user-1',
					ownerName: 'Pat',
					playName: 'find-emails',
				},
				{ path: null, ownerUserId: null, ownerName: null, playName: 'p2' },
			],
			cursor: null,
			hasMore: false,
			roots: [{ value: 'person', label: 'Personal', description: 'x' }],
		},
	},
	{
		name: 'plays.pin',
		call: () => plays.pin(ctx, { name: weird, pinned: true }),
		method: 'POST',
		path: `/api/v2/plays/${encoded}/pin`,
		body: { pinned: true },
		response: { name: weird, pinned: true },
	},
	{
		name: 'plays.delete',
		call: () => plays.delete(ctx, { name: weird }),
		method: 'DELETE',
		path: `/api/v2/plays/${encoded}`,
		response: {
			archived: true,
			alreadyArchived: false,
			name: weird,
			archivedBindingCount: 2,
		},
	},
	{
		name: 'plays.restore',
		call: () => plays.restore(ctx, { name: weird }),
		method: 'POST',
		path: `/api/v2/plays/${encoded}/restore`,
		body: {},
		response: { restored: true, alreadyActive: false, name: weird },
	},
	{
		name: 'plays.clearHistory',
		call: () =>
			plays.clearHistory(ctx, {
				name: weird,
				tableNamespaces: ['result.rows'],
			}),
		method: 'POST',
		path: `/api/v2/plays/${encoded}/history/clear`,
		body: { tableNamespaces: ['result.rows'] },
		response: { playName: weird, deletedRuns: 3, droppedTables: ['t1'] },
	},
	{
		name: 'plays.settings.get',
		call: () => plays.settings.get(ctx, { name: weird }),
		method: 'GET',
		path: `/api/v2/plays/${encoded}/settings`,
		response: settingsResult,
	},
	{
		name: 'plays.settings.update',
		call: () =>
			plays.settings.update(ctx, {
				name: weird,
				path: { root: 'team', folders: ['Research'] },
				displayName: 'Find emails',
			}),
		method: 'PATCH',
		path: `/api/v2/plays/${encoded}/settings`,
		body: {
			path: { root: 'team', folders: ['Research'] },
			displayName: 'Find emails',
		},
		response: settingsResult,
	},
	{
		name: 'plays.versions.list',
		call: () => plays.versions.list(ctx, { name: weird, full: true }),
		method: 'GET',
		path: `/api/v2/plays/${encoded}/versions`,
		query: { full: 'true' },
		response: {
			playName: weird,
			definitionName: weird,
			revisionWindow: { order: 'newest_first', complete: true },
			versions: [
				{
					_id: 'rev-2',
					version: 2,
					artifactHash: 'abc',
					description: null,
					createdAt: 1,
					updatedAt: 1,
					isLive: true,
					isWorking: true,
				},
			],
		},
	},
	{
		name: 'plays.versions.publish',
		call: () =>
			plays.versions.publish(ctx, { name: weird, revisionId: 'rev-2' }),
		method: 'POST',
		path: `/api/v2/plays/${encoded}/live`,
		body: { revisionId: 'rev-2' },
		response: { success: true, name: weird, liveVersion: 2 },
	},
	{
		name: 'plays.triggers.get',
		call: () => plays.triggers.get(ctx, { name: weird }),
		method: 'GET',
		path: `/api/v2/plays/${encoded}/triggers`,
		response: triggerView,
	},
	{
		name: 'plays.triggers.update',
		call: () =>
			plays.triggers.update(ctx, {
				name: weird,
				expectedRevisionId: 'rev-1',
				cron: {
					schedule: '0 9 * * 1-5',
					timezone: 'America/New_York',
					input: { domain: 'example.com' },
				},
				webhook: {
					auth: {
						type: 'standard-webhooks',
						headerFamily: 'svix',
						signingSecrets: ['HOOK_SECRET'],
						toleranceSeconds: 300,
					},
				},
			}),
		method: 'PUT',
		path: `/api/v2/plays/${encoded}/triggers`,
		body: {
			expectedRevisionId: 'rev-1',
			cron: {
				schedule: '0 9 * * 1-5',
				timezone: 'America/New_York',
				input: { domain: 'example.com' },
			},
			webhook: {
				auth: {
					type: 'standard-webhooks',
					headerFamily: 'svix',
					signingSecrets: ['HOOK_SECRET'],
					toleranceSeconds: 300,
				},
			},
		},
		response: {
			changed: true,
			revisionId: 'rev-2',
			version: 2,
			triggers: triggerView,
		},
	},
	{
		name: 'plays.triggers.inventory',
		call: () => plays.triggers.inventory(ctx, { cursor: 'c1' }),
		method: 'GET',
		path: '/api/v2/plays/triggers',
		query: { view: 'inventory', cursor: 'c1' },
		response: {
			page: [
				{
					bindingId: 'bind-cron',
					name: 'find-emails',
					type: 'cron',
					status: 'active',
					cron: '0 9 * * *',
					timezone: null,
					nextScheduledAt: 1,
				},
			],
			continueCursor: 'c2',
			isDone: true,
			pageStatus: null,
			splitCursor: null,
		},
	},
	{
		name: 'plays.triggers.history',
		call: () =>
			plays.triggers.history(ctx, { bindingId: 'bind-cron', limit: 5 }),
		method: 'GET',
		path: '/api/v2/plays/triggers',
		query: { view: 'history', binding_id: 'bind-cron', history_limit: '5' },
		response: {
			recentRuns: [
				{
					workflowId: 'play/find-emails/run/1',
					runId: null,
					status: 'completed',
					createdAt: 1,
					startedAt: 2,
					finishedAt: null,
				},
			],
			truncated: false,
			cronInput: { domain: 'example.com' },
		},
	},
	{
		name: 'plays.share.get',
		call: () => plays.share.get(ctx, { name: weird, revisionId: 'rev-1' }),
		method: 'GET',
		path: `/api/v2/plays/${encoded}/share`,
		query: { revisionId: 'rev-1' },
		response: shareStatus,
	},
	{
		name: 'plays.share.publish',
		call: () =>
			plays.share.publish(ctx, {
				name: weird,
				revisionId: 'rev-2',
				acknowledgedUnlisted: true,
				seoIndexing: 'noindex',
				showAverageDeeplineCost: true,
			}),
		method: 'POST',
		path: `/api/v2/plays/${encoded}/share`,
		body: {
			revisionId: 'rev-2',
			acknowledgedUnlisted: true,
			seoIndexing: 'noindex',
			showAverageDeeplineCost: true,
		},
		response: { ...shareStatus, warning: null },
	},
	{
		name: 'plays.share.update',
		call: () =>
			plays.share.update(ctx, { name: weird, showAverageLatency: false }),
		method: 'PATCH',
		path: `/api/v2/plays/${encoded}/share`,
		body: { showAverageLatency: false },
		response: shareStatus,
	},
	{
		name: 'plays.share.unpublish',
		call: () => plays.share.unpublish(ctx, { name: weird }),
		method: 'DELETE',
		path: `/api/v2/plays/${encoded}/share`,
		response: {
			playName: weird,
			share: null,
			publishedCopy: null,
			revisions: [],
		},
	},
	{
		name: 'plays.share.regenerate',
		call: () => plays.share.regenerate(ctx, { name: weird }),
		method: 'POST',
		path: `/api/v2/plays/${encoded}/share/regenerate`,
		body: {},
		response: shareStatus,
	},
];

describe('Deepline Play lifecycle, triggers and share contracts', () => {
	it.each(cases)(
		'$name sends the documented request and validates the result',
		async (test) => {
			fetchMock.mockResolvedValueOnce(reply(test.response));
			expect(await test.call()).toEqual(test.response);
			const { url, init } = lastRequest();
			expect(url.origin).toBe('https://code.deepline.com');
			expect(url.pathname).toBe(test.path);
			expect(init.method).toBe(test.method);
			expect(new Headers(init.headers).get('Authorization')).toBe(
				'Bearer tenant-resolved-key',
			);
			expect(Object.fromEntries(url.searchParams)).toEqual(test.query ?? {});
			// Exact body equality: the path name and unset fields never leak in.
			if (test.body === undefined) expect(init.body).toBeUndefined();
			else expect(JSON.parse(String(init.body))).toEqual(test.body);
			expect(new Headers(init.headers).get('Idempotency-Key')).toBeNull();
			expect(logEventFromContext).toHaveBeenCalledWith(
				ctx,
				`deepline.${test.name}`,
				{},
				'completed',
			);
		},
	);
	it('covers every op in the registry, and meta matches schemas', () => {
		expect(cases.map((t) => t.name).sort()).toEqual(
			Object.keys(playsSchemas).sort(),
		);
		expect(Object.keys(playsMeta).sort()).toEqual(
			Object.keys(playsSchemas).sort(),
		);
	});
	it.each(cases)('$name rejects a malformed success response', async (test) => {
		fetchMock.mockResolvedValueOnce(reply({ unrelated: true }));
		await expect(test.call()).rejects.toThrow();
		expect(logEventFromContext).not.toHaveBeenCalled();
	});
	it('keeps the existing plays ops in place', () => {
		for (const op of ['run', 'list', 'activity', 'get'] as const)
			expect(typeof plays[op]).toBe('function');
	});
	it('sends null to remove a trigger and omits untouched ones', async () => {
		fetchMock.mockResolvedValueOnce(
			reply({
				changed: false,
				revisionId: null,
				version: null,
				triggers: triggerView,
			}),
		);
		await plays.triggers.update(ctx, { name: 'p', cron: null });
		expect(JSON.parse(String(lastRequest().init.body))).toEqual({ cron: null });
		fetchMock.mockResolvedValueOnce(
			reply({
				changed: true,
				revisionId: 'r',
				version: 3,
				triggers: triggerView,
			}),
		);
		await plays.triggers.update(ctx, {
			name: 'p',
			webhook: {
				auth: {
					type: 'hmac',
					secretEnv: 'HOOK_SECRET',
					header: 'X-Sig',
					signaturePrefix: 'sha256=',
				},
			},
		});
		expect(JSON.parse(String(lastRequest().init.body))).toEqual({
			webhook: {
				auth: {
					type: 'hmac',
					secretEnv: 'HOOK_SECRET',
					header: 'X-Sig',
					signaturePrefix: 'sha256=',
				},
			},
		});
		fetchMock.mockResolvedValueOnce(
			reply({
				changed: true,
				revisionId: 'r',
				version: 4,
				triggers: triggerView,
			}),
		);
		await plays.triggers.update(ctx, { name: 'p', webhook: {} });
		expect(JSON.parse(String(lastRequest().init.body))).toEqual({
			webhook: {},
		});
	});
	it('maps settings patches: null path, folders default, empty display name', async () => {
		fetchMock.mockResolvedValue(reply(settingsResult));
		await plays.settings.update(ctx, { name: 'p', path: null });
		expect(JSON.parse(String(lastRequest().init.body))).toEqual({ path: null });
		fetchMock.mockResolvedValue(reply(settingsResult));
		await plays.settings.update(ctx, { name: 'p', path: { root: 'team' } });
		expect(JSON.parse(String(lastRequest().init.body))).toEqual({
			path: { root: 'team', folders: [] },
		});
		fetchMock.mockResolvedValue(reply(settingsResult));
		await plays.settings.update(ctx, { name: 'p', displayName: '  ' });
		expect(JSON.parse(String(lastRequest().init.body))).toEqual({
			displayName: null,
		});
	});
	it('omits optional query and body fields when unset', async () => {
		fetchMock.mockResolvedValueOnce(reply({ versions: [] }));
		await plays.versions.list(ctx, { name: 'p', full: false });
		expect(lastRequest().url.search).toBe('');
		fetchMock.mockResolvedValueOnce(reply({ success: true, name: 'p' }));
		await plays.versions.publish(ctx, { name: 'p' });
		expect(JSON.parse(String(lastRequest().init.body))).toEqual({});
		fetchMock.mockResolvedValueOnce(
			reply({ playName: 'p', deletedRuns: 0, droppedTables: [] }),
		);
		await plays.clearHistory(ctx, { name: 'p' });
		expect(JSON.parse(String(lastRequest().init.body))).toEqual({});
		fetchMock.mockResolvedValueOnce(
			reply({ page: [], continueCursor: 'x', isDone: true }),
		);
		await plays.triggers.inventory(ctx, {});
		expect(Object.fromEntries(lastRequest().url.searchParams)).toEqual({
			view: 'inventory',
		});
		fetchMock.mockResolvedValueOnce(reply(shareStatus));
		await plays.share.get(ctx, { name: 'p' });
		expect(lastRequest().url.search).toBe('');
	});
	it('accepts an unavailable cost estimate', async () => {
		const value = {
			reference: 'p',
			costEstimate: {
				status: 'unavailable',
				reason: 'unbounded_loop',
				message: 'Loop has no bound',
				modelVersion: 'v4',
			},
		};
		fetchMock.mockResolvedValueOnce(reply(value));
		expect(await plays.cost(ctx, { name: 'p' })).toEqual(value);
	});
	it('validates inputs before HTTP', async () => {
		const invalid: Array<() => Promise<unknown>> = [
			() => plays.cost(ctx, { name: '..' }),
			() => plays.delete(ctx, { name: '.' }),
			() => plays.share.get(ctx, { name: '..' }),
			() => plays.settings.update(ctx, { name: 'p' }),
			() =>
				plays.settings.update(ctx, {
					name: 'p',
					path: { root: 'team', folders: ['a/b'] },
				}),
			() =>
				plays.settings.update(ctx, {
					name: 'p',
					path: { root: 'team', folders: [' padded'] },
				}),
			() =>
				plays.settings.update(ctx, {
					name: 'p',
					// @ts-expect-error root must be person or team
					path: { root: 'org' },
				}),
			() => plays.triggers.update(ctx, { name: 'p' }),
			() => plays.triggers.update(ctx, { name: 'p', cron: { schedule: '' } }),
			() =>
				plays.triggers.update(ctx, {
					name: 'p',
					webhook: { auth: { type: 'hmac', secretEnv: 'lowercase' } },
				}),
			() =>
				plays.triggers.update(ctx, {
					name: 'p',
					webhook: {
						auth: {
							type: 'standard-webhooks',
							headerFamily: 'standard',
							signingSecrets: [],
						},
					},
				}),
			() =>
				plays.triggers.update(ctx, {
					name: 'p',
					webhook: {
						auth: {
							type: 'standard-webhooks',
							headerFamily: 'standard',
							signingSecrets: ['S1'],
							toleranceSeconds: 3601,
						},
					},
				}),
			() =>
				plays.triggers.update(ctx, {
					name: 'p',
					// @ts-expect-error raw secret values are not accepted
					webhook: { auth: { type: 'hmac', secretEnv: 'S1', secret: 'x' } },
				}),
			() => plays.triggers.history(ctx, { bindingId: 'b', limit: 31 }),
			() => plays.triggers.history(ctx, { bindingId: '' }),
			() => plays.paths(ctx, { limit: 101 }),
			() =>
				plays.share.publish(ctx, {
					name: 'p',
					revisionId: 'r',
					// @ts-expect-error publishing must be acknowledged
					acknowledgedUnlisted: false,
				}),
			() => plays.share.update(ctx, { name: 'p' }),
			// @ts-expect-error unknown fields are rejected
			() => plays.pin(ctx, { name: 'p', pinned: true, extra: 1 }),
		];
		for (const call of invalid) await expect(call()).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('classifies risk: reads read, irreversible or public changes destructive', () => {
		const destructive = [
			'plays.delete',
			'plays.clearHistory',
			'plays.versions.publish',
			'plays.triggers.update',
			'plays.share.publish',
			'plays.share.unpublish',
			'plays.share.regenerate',
		];
		const write = [
			'plays.pin',
			'plays.restore',
			'plays.settings.update',
			'plays.share.update',
		];
		for (const [name, entry] of Object.entries(playsMeta))
			expect(entry.riskLevel).toBe(
				destructive.includes(name)
					? 'destructive'
					: write.includes(name)
						? 'write'
						: 'read',
			);
	});
});
