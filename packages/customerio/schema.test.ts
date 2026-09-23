import {
	CustomerioEndpointInputSchemas,
	CustomerioEndpointOutputSchemas,
} from './endpoints/types';
import { CustomerioSchema } from './schema';

describe('Customer.io schema', () => {
	it('declares a semver version', () => {
		expect(CustomerioSchema.version).toBeDefined();
		expect(CustomerioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CustomerioSchema.entities).toBe('object');
		expect(CustomerioSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CustomerioSchema.entities))).toBe(true);
	});
});

describe('broadcast input schemas', () => {
	it('accepts a minimal triggerBroadcast payload', () => {
		const parsed = CustomerioEndpointInputSchemas.triggerBroadcast.parse({
			broadcast_id: 42,
		});
		expect(parsed.broadcast_id).toBe(42);
	});

	it('accepts per-user data and file audience overrides', () => {
		const parsed = CustomerioEndpointInputSchemas.triggerBroadcast.parse({
			broadcast_id: 7,
			data: { plan: 'pro' },
			per_user_data: [{ id: 'u_1', data: { first_name: 'Ada' } }],
		});
		expect(parsed.per_user_data).toHaveLength(1);
	});

	it('rejects triggerBroadcast with conflicting audience modes', () => {
		// The spec models the audience as oneOf: default (no mode) or exactly
		// one of recipients/ids/emails/per_user_data/data_file_url.
		expect(() =>
			CustomerioEndpointInputSchemas.triggerBroadcast.parse({
				broadcast_id: 7,
				recipients: { ids: ['u_1'] },
				emails: ['a@example.com'],
			}),
		).toThrow();
		expect(() =>
			CustomerioEndpointInputSchemas.triggerBroadcast.parse({
				broadcast_id: 7,
				ids: ['u_1'],
				data_file_url: 'https://example.com/audience.jsonl',
			}),
		).toThrow();
	});

	it('rejects per_user_data entries without an id or email', () => {
		expect(() =>
			CustomerioEndpointInputSchemas.triggerBroadcast.parse({
				broadcast_id: 7,
				per_user_data: [{ data: { first_name: 'Ada' } }],
			}),
		).toThrow();
	});

	it('preserves segment and attribute audience filters instead of stripping them', () => {
		// Regression: recipients previously declared only ids/emails, so zod
		// silently dropped filter objects and mistargeted broadcasts.
		const recipients = {
			and: [
				{ segment: { id: 3 } },
				{
					or: [
						{
							attribute: {
								field: 'interest',
								operator: 'eq',
								value: 'roadrunners',
							},
						},
					],
				},
			],
			not: { attribute: { field: 'species', operator: 'exists' } },
		};
		const parsed = CustomerioEndpointInputSchemas.triggerBroadcast.parse({
			broadcast_id: 7,
			recipients,
		});
		expect(parsed.recipients).toEqual(recipients);
	});

	it('retains ids and emails as top-level recipients fields', () => {
		const parsed = CustomerioEndpointInputSchemas.triggerBroadcast.parse({
			broadcast_id: 7,
			recipients: { ids: ['u_1'], emails: ['a@example.com'] },
		});
		expect(parsed.recipients).toEqual({
			ids: ['u_1'],
			emails: ['a@example.com'],
		});
	});

	it('rejects triggerBroadcast without broadcast_id', () => {
		expect(() =>
			CustomerioEndpointInputSchemas.triggerBroadcast.parse({}),
		).toThrow();
	});

	it('rejects invalid recipient emails', () => {
		expect(() =>
			CustomerioEndpointInputSchemas.triggerBroadcast.parse({
				broadcast_id: 1,
				emails: ['not-an-email'],
			}),
		).toThrow();
	});

	it('parses getTriggers and getTrigger outputs', () => {
		const triggers = CustomerioEndpointOutputSchemas.getTriggers.parse({
			triggers: [
				{ id: 11, broadcast_id: 42, state: 'finished', created: 1725000000 },
			],
		});
		expect(triggers.triggers).toHaveLength(1);
		const trigger = CustomerioEndpointOutputSchemas.getTrigger.parse({
			id: 11,
			broadcast_id: 42,
			state: 'finished',
		});
		expect(trigger.id).toBe(11);
	});
});

