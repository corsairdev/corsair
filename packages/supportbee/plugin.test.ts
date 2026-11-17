import { AuthMissingError } from 'corsair/core';
import {
	supportbee,
	supportbeeAuthConfig,
	supportbeeEndpointSchemas,
} from './index';

const OPERATIONS = [
	'attachments.create',
	'comments.create',
	'comments.list',
	'drafts.create',
	'drafts.delete',
	'drafts.get',
	'drafts.update',
	'emails.create',
	'emails.list',
	'filters.create',
	'filters.createConsequence',
	'filters.createRule',
	'labels.list',
	'replies.create',
	'replies.get',
	'replies.list',
	'reports.avgFirstResponseTime',
	'reports.repliesCount',
	'reports.ticketsCount',
	'snippets.create',
	'snippets.delete',
	'snippets.list',
	'snippets.update',
	'teams.list',
	'tickets.addLabel',
	'tickets.archive',
	'tickets.assignTeam',
	'tickets.assignUser',
	'tickets.audit',
	'tickets.create',
	'tickets.delete',
	'tickets.get',
	'tickets.list',
	'tickets.markAnswered',
	'tickets.markSpam',
	'tickets.markUnanswered',
	'tickets.removeLabel',
	'tickets.search',
	'tickets.trash',
	'tickets.unarchive',
	'tickets.unassignTeam',
	'tickets.unassignUser',
	'tickets.unmarkSpam',
	'tickets.untrash',
	'users.addMember',
	'users.create',
	'users.get',
	'users.list',
	'users.listMembers',
	'users.update',
] as const;

/**
 * Nested `group -> function` maps, as the plugin registers them.
 * unknown: only the keys are walked, so the handler leaf type is never used.
 */
type NestedMap = Record<string, Record<string, unknown>>;

function flatten(tree: NestedMap): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(tree)) {
		for (const name of Object.keys(members)) paths.push(`${group}.${name}`);
	}
	return paths.sort();
}

/**
 * unknown: `endpoints` and `endpointMeta` are optionals on `CorsairPlugin`, so
 * the assertions widen them one cast at a time.
 */
function asNested(value: unknown): NestedMap {
	return value as NestedMap;
}

