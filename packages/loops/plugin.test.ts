import { AuthMissingError } from 'corsair/core';
import { loops, loopsEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof loops>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

// Every operation in https://app.loops.so/openapi.json (v1.24.0), 82 in all.
const operations = [
	'apikey.verifyConnection',
	'audienceSegments.create',
	'audienceSegments.get',
	'audienceSegments.list',
	'campaignGroups.create',
	'campaignGroups.get',
	'campaignGroups.list',
	'campaignGroups.update',
	'campaigns.create',
	'campaigns.get',
	'campaigns.getMetrics',
	'campaigns.list',
	'campaigns.update',
	'components.create',
	'components.get',
	'components.list',
	'components.update',
	'contacts.create',
	'contacts.createProperty',
	'contacts.delete',
	'contacts.find',
	'contacts.getSuppression',
	'contacts.listProperties',
	'contacts.removeSuppression',
	'contacts.update',
	'dedicatedSendingIps.list',
	'emailMessages.get',
	'emailMessages.render',
	'emailMessages.runGuardian',
	'emailMessages.sendPreview',
	'emailMessages.update',
	'eventPatterns.get',
	'eventPatterns.getByName',
	'eventPatterns.list',
	'events.send',
	'footers.create',
	'footers.delete',
	'footers.get',
	'footers.getVariant',
	'footers.list',
	'footers.publishVariant',
	'footers.setDefault',
	'footers.update',
	'footers.updateVariant',
	'lists.list',
	'themes.create',
	'themes.get',
	'themes.list',
	'themes.update',
	'transactional.list',
	'transactional.send',
	'transactionalEmails.create',
	'transactionalEmails.ensureDraft',
	'transactionalEmails.get',
	'transactionalEmails.getMetrics',
	'transactionalEmails.list',
	'transactionalEmails.publish',
	'transactionalEmails.update',
	'transactionalGroups.create',
	'transactionalGroups.get',
	'transactionalGroups.list',
	'transactionalGroups.update',
	'uploads.complete',
	'uploads.create',
	'workflowGroups.create',
	'workflowGroups.get',
	'workflowGroups.list',
	'workflowGroups.update',
	'workflowNodes.addBranch',
	'workflowNodes.create',
	'workflowNodes.delete',
	'workflowNodes.deleteRecursive',
	'workflowNodes.get',
	'workflowNodes.getMetrics',
	'workflowNodes.reroute',
	'workflowNodes.update',
	'workflows.changeMailingList',
	'workflows.create',
	'workflows.delete',
	'workflows.get',
	'workflows.list',
	'workflows.update',
];

describe('Loops plugin definition', () => {
	const plugin = loops();

	it('registers as loops with api_key auth and the spec webhooks', () => {
		expect(plugin.id).toBe('loops');
		expect(plugin.options?.authType).toBe('api_key');
		expect(Object.keys(plugin.webhooks ?? {}).sort()).toEqual([
			'campaign',
			'contact',
			'email',
			'loop',
			'testing',
			'transactional',
		]);
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('reads the webhook secret from the option, then the stored signature', async () => {
		const ctx = {
			...keyContext('api-key'),
			keys: {
				get_api_key: jest.fn(),
				get_webhook_signature: jest.fn().mockResolvedValue('whsec_stored'),
			},
		};
		await expect(
			loops({ webhookSecret: 'whsec_option' }).keyBuilder?.(
				ctx as never,
				'webhook',
			),
		).resolves.toBe('whsec_option');
		await expect(loops().keyBuilder?.(ctx as never, 'webhook')).resolves.toBe(
			'whsec_stored',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('exposes every operation in the Loops API reference', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('gives every endpoint a schema pair', () => {
		expect(Object.keys(loopsEndpointSchemas).sort()).toEqual(operations);
		for (const entry of Object.values(loopsEndpointSchemas)) {
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('marks the reads, writes and the delete for what they are', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
		const risks = Object.fromEntries(
			Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
		);
		expect(risks['apikey.verifyConnection']).toBe('read');
		expect(risks['contacts.find']).toBe('read');
		expect(risks['contacts.listProperties']).toBe('read');
		expect(risks['contacts.getSuppression']).toBe('read');
		expect(risks['lists.list']).toBe('read');
		expect(risks['contacts.create']).toBe('write');
		expect(risks['contacts.update']).toBe('write');
		// Sends, deletes, publishes and anything that can mail an audience.
		for (const name of [
			'events.send',
			'transactional.send',
			'contacts.delete',
			'contacts.removeSuppression',
			'campaigns.create',
			'campaigns.update',
			'emailMessages.sendPreview',
			'footers.delete',
			'footers.publishVariant',
			'transactionalEmails.publish',
			'workflows.delete',
			'workflows.changeMailingList',
			'workflowNodes.delete',
			'workflowNodes.deleteRecursive',
		]) {
			expect([name, risks[name]]).toEqual([name, 'destructive']);
		}
		expect(meta['contacts.delete']?.irreversible).toBe(true);
		expect(risks['emailMessages.render']).toBe('read');
		const destructive = Object.values(risks).filter((r) => r === 'destructive');
		expect(destructive).toHaveLength(14);
	});

	it('prefers the inline key over the stored one', async () => {
		const withInline = loops({ key: 'inline-key' });
		await expect(buildKey(withInline, keyContext('stored-key'))).resolves.toBe(
			'inline-key',
		);
	});

	it('falls back to the stored key', async () => {
		await expect(buildKey(loops(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when neither key exists', async () => {
		await expect(buildKey(loops(), keyContext(null))).rejects.toThrow(
			AuthMissingError,
		);
	});
});