describe('read-model schemas', () => {
	it('parses segment list, details and membership', () => {
		const list = CustomerioEndpointOutputSchemas.getSegments.parse({
			segments: [{ id: 3, name: 'Power users' }],
		});
		expect(list.segments[0]?.name).toBe('Power users');
		const details = CustomerioEndpointOutputSchemas.getSegmentDetails.parse({
			segment: { id: 3, name: 'Power users' },
		});
		expect(details.segment.id).toBe(3);
		const membership =
			CustomerioEndpointOutputSchemas.getSegmentMembership.parse({
				ids: ['u_1', 'u_2'],
				next: 'cursor-1',
			});
		expect(membership.next).toBe('cursor-1');
	});

	it('rejects segment membership without segment_id', () => {
		expect(() =>
			CustomerioEndpointInputSchemas.getSegmentMembership.parse({ limit: 10 }),
		).toThrow();
	});

	it('parses paginated messages, newsletters and collections', () => {
		const messages = CustomerioEndpointOutputSchemas.getMessages.parse({
			messages: [{ id: 'm_1', type: 'email' }],
			next: 'n1',
		});
		expect(messages.messages).toHaveLength(1);
		const newsletters = CustomerioEndpointOutputSchemas.listNewsletters.parse({
			newsletters: [{ id: 9, name: 'Weekly' }],
		});
		expect(newsletters.newsletters[0]?.id).toBe(9);
		const collections = CustomerioEndpointOutputSchemas.listCollections.parse({
			collections: [{ id: 'c_1', name: 'Plans', rows: 4 }],
		});
		expect(collections.collections).toHaveLength(1);
	});

	it('parses webhooks, snippets, transactional and IP allowlist outputs', () => {
		const webhooks = CustomerioEndpointOutputSchemas.getWebhooks.parse({
			reporting_webhooks: [
				{
					id: 1,
					name: 'events',
					endpoint: 'https://example.com/hook',
					disabled: false,
				},
			],
		});
		expect(webhooks.reporting_webhooks).toHaveLength(1);
		expect(
			CustomerioEndpointOutputSchemas.getWebhooks.parse({
				reporting_webhooks: null,
			}).reporting_webhooks,
		).toBeNull();
		expect(
			CustomerioEndpointOutputSchemas.listCollections.parse({
				collections: null,
			}).collections,
		).toBeNull();
		const snippets = CustomerioEndpointOutputSchemas.listSnippets.parse({
			snippets: [{ name: 'footer', value: 'Thanks!' }],
		});
		expect(snippets.snippets[0]?.name).toBe('footer');
		const transactional =
			CustomerioEndpointOutputSchemas.listTransactionalMessages.parse({
				messages: [{ id: 5, name: 'Receipt', trigger_name: 'receipt' }],
			});
		expect(transactional.messages).toHaveLength(1);
		const ips = CustomerioEndpointOutputSchemas.listIpAddresses.parse({
			ip_addresses: ['192.0.2.1'],
		});
		expect(ips.ip_addresses).toEqual(['192.0.2.1']);
	});
});

describe('track profile schemas', () => {
	it('accepts identify with traits and rejects empty identifier', () => {
		const parsed = CustomerioEndpointInputSchemas.identifyPerson.parse({
			identifier: 'user@example.com',
			email: 'user@example.com',
			attributes: { plan: 'pro', seats: 3, active: true },
		});
		expect(parsed.identifier).toBe('user@example.com');
		expect(() =>
			CustomerioEndpointInputSchemas.identifyPerson.parse({ identifier: '' }),
		).toThrow();
	});

	it('accepts alias merge pairs and track events', () => {
		const alias = CustomerioEndpointInputSchemas.createAlias.parse({
			primary: { id: 'u_1' },
			secondary: { email: 'old@example.com' },
		});
		expect(alias.primary.id).toBe('u_1');
		const event = CustomerioEndpointInputSchemas.trackEvent.parse({
			identifier: 'u_1',
			name: 'purchased',
			data: { total: 99 },
		});
		expect(event.name).toBe('purchased');
	});

	it('rejects alias participants that are empty or multi-identified', () => {
		// The spec models each side as oneOf id/email/cio_id (maxProperties 1).
		expect(() =>
			CustomerioEndpointInputSchemas.createAlias.parse({
				primary: {},
				secondary: { email: 'old@example.com' },
			}),
		).toThrow();
		expect(() =>
			CustomerioEndpointInputSchemas.createAlias.parse({
				primary: { id: 'u_1', email: 'a@example.com' },
				secondary: { email: 'old@example.com' },
			}),
		).toThrow();
	});

	it('rejects track events without identifier or name', () => {
		expect(() =>
			CustomerioEndpointInputSchemas.trackEvent.parse({ identifier: 'u_1' }),
		).toThrow();
		expect(() =>
			CustomerioEndpointInputSchemas.trackEvent.parse({ name: 'x' }),
		).toThrow();
	});

	it('accepts push metric reports with docs-listed fields', () => {
		const parsed = CustomerioEndpointInputSchemas.reportPushEvents.parse({
			delivery_id: 'd_1',
			metric: 'bounced',
			href: 'https://example.com/offer',
			reason: 'mailbox full',
			recipient: 'user@example.com',
			timestamp: 1613063089,
		});
		expect(parsed.metric).toBe('bounced');
		const legacy = CustomerioEndpointInputSchemas.reportPushEvents.parse({
			delivery_id: 'd_1',
			event: 'clicked',
		});
		expect(legacy.event).toBe('clicked');
	});

	it('rejects push reports without a metric and unknown metric names', () => {
		expect(() =>
			CustomerioEndpointInputSchemas.reportPushEvents.parse({
				delivery_id: 'd_1',
			}),
		).toThrow();
		expect(() =>
			CustomerioEndpointInputSchemas.reportPushEvents.parse({
				delivery_id: 'd_1',
				metric: 'sent',
			}),
		).toThrow();
	});

	it('accepts unsubscribe and suppress payloads', () => {
		const unsub = CustomerioEndpointInputSchemas.unsubscribeDelivery.parse({
			delivery_id: 'd_1',
			unsubscribe: true,
		});
		expect(unsub.unsubscribe).toBe(true);
		const suppress = CustomerioEndpointInputSchemas.suppressPerson.parse({
			identifier: 'u_1',
		});
		expect(suppress.identifier).toBe('u_1');
		expect(() =>
			CustomerioEndpointInputSchemas.suppressPerson.parse({ identifier: '' }),
		).toThrow();
	});
});

