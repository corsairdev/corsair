import { AuthMissingError } from 'corsair/core';
import { UNIPILE_WRITE_OPERATIONS, WebhookEventTypes } from './endpoints/types';
import {
	LINKEDIN_BUDGET_OPERATIONS,
	RETRY_SAFE_OPERATIONS,
} from './error-handlers';
import { unipile, unipileEndpointSchemas } from './index';

// Operations that send, post or start something visible to other people.
const SENDS = [
	'relationRequests.create',
	'chats.start',
	'inboxes.startChat',
	'messages.send',
	'messages.forward',
	'emails.send',
	'drafts.send',
	'posts.create',
	'posts.createStory',
	'posts.addComment',
	'posts.replyToComment',
	'linkedin.inviteToFollowCompany',
	'linkedin.endorseSkill',
];

// Reads that take a POST body (searches, list browsing) but change nothing.
const POST_READS = [
	'linkedin.searchFromUrl',
	'linkedin.searchPeople',
	'linkedin.searchCompanies',
	'linkedin.searchPosts',
	'linkedin.searchJobs',
	'salesNavigator.searchFromUrl',
	'salesNavigator.searchPeople',
	'salesNavigator.searchCompanies',
	'salesNavigator.browseLeadList',
	'salesNavigator.browseAccountList',
];

const OPERATION_COUNT = 148;

// The key builder only reads authType and keys.
function keyContext(
	fields: { apiKey?: string | null; webhookSecret?: string | null } = {},
) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: {
			get_api_key: jest.fn().mockResolvedValue(fields.apiKey ?? null),
			get_webhook_signature: jest
				.fn()
				.mockResolvedValue(fields.webhookSecret ?? null),
		},
	};
}

function buildKey(
	plugin: ReturnType<typeof unipile>,
	ctx: ReturnType<typeof keyContext>,
	source: 'endpoint' | 'webhook' = 'endpoint',
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, source);
}

function paths(tree: Record<string, Record<string, unknown>>): string[] {
	return Object.entries(tree).flatMap(([group, entries]) =>
		Object.keys(entries).map((name) => `${group}.${name}`),
	);
}

