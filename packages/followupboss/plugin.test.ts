import { AuthMissingError } from 'corsair/core';
import {
	followUpBossAuthConfig,
	followUpBossEndpointSchemas,
	followupboss,
} from './index';

// The key builder only reads authType and keys.
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof followupboss>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

// Sorted 'group.name' ids of the 52 operations in followUpBossEndpointsNested.
const operations = [
	'account.identity',
	'account.me',
	'actionPlans.list',
	'actionPlansPeople.create',
	'actionPlansPeople.list',
	'actionPlansPeople.update',
	'appointmentOutcomes.create',
	'appointmentOutcomes.delete',
	'appointmentOutcomes.get',
	'appointmentOutcomes.list',
	'appointmentOutcomes.update',
	'appointmentTypes.create',
	'appointmentTypes.delete',
	'appointmentTypes.get',
	'appointmentTypes.list',
	'appointmentTypes.update',
	'appointments.create',
	'appointments.delete',
	'appointments.get',
	'appointments.list',
	'appointments.update',
	'automations.get',
	'automations.list',
	'automationsPeople.create',
	'automationsPeople.get',
	'automationsPeople.list',
	'automationsPeople.update',
	'calls.create',
	'calls.get',
	'calls.list',
	'calls.update',
	'customFields.create',
	'customFields.delete',
	'customFields.get',
	'customFields.list',
	'customFields.update',
	'dealAttachments.create',
	'dealAttachments.delete',
	'dealAttachments.get',
	'dealAttachments.update',
	'dealCustomFields.create',
	'dealCustomFields.delete',
	'dealCustomFields.get',
	'dealCustomFields.list',
	'dealCustomFields.update',
	'deals.create',
	'deals.delete',
	'deals.get',
	'deals.list',
	'deals.update',
	'emCampaigns.create',
	'emCampaigns.list',
	'emCampaigns.update',
	'emEvents.create',
	'emEvents.list',
	'events.create',
	'events.get',
	'events.list',
	'groups.create',
	'groups.delete',
	'groups.get',
	'groups.list',
	'groups.roundRobin',
	'groups.update',
	'inboxApps.addMessage',
	'inboxApps.addNote',
	'inboxApps.addSystemConfirmationMessage',
	'inboxApps.createParticipant',
	'inboxApps.deactivate',
	'inboxApps.deleteParticipant',
	'inboxApps.getParticipants',
	'inboxApps.install',
	'inboxApps.installedApp',
	'inboxApps.updateConversation',
	'inboxApps.updateMessage',
	'notes.create',
	'notes.delete',
	'notes.get',
	'notes.update',
	'people.checkDuplicate',
	'people.claim',
	'people.create',
	'people.delete',
	'people.get',
	'people.ignoreUnclaimed',
	'people.list',
	'people.unclaimed',
	'people.update',
	'peopleRelationships.create',
	'peopleRelationships.delete',
	'peopleRelationships.get',
	'peopleRelationships.list',
	'peopleRelationships.update',
	'personAttachments.create',
	'personAttachments.delete',
	'personAttachments.get',
	'personAttachments.update',
	'pipelines.create',
	'pipelines.delete',
	'pipelines.get',
	'pipelines.list',
	'pipelines.update',
	'ponds.create',
	'ponds.delete',
	'ponds.get',
	'ponds.list',
	'ponds.update',
	'rateLimit.limits',
	'rateLimit.usage',
	'reactions.create',
	'reactions.delete',
	'reactions.get',
	'smartLists.get',
	'smartLists.list',
	'stages.create',
	'stages.delete',
	'stages.get',
	'stages.list',
	'stages.update',
	'tasks.create',
	'tasks.delete',
	'tasks.get',
	'tasks.list',
	'tasks.update',
	'teamInboxes.list',
	'teams.create',
	'teams.delete',
	'teams.get',
	'teams.list',
	'teams.update',
	'templates.create',
	'templates.delete',
	'templates.get',
	'templates.list',
	'templates.merge',
	'templates.update',
	'textMessageTemplates.create',
	'textMessageTemplates.delete',
	'textMessageTemplates.get',
	'textMessageTemplates.list',
	'textMessageTemplates.merge',
	'textMessageTemplates.update',
	'textMessages.create',
	'textMessages.get',
	'textMessages.list',
	'threadedReplies.get',
	'timeframes.list',
	'users.delete',
	'users.get',
	'users.list',
	'webhookEvents.get',
	'webhooks.create',
	'webhooks.delete',
	'webhooks.get',
	'webhooks.list',
	'webhooks.update',
];

describe('followupboss plugin definition', () => {
	const plugin = followupboss();

	it('registers as followupboss with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('followupboss');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 52 catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('has input and output schemas for exactly the same operations', () => {
		expect(Object.keys(followUpBossEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(followUpBossEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('gives endpoint meta exactly the same operations', () => {
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(operations);
	});

	it('writes every description as a real sentence', () => {
		for (const [id, entry] of Object.entries(plugin.endpointMeta ?? {})) {
			expect(entry.description?.length).toBeGreaterThan(20);
			expect(entry.description).toMatch(/[a-zA-Z]$/);
			expect(entry.description).not.toContain(id);
		}
	});

	it('keeps every risk level in the catalog and deletes destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const entry of Object.values(meta)) {
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
		}
		for (const [id, entry] of Object.entries(meta)) {
			if (id.endsWith('.delete')) {
				expect(entry.riskLevel).toBe('destructive');
			}
		}
	});

	it('accepts typed system identification options', () => {
		const custom = followupboss({ systemName: 'X', systemKey: 'K' });
		expect(custom.options?.systemName).toBe('X');
		expect(custom.options?.systemKey).toBe('K');
	});

	it('declares api_key auth only', () => {
		expect(Object.keys(followUpBossAuthConfig)).toEqual(['api_key']);
	});
});

describe('followupboss key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(
			buildKey(followupboss({ key: 'option-key' }), ctx),
		).resolves.toBe('option-key');
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(
			buildKey(followupboss(), keyContext('stored-key')),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		const attempt = buildKey(followupboss(), keyContext(null));
		await expect(attempt).rejects.toBeInstanceOf(AuthMissingError);
		await expect(attempt).rejects.toThrow(/auth-missing/);
	});
});
