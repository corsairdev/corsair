import { AuthMissingError } from 'corsair/core';
import {
	surveymonkey,
	surveymonkeyAuthConfig,
	surveymonkeyEndpointSchemas,
} from './index';

const OPERATIONS = [
	'collectors.create',
	'collectors.delete',
	'collectors.get',
	'collectors.list',
	'collectors.update',
	'contactLists.copy',
	'contactLists.create',
	'contactLists.delete',
	'contactLists.get',
	'contactLists.list',
	'contactLists.merge',
	'contactLists.update',
	'contacts.bulkCreate',
	'contacts.create',
	'contacts.delete',
	'contacts.get',
	'contacts.list',
	'contacts.listFields',
	'contacts.update',
	'contacts.updateField',
	'folders.create',
	'folders.list',
	'messages.create',
	'messages.get',
	'messages.list',
	'messages.send',
	'messages.update',
	'pages.create',
	'pages.delete',
	'pages.get',
	'pages.list',
	'pages.update',
	'questions.create',
	'questions.delete',
	'questions.get',
	'questions.list',
	'questions.update',
	'recipients.bulkCreate',
	'recipients.create',
	'recipients.list',
	'responses.create',
	'responses.delete',
	'responses.deleteAll',
	'responses.get',
	'responses.getDetails',
	'responses.list',
	'responses.listBulk',
	'surveys.create',
	'surveys.delete',
	'surveys.get',
	'surveys.getDetails',
	'surveys.list',
	'surveys.listCategories',
	'surveys.listLanguages',
	'surveys.listTemplates',
	'surveys.replace',
	'surveys.update',
	'users.getMe',
	'webhooks.create',
	'webhooks.delete',
	'webhooks.get',
	'webhooks.list',
	'webhooks.update',
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

describe('surveymonkey plugin definition', () => {
	const plugin = surveymonkey();
	// unknown: same widening as `asNested`, for the meta map.
	const meta = plugin.endpointMeta as unknown as Record<
		string,
		{ riskLevel: string; description: string; irreversible?: boolean }
	>;

	it('registers as surveymonkey with oauth_2 auth', () => {
		expect(plugin.id).toBe('surveymonkey');
		expect(plugin.options?.authType).toBe('oauth_2');
		expect(Object.keys(surveymonkeyAuthConfig)).toEqual(['oauth_2']);
	});

	it('declares the api host as an account field', () => {
		// The token exchange reports an access_url per account, so the host can
		// differ and the resolver reads it per account.
		expect([...surveymonkeyAuthConfig.oauth_2.account]).toContain('api_host');
	});

	it('declares the OAuth flow with the documented endpoints', () => {
		expect(plugin.oauthConfig).toEqual({
			providerName: 'SurveyMonkey',
			authUrl: 'https://api.surveymonkey.com/oauth/authorize',
			tokenUrl: 'https://api.surveymonkey.com/oauth/token',
			scopes: [
				'surveys_read',
				'surveys_write',
				'collectors_read',
				'collectors_write',
				'contacts_read',
				'contacts_write',
				'responses_read',
				'responses_read_detail',
				'responses_write',
				'webhooks_read',
				'webhooks_write',
				'users_read',
			],
			tokenAuthMethod: 'body',
			requiresRegisteredRedirect: true,
		});
	});

	it('registers exactly the sixty-three operations', () => {
		expect(flatten(asNested(plugin.endpoints))).toEqual([...OPERATIONS]);
		expect(OPERATIONS).toHaveLength(63);
	});

	it('gives every operation a risk level', () => {
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS]);
		for (const entry of Object.values(meta)) {
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
		}
	});

	it('puts the reads on reads', () => {
		const reads = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'read')
			.map(([name]) => name)
			.sort();

		expect(reads).toEqual([
			'collectors.get',
			'collectors.list',
			'contactLists.get',
			'contactLists.list',
			'contacts.get',
			'contacts.list',
			'contacts.listFields',
			'folders.list',
			'messages.get',
			'messages.list',
			'pages.get',
			'pages.list',
			'questions.get',
			'questions.list',
			'recipients.list',
			'responses.get',
			'responses.getDetails',
			'responses.list',
			'responses.listBulk',
			'surveys.get',
			'surveys.getDetails',
			'surveys.list',
			'surveys.listCategories',
			'surveys.listLanguages',
			'surveys.listTemplates',
			'users.getMe',
			'webhooks.get',
			'webhooks.list',
		]);
	});

	it('marks deleting a survey, a page, a question or a response irreversible', () => {
		const irreversible = Object.entries(meta)
			.filter(([, entry]) => entry.irreversible)
			.map(([name]) => name)
			.sort();

		expect(irreversible).toEqual([
			'collectors.delete',
			'contactLists.delete',
			'contactLists.merge',
			'contacts.delete',
			'pages.delete',
			'questions.delete',
			'responses.delete',
			'responses.deleteAll',
			'surveys.delete',
			'webhooks.delete',
		]);
	});

	it('says that sending a message mails real people', () => {
		// Sending is `write` like every other send in the catalog, so the
		// description is where an agent learns that it leaves the building.
		expect(meta['messages.send']?.riskLevel).toBe('destructive');
		expect(meta['messages.send']?.description).toMatch(/mails real people/);
		// Drafting one must not read as a send.
		expect(meta['messages.create']?.description).toMatch(
			/Nothing is sent until send is called/,
		);
	});

	it('says that a response create is data entry, not a mailing', () => {
		expect(meta['responses.create']?.description).toMatch(
			/Nothing is mailed to a respondent/,
		);
	});

	it('describes every operation in a full sentence', () => {
		for (const entry of Object.values(meta)) {
			expect(entry.description.length).toBeGreaterThan(20);
		}
	});

	it('has an input and output schema for every operation', () => {
		expect(Object.keys(surveymonkeyEndpointSchemas).sort()).toEqual([
			...OPERATIONS,
		]);
		for (const schemas of Object.values(surveymonkeyEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('rejects a sort field the vendor does not list', () => {
		const list = surveymonkeyEndpointSchemas['surveys.list'];
		expect(list.input.safeParse({ sort_by: 'title' }).success).toBe(true);
		expect(list.input.safeParse({ sort_by: 'nickname' }).success).toBe(false);
	});

	it('rejects a page below one', () => {
		const list = surveymonkeyEndpointSchemas['surveys.list'];
		expect(list.input.safeParse({ page: 1 }).success).toBe(true);
		expect(list.input.safeParse({ page: 0 }).success).toBe(false);
	});

	it('caps per_page the way the bulk route documents', () => {
		const bulk = surveymonkeyEndpointSchemas['responses.listBulk'];
		expect(
			bulk.input.safeParse({ survey_id: '1', per_page: 1000 }).success,
		).toBe(true);
		expect(
			bulk.input.safeParse({ survey_id: '1', per_page: 1001 }).success,
		).toBe(false);
	});

	it('requires the survey id on every response route', () => {
		for (const name of [
			'responses.list',
			'responses.listBulk',
			'responses.get',
			'responses.getDetails',
			'responses.delete',
		] as const) {
			expect(
				surveymonkeyEndpointSchemas[name].input.safeParse({}).success,
			).toBe(false);
		}
		// The create route hangs off a collector instead.
		expect(
			surveymonkeyEndpointSchemas['responses.create'].input.safeParse({
				collector_id: '1',
			}).success,
		).toBe(true);
	});

	it('accepts only the documented response statuses', () => {
		const list = surveymonkeyEndpointSchemas['responses.list'];
		expect(
			list.input.safeParse({ survey_id: '1', status: 'disqualified' }).success,
		).toBe(true);
		expect(
			list.input.safeParse({ survey_id: '1', status: 'deleted' }).success,
		).toBe(false);
	});

	it('accepts only a weblink or email collector on create', () => {
		const create = surveymonkeyEndpointSchemas['collectors.create'];
		expect(
			create.input.safeParse({ survey_id: '1', type: 'weblink' }).success,
		).toBe(true);
		expect(
			create.input.safeParse({ survey_id: '1', type: 'email' }).success,
		).toBe(true);
		expect(
			create.input.safeParse({ survey_id: '1', type: 'sms' }).success,
		).toBe(false);
	});

	it('accepts every documented webhook event type', () => {
		const create = surveymonkeyEndpointSchemas['webhooks.create'];
		for (const event of [
			'response_completed',
			'response_disqualified',
			'survey_created',
			'collector_deleted',
		]) {
			expect(
				create.input.safeParse({
					name: 'h',
					event_type: event,
					subscription_url: 'https://example.com',
				}).success,
			).toBe(true);
		}
	});

	it('keeps DEFAULT last when a caller adds a handler', () => {
		const custom = surveymonkey({
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

describe('surveymonkey key builder', () => {
	function ctx(stored: string | null) {
		return {
			authType: 'oauth_2' as const,
			options: {},
			tenantId: 'default',
			keys: { get_access_token: jest.fn().mockResolvedValue(stored) },
		};
	}

	it('prefers an explicit key without reading the store', async () => {
		const fixture = ctx('stored');

		await expect(
			surveymonkey({ key: 'explicit' }).keyBuilder?.(
				fixture as never,
				'endpoint',
			),
		).resolves.toBe('explicit');
		expect(fixture.keys.get_access_token).not.toHaveBeenCalled();
	});

	it('falls back to the stored access token', async () => {
		await expect(
			surveymonkey().keyBuilder?.(ctx('stored') as never, 'endpoint'),
		).resolves.toBe('stored');
	});

	it('reads the stored token for a webhook source too', async () => {
		// A webhook handler can call the API, so it takes the same token.
		await expect(
			surveymonkey().keyBuilder?.(ctx('stored') as never, 'webhook'),
		).resolves.toBe('stored');
	});

	it('throws AuthMissingError when no token is stored', async () => {
		await expect(
			surveymonkey().keyBuilder?.(ctx(null) as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError, not a TypeError, with no key manager', async () => {
		// A context built without a key manager has no `keys` at all, so reading
		// it would TypeError before the auth error could be raised.
		const bare = {
			authType: 'oauth_2' as const,
			options: {},
			tenantId: 'default',
		};

		await expect(
			surveymonkey().keyBuilder?.(bare as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses any other source', async () => {
		await expect(
			surveymonkey().keyBuilder?.(ctx('stored') as never, 'other' as never),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