describe('supportbee plugin definition', () => {
	const plugin = supportbee();
	// unknown: same widening as `asNested`, for the meta map.
	const meta = plugin.endpointMeta as unknown as Record<
		string,
		{ riskLevel: string; description: string; irreversible?: boolean }
	>;

	it('registers as supportbee with api_key auth', () => {
		expect(plugin.id).toBe('supportbee');
		expect(plugin.options?.authType).toBe('api_key');
		expect(Object.keys(supportbeeAuthConfig)).toEqual(['api_key']);
	});

	it('declares the desk company as an account field', () => {
		// SupportBee has no shared API host, so the resolver reads it per account.
		expect([...supportbeeAuthConfig.api_key.account]).toContain('company');
	});

	it('declares no inbound webhooks', () => {
		expect(plugin.webhooks).toEqual({});
		// SupportBee posts to a URL configured in its dashboard and signs
		// nothing, so there is no secret to verify.
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: {} })).toBe(
			false,
		);
	});

	it('registers exactly the fifty operations', () => {
		expect(flatten(asNested(plugin.endpoints))).toEqual([...OPERATIONS]);
		expect(OPERATIONS).toHaveLength(50);
	});

	it('gives every operation a risk level', () => {
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS]);
		for (const entry of Object.values(meta)) {
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
		}
	});

	it('puts the reads on reads and the writes on writes', () => {
		const reads = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'read')
			.map(([name]) => name)
			.sort();

		expect(reads).toEqual([
			'comments.list',
			'drafts.get',
			'emails.list',
			'labels.list',
			'replies.get',
			'replies.list',
			'reports.avgFirstResponseTime',
			'reports.repliesCount',
			'reports.ticketsCount',
			'snippets.list',
			'teams.list',
			'tickets.audit',
			'tickets.get',
			'tickets.list',
			'tickets.search',
			'users.get',
			'users.list',
			'users.listMembers',
		]);
	});

	it('marks only the three permanent deletes destructive and irreversible', () => {
		const irreversible = Object.entries(meta)
			.filter(([, entry]) => entry.irreversible)
			.map(([name]) => name)
			.sort();

		expect(irreversible).toEqual([
			'drafts.delete',
			'snippets.delete',
			'tickets.delete',
		]);
		// Trashing a ticket is reversible, so it stays a plain write.
		expect(meta['tickets.trash']?.riskLevel).toBe('write');
	});

	it('marks the operations that email people destructive', () => {
		// R8: a reply, a ticket that can notify its requester, and a new agent's
		// invitation all reach a real person.
		for (const name of ['replies.create', 'tickets.create', 'users.create']) {
			expect(meta[name]?.riskLevel).toBe('destructive');
		}
		expect(meta['replies.create']?.description).toMatch(/real customer/);
		expect(meta['replies.create']?.description).toMatch(/real customer/);
		expect(meta['comments.create']?.description).toMatch(/requester is not/);
	});

	it('says that deleting a ticket needs the trash first', () => {
		expect(meta['tickets.delete']?.description).toMatch(/trashed/);
	});

	it('describes every operation in a full sentence', () => {
		for (const [name, entry] of Object.entries(meta)) {
			expect(entry.description.length).toBeGreaterThan(20);
			if (/delete$/.test(name)) {
				expect(entry.riskLevel).toBe('destructive');
			}
		}
	});

	it('has an input and output schema for every operation', () => {
		expect(Object.keys(supportbeeEndpointSchemas).sort()).toEqual([
			...OPERATIONS,
		]);
		for (const schemas of Object.values(supportbeeEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('rejects a page number below one', () => {
		const list = supportbeeEndpointSchemas['tickets.list'];
		expect(list.input.safeParse({ page: 1 }).success).toBe(true);
		expect(list.input.safeParse({ page: 0 }).success).toBe(false);
	});

	it('caps per_page at the documented hundred', () => {
		const list = supportbeeEndpointSchemas['tickets.list'];
		expect(list.input.safeParse({ per_page: 100 }).success).toBe(true);
		expect(list.input.safeParse({ per_page: 101 }).success).toBe(false);
	});

	it('requires an id on every ticket action', () => {
		for (const name of [
			'tickets.delete',
			'tickets.archive',
			'tickets.unarchive',
			'tickets.markAnswered',
			'tickets.markUnanswered',
			'tickets.markSpam',
			'tickets.unmarkSpam',
			'tickets.trash',
			'tickets.untrash',
			'tickets.unassignUser',
			'tickets.unassignTeam',
		] as const) {
			expect(supportbeeEndpointSchemas[name].input.safeParse({}).success).toBe(
				false,
			);
			expect(
				supportbeeEndpointSchemas[name].input.safeParse({ id: 1 }).success,
			).toBe(true);
		}
	});

	it('requires a reply or comment body', () => {
		expect(
			supportbeeEndpointSchemas['replies.create'].input.safeParse({
				ticket_id: 1,
			}).success,
		).toBe(false);
		expect(
			supportbeeEndpointSchemas['replies.create'].input.safeParse({
				ticket_id: 1,
				content: { text: 'hi' },
			}).success,
		).toBe(true);
	});

	it('takes a string, not an array, for the draft recipients', () => {
		// The document says comma-separated string on this route only.
		const draft = supportbeeEndpointSchemas['drafts.create'];
		expect(
			draft.input.safeParse({
				ticket_id: 1,
				content: { text: 'hi' },
				cc: 'a@example.com,b@example.com',
			}).success,
		).toBe(true);
		expect(
			draft.input.safeParse({
				ticket_id: 1,
				content: { text: 'hi' },
				cc: ['a@example.com'],
			}).success,
		).toBe(false);
	});

	it('requires a name on a user but not an email', () => {
		const create = supportbeeEndpointSchemas['users.create'];
		// A customer group has no email, and the document marks only name.
		expect(
			create.input.safeParse({ name: 'Group', type: 'customer_group' }).success,
		).toBe(true);
		expect(create.input.safeParse({ email: 'a@example.com' }).success).toBe(
			false,
		);
	});

	it('requires a query on ticket search', () => {
		const search = supportbeeEndpointSchemas['tickets.search'];
		expect(search.input.safeParse({ query: 'printer' }).success).toBe(true);
		expect(search.input.safeParse({ query: '' }).success).toBe(false);
		expect(search.input.safeParse({}).success).toBe(false);
	});

	it('keeps DEFAULT last when a caller adds a handler', () => {
		const custom = supportbee({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});

		expect(names.at(-1)).toBe('DEFAULT');
		expect(names.indexOf('QUOTA_ERROR')).toBeLessThan(names.indexOf('DEFAULT'));
	});
});

describe('supportbee key builder', () => {
	function ctx(stored: string | null, company: string | null = 'acme') {
		return {
			authType: 'api_key' as const,
			options: {},
			tenantId: 'default',
			keys: {
				get_api_key: jest.fn().mockResolvedValue(stored),
				get_company: jest.fn().mockResolvedValue(company),
			},
		};
	}

	it('prefers an explicit key without reading the store', async () => {
		const fixture = ctx('stored');

		const key = await supportbee({ key: 'explicit' }).keyBuilder?.(
			fixture as never,
			'endpoint',
		);

		expect(key).toBe('explicit');
		expect(fixture.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('falls back to the stored token', async () => {
		await expect(
			supportbee().keyBuilder?.(ctx('stored') as never, 'endpoint'),
		).resolves.toBe('stored');
	});

	it('throws AuthMissingError when a token is stored without a company', async () => {
		// The desk is the other half of a connection. Only an AuthMissingError
		// from the key builder gets the tenant a connect link, so a missing
		// company must not surface later as a plain error from the endpoint.
		await expect(
			supportbee().keyBuilder?.(ctx('stored', null) as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			supportbee().keyBuilder?.(ctx('stored', '  ') as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('takes the company from the plugin option without reading the store', async () => {
		const fixture = ctx('stored', null);

		await expect(
			supportbee({ company: 'acme' }).keyBuilder?.(
				fixture as never,
				'endpoint',
			),
		).resolves.toBe('stored');
		expect(fixture.keys.get_company).not.toHaveBeenCalled();
	});

	it('throws AuthMissingError when no token is stored', async () => {
		await expect(
			supportbee().keyBuilder?.(ctx(null) as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError, not a TypeError, with no key manager', async () => {
		// A context built without a key manager has no `keys` at all, so reading
		// it would TypeError before the auth error could be raised.
		const bare = {
			authType: 'api_key' as const,
			options: {},
			tenantId: 'default',
		};

		await expect(
			supportbee().keyBuilder?.(bare as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses a webhook source', async () => {
		await expect(
			supportbee().keyBuilder?.(ctx('stored') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