describe('cdp schemas', () => {
	it('accepts every batch call variant through the discriminated union', () => {
		const parsed = CustomerioEndpointInputSchemas.sendBatch.parse({
			batch: [
				{ type: 'identify', userId: 'u_1', traits: { plan: 'pro' } },
				{ type: 'track', userId: 'u_1', event: 'signed_up' },
				{ type: 'page', anonymousId: 'a_1', name: 'Pricing' },
				{ type: 'screen', userId: 'u_1', name: 'Home' },
				{ type: 'group', userId: 'u_1', groupId: 'acme' },
				{ type: 'alias', userId: 'u_1', previousId: 'a_1' },
			],
		});
		expect(parsed.batch).toHaveLength(6);
	});

	it('rejects batches with unknown call types or empty arrays', () => {
		expect(() =>
			CustomerioEndpointInputSchemas.sendBatch.parse({
				batch: [{ type: 'unknown_thing' }],
			}),
		).toThrow();
		expect(() =>
			CustomerioEndpointInputSchemas.sendBatch.parse({ batch: [] }),
		).toThrow();
	});

	it('rejects batch calls without userId or anonymousId', () => {
		// Strict-mode docs require an identity on identify/track/page/screen.
		for (const call of [
			{ type: 'identify', traits: { plan: 'pro' } },
			{ type: 'track', event: 'signed_up' },
			{ type: 'page', name: 'Pricing' },
			{ type: 'screen', name: 'Home' },
		]) {
			expect(() =>
				CustomerioEndpointInputSchemas.sendBatch.parse({ batch: [call] }),
			).toThrow();
		}
		const identified = CustomerioEndpointInputSchemas.sendBatch.parse({
			batch: [{ type: 'identify', anonymousId: 'a_1' }],
		});
		expect(identified.batch).toHaveLength(1);
		// Group calls only require groupId per the strict-mode field list.
		const grouped = CustomerioEndpointInputSchemas.sendBatch.parse({
			batch: [{ type: 'group', groupId: 'acme' }],
		});
		expect(grouped.batch).toHaveLength(1);
	});

	it('requires userId or anonymousId for page and screen calls', () => {
		expect(() =>
			CustomerioEndpointInputSchemas.trackPage.parse({ name: 'Home' }),
		).toThrow();
		expect(() =>
			CustomerioEndpointInputSchemas.trackScreen.parse({ name: 'Home' }),
		).toThrow();
		const page = CustomerioEndpointInputSchemas.trackPage.parse({
			anonymousId: 'a_1',
			name: 'Home',
			properties: { url: 'https://example.com/' },
		});
		expect(page.anonymousId).toBe('a_1');
	});

	it('requires groupId for group calls and identifiers for alias calls', () => {
		expect(() =>
			CustomerioEndpointInputSchemas.addPersonToGroup.parse({ userId: 'u_1' }),
		).toThrow();
		const group = CustomerioEndpointInputSchemas.addPersonToGroup.parse({
			userId: 'u_1',
			groupId: 'acme',
			traits: { plan: 'team' },
		});
		expect(group.groupId).toBe('acme');
	});
});