describe('unipile plugin definition', () => {
	const plugin = unipile();
	const meta = plugin.endpointMeta ?? {};
	const levels = Object.fromEntries(
		Object.entries(meta).map(([path, entry]) => [path, entry.riskLevel]),
	);

	it('registers as unipile with API key auth routed by application_id', () => {
		expect(plugin.id).toBe('unipile');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['application_id'] },
		});
	});

	it(`exposes ${OPERATION_COUNT} operations, each with metadata and schemas`, () => {
		const tree = paths(plugin.endpoints ?? {}).sort();
		expect(tree).toHaveLength(OPERATION_COUNT);
		expect(Object.keys(meta).sort()).toEqual(tree);
		expect(Object.keys(unipileEndpointSchemas).sort()).toEqual(tree);
		for (const schemas of Object.values(unipileEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
		for (const [path, entry] of Object.entries(meta)) {
			expect([path, (entry.description?.length ?? 0) > 20]).toEqual([
				path,
				true,
			]);
		}
	});

	it('marks every delete, removal, cancel, trash and unfollow destructive', () => {
		const destructive = Object.keys(levels).filter((path) =>
			/\.(delete\w*|remove\w*|cancel|trash|unfollow)$/.test(path),
		);
		expect(destructive.length).toBeGreaterThan(20);
		for (const path of destructive) {
			expect([path, levels[path]]).toEqual([path, 'destructive']);
		}
		for (const [path, level] of Object.entries(levels)) {
			if (level === 'destructive') expect(destructive).toContain(path);
		}
	});

	it('marks every send, post and create a write', () => {
		const creates = Object.keys(levels).filter((path) =>
			/\.(create\w*|send|start\w*|add\w*|update\w*|edit|forward|follow|pin|mark\w*|modify|respond|restore|save\w*|select\w*|invite\w*|endorse\w*|request|replay|reply\w*|set\w*|solve\w*|resend\w*|visit\w*|accept)$/.test(
				path,
			),
		);
		for (const path of [...SENDS, ...creates]) {
			expect([path, levels[path]]).toEqual([path, 'write']);
		}
		expect(levels['linkedin.request']).toBe('write');
	});

	it('treats searches and list browsing as reads, though they POST', () => {
		for (const path of POST_READS) {
			expect([path, levels[path]]).toEqual([path, 'read']);
		}
	});

	it('says which writes publish or spend credits', () => {
		for (const path of [
			'posts.create',
			'posts.createStory',
			'posts.addComment',
			'posts.replyToComment',
			'users.updateProfile',
		]) {
			expect([path, meta[path as keyof typeof meta]?.description]).toEqual([
				path,
				expect.stringMatching(/public/i),
			]);
		}
		expect(meta['linkedin.inviteToFollowCompany']?.description).toMatch(
			/credits/i,
		);
		expect(meta['linkedin.request']?.description).toMatch(/^Advanced/);
	});

	it('retries after a 5xx or timeout only for reads outside the LinkedIn budget', () => {
		const reads = Object.keys(levels).filter((path) => levels[path] === 'read');
		expect([...RETRY_SAFE_OPERATIONS].sort()).toEqual(
			reads.filter((path) => !LINKEDIN_BUDGET_OPERATIONS.has(path)).sort(),
		);
		for (const path of SENDS) {
			expect(RETRY_SAFE_OPERATIONS.has(path)).toBe(false);
		}
		for (const path of LINKEDIN_BUDGET_OPERATIONS) {
			expect(path in levels).toBe(true);
		}
	});

	it('lists exactly the write and destructive operations as writes', () => {
		// accountsCreateAuthLink -> accounts.createAuthLink
		const dotted = UNIPILE_WRITE_OPERATIONS.map((key) => {
			const path = Object.keys(unipileEndpointSchemas).find(
				(candidate) =>
					candidate.replace('.', '').toLowerCase() === key.toLowerCase(),
			);
			if (!path) throw new Error(`no endpoint for ${key}`);
			return path;
		});
		expect(dotted.sort()).toEqual(
			Object.keys(levels)
				.filter((path) => levels[path] !== 'read')
				.sort(),
		);
	});

	it('declares a webhook for every Unipile event type', () => {
		const webhooks = paths(
			(plugin.webhooks ?? {}) as Record<string, Record<string, unknown>>,
		);
		expect(webhooks).toHaveLength(WebhookEventTypes.length);
		expect(Object.keys(plugin.webhookSchemas ?? {}).sort()).toEqual(
			webhooks.sort(),
		);
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = unipile({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('QUOTA_ERROR');
		expect(names[0]).toBe('UNIPILE_LINKEDIN_LIMIT');
		expect(names.indexOf('QUOTA_ERROR')).toBe(names.length - 2);
	});
});

describe('unipile key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext({ apiKey: 'stored-key' });
		await expect(buildKey(unipile({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(
			buildKey(unipile(), keyContext({ apiKey: 'stored-key' })),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(buildKey(unipile(), keyContext())).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('uses the webhookSecret option, then the stored signature', async () => {
		await expect(
			buildKey(
				unipile({ webhookSecret: 'option-secret' }),
				keyContext({ webhookSecret: 'stored' }),
				'webhook',
			),
		).resolves.toBe('option-secret');
		await expect(
			buildKey(unipile(), keyContext({ webhookSecret: 'stored' }), 'webhook'),
		).resolves.toBe('stored');
	});

	it('returns an empty webhook secret, so verification fails closed', async () => {
		await expect(
			buildKey(unipile({ key: 'option-key' }), keyContext(), 'webhook'),
		).resolves.toBe('');
	});
});
