/**
 * Registry integrity.
 *
 * The nested endpoint tree, the zod schema registry and the endpoint metadata
 * are three parallel structures that must stay aligned. TypeScript enforces
 * that via `satisfies`, but these tests also pin the counts and the tenant
 * routing, so a silently dropped operation fails the build rather than
 * disappearing from the plugin surface.
 */
import {
	SlackbotEndpointInputSchemas,
	SlackbotEndpointOutputSchemas,
} from './endpoints/types';
import { slackbot } from './index';
import { SlackbotSchema } from './schema';
import { resolveSlackbotOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchSlackbotTenantWebhook } from './webhooks/tenant-matcher';

const EXPECTED_OPERATION_COUNT = 87;

describe('database schema', () => {
	it('declares a semver version', () => {
		expect(SlackbotSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares the cached entities', () => {
		expect(Object.keys(SlackbotSchema.entities).sort()).toEqual([
			'channels',
			'files',
			'messages',
			'reminders',
			'scheduled_messages',
			'users',
		]);
	});
});

describe('endpoint registry', () => {
	it(`registers ${EXPECTED_OPERATION_COUNT} input schemas`, () => {
		expect(Object.keys(SlackbotEndpointInputSchemas)).toHaveLength(
			EXPECTED_OPERATION_COUNT,
		);
	});

	it('pairs every input schema with an output schema', () => {
		expect(Object.keys(SlackbotEndpointOutputSchemas).sort()).toEqual(
			Object.keys(SlackbotEndpointInputSchemas).sort(),
		);
	});

	it('exposes every operation through the nested endpoint tree', () => {
		const plugin = slackbot({ key: 'xoxb-test' });
		const groups: Record<string, Record<string, unknown>> = plugin.endpoints ??
		{};
		const operations = Object.values(groups).flatMap((group) =>
			Object.keys(group),
		);
		expect(operations).toHaveLength(EXPECTED_OPERATION_COUNT);
	});

	it('gives every nested operation a schema and metadata entry', () => {
		const plugin = slackbot({ key: 'xoxb-test' });
		const schemas = plugin.endpointSchemas as Record<string, unknown>;
		const meta = plugin.endpointMeta as Record<string, unknown>;

		const groups: Record<string, Record<string, unknown>> = plugin.endpoints ??
		{};
		for (const [group, ops] of Object.entries(groups)) {
			for (const op of Object.keys(ops)) {
				expect(schemas[`${group}.${op}`]).toBeDefined();
				expect(meta[`${group}.${op}`]).toBeDefined();
			}
		}
	});

	it('classifies every operation with a known risk level', () => {
		const plugin = slackbot({ key: 'xoxb-test' });
		const meta = plugin.endpointMeta as Record<string, { riskLevel: string }>;
		for (const entry of Object.values(meta)) {
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
		}
	});

	it('defaults to OAuth 2, the only auth Slack bot installs support', () => {
		const plugin = slackbot();
		expect(plugin.options?.authType).toBe('oauth_2');
		expect(Object.keys(plugin.authConfig ?? {})).toEqual(['oauth_2']);
	});
});

describe('input validation', () => {
	it('rejects a scheduled message with no channel', () => {
		const result = SlackbotEndpointInputSchemas.messagesSchedule.safeParse({
			post_at: 1893456000,
			text: 'hi',
		});
		expect(result.success).toBe(false);
	});

	it('rejects a remote file reference with neither file nor external_id', () => {
		const result = SlackbotEndpointInputSchemas.filesRemoteInfo.safeParse({});
		expect(result.success).toBe(false);
	});

	it('accepts a remote file reference given only an external_id', () => {
		const result = SlackbotEndpointInputSchemas.filesRemoteInfo.safeParse({
			external_id: 'e1',
		});
		expect(result.success).toBe(true);
	});

	it('rejects a presence value outside the allowed set', () => {
		const result = SlackbotEndpointInputSchemas.usersSetPresence.safeParse({
			presence: 'invisible',
		});
		expect(result.success).toBe(false);
	});

	it('caps list pagination at Slack’s maximum page size', () => {
		const result = SlackbotEndpointInputSchemas.usersList.safeParse({
			limit: 5000,
		});
		expect(result.success).toBe(false);
	});
});

describe('tenant routing', () => {
	// Corsair hands the tenant matcher an already-parsed body (readBodyRecord is
	// asRecord, not a JSON parse), so these mirror that shape rather than a
	// raw string.
	it('routes an event to the workspace on the envelope', () => {
		const match = matchSlackbotTenantWebhook({
			body: { type: 'event_callback', team_id: 'T123' },
		} as never);
		expect(match).toEqual({ linkType: 'team_id', externalId: 'T123' });
	});

	it('falls back to the event team when the envelope omits it', () => {
		const match = matchSlackbotTenantWebhook({
			body: { type: 'event_callback', event: { team: 'T456' } },
		} as never);
		expect(match?.externalId).toBe('T456');
	});

	it('falls back to the authorizations array for Enterprise Grid installs', () => {
		const match = matchSlackbotTenantWebhook({
			body: {
				type: 'event_callback',
				authorizations: [{ team_id: 'T999' }],
			},
		} as never);
		expect(match?.externalId).toBe('T999');
	});

	it('declines to route the setup handshake, which predates any install', () => {
		const match = matchSlackbotTenantWebhook({
			body: { type: 'url_verification', challenge: 'abc' },
		} as never);
		expect(match).toBeNull();
	});

	it('returns null when no workspace id is present anywhere', () => {
		const match = matchSlackbotTenantWebhook({
			body: { type: 'event_callback' },
		} as never);
		expect(match).toBeNull();
	});

	it('links an OAuth install to the workspace it was installed into', () => {
		const match = resolveSlackbotOAuthWebhookTenantLink({
			access_token: 'xoxb-1',
			team: { id: 'T123', name: 'Acme' },
		} as never);
		expect(match).toEqual({ linkType: 'team_id', externalId: 'T123' });
	});

	it('returns null when the token response carries no workspace', () => {
		expect(
			resolveSlackbotOAuthWebhookTenantLink({ access_token: 'x' } as never),
		).toBeNull();
	});
});
