import { UnioneEndpointOutputSchemas } from './endpoints/types';
import { UnioneSchema } from './schema';
import {
	UnioneAccount,
	UnioneDomain,
	UnioneSuppression,
	UnioneTag,
	UnioneTemplate,
	UnioneWebhook,
} from './schema/database';

describe('Unione schema', () => {
	it('declares a semver version', () => {
		expect(UnioneSchema.version).toBeDefined();
		expect(UnioneSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof UnioneSchema.entities).toBe('object');
		expect(UnioneSchema.entities).not.toBeNull();
		expect(Object.keys(UnioneSchema.entities)).toEqual(
			expect.arrayContaining([
				'templates',
				'webhooks',
				'suppressions',
				'eventDumps',
				'domains',
				'tags',
				'account',
			]),
		);
		for (const entity of Object.values(UnioneSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

/**
 * Payloads below are the verbatim shapes returned by api.unione.io on
 * 2026-08-22. They guard against the schema drifting away from what UniOne
 * actually sends.
 */
describe('Unione database schemas accept live API shapes', () => {
	it('accepts a system/info account payload in full', () => {
		const parsed = UnioneAccount.parse({
			user_id: 7167952,
			email: 'account@example.com',
			emails_included: 0,
			emails_sent: 0,
			validations_included: 5,
			validations_used: 0,
			period_start: '2026-08-22 06:59:54',
			period_end: '2026-09-22 06:59:54',
		});
		// The accounting block is mirrored, not silently dropped.
		expect(parsed.validations_included).toBe(5);
		expect(parsed.period_end).toBe('2026-09-22 06:59:54');
	});

	it('keys a webhook by url and needs no id', () => {
		const parsed = UnioneWebhook.parse({
			url: 'https://example.com/hook',
			status: 'active',
			events: { email_status: ['delivered'], spam_block: ['*'] },
		});
		expect(parsed.url).toBe('https://example.com/hook');
		expect(parsed.events?.email_status).toEqual(['delivered']);
	});

	it('rejects a webhook with no url', () => {
		expect(() => UnioneWebhook.parse({ status: 'active' })).toThrow();
	});

	it('coerces the suppression created timestamp into created_at', () => {
		const parsed = UnioneSuppression.parse({
			email: 'user@example.com',
			project_id: 'proj-1',
			cause: 'unsubscribed',
			source: 'user',
			is_deletable: true,
			created: '2026-08-22 07:00:00',
			created_at: '2026-08-22 07:00:00',
		});
		expect(parsed.created_at).toBeInstanceOf(Date);
	});

	it('accepts nullable optional fields on templates and domains', () => {
		expect(UnioneTemplate.parse({ id: 'tpl-1', name: null }).name).toBeNull();
		expect(
			UnioneDomain.parse({ domain: 'example.com', dkim_status: null })
				.dkim_status,
		).toBeNull();
	});

	it('requires both tag columns', () => {
		expect(UnioneTag.parse({ tag_id: 1, tag: 'welcome' }).tag).toBe('welcome');
		expect(() => UnioneTag.parse({ tag_id: 1 })).toThrow();
	});

	it('accepts the null cursor UniOne sends on the last suppression page', () => {
		// Verbatim response for an account with no suppressions. A non-nullable
		// cursor made suppression.list throw on this ordinary payload.
		const parsed = UnioneEndpointOutputSchemas.suppressionList.parse({
			status: 'success',
			count: 0,
			suppressions: [],
			cursor: null,
		});
		expect(parsed.cursor).toBeNull();
		expect(parsed.count).toBe(0);
	});

	it('accepts null and omitted webhook fields, including nested events', () => {
		const nulled = UnioneEndpointOutputSchemas.webhookList.parse({
			status: 'success',
			objects: [
				{
					url: 'https://example.com/hook',
					status: null,
					event_format: null,
					delivery_info: null,
					single_event: null,
					max_parallel: null,
					updated_at: null,
					events: { email_status: null, spam_block: null },
				},
				// Same webhook with every optional field omitted instead.
				{ url: 'https://example.com/hook2' },
				{ url: 'https://example.com/hook3', events: null },
			],
		});
		expect(nulled.objects).toHaveLength(3);
		expect(nulled.objects?.[0]?.events?.email_status).toBeNull();
	});

	it('rejects a webhook object with a missing or null url', () => {
		// url is the webhook's identity, so it stays required even though the
		// surrounding settings tolerate null.
		const parse = (object: unknown) =>
			UnioneEndpointOutputSchemas.webhookList.parse({
				status: 'success',
				objects: [object],
			});
		expect(() => parse({ status: 'active' })).toThrow();
		expect(() => parse({ url: null, status: 'active' })).toThrow();
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
