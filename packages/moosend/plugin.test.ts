import { AuthMissingError } from 'corsair/core';
import { moosend, moosendEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof moosend>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

// Every operation that can send email, change consent or delete data for
// good; the rest are reads or ordinary writes.
const destructive = [
	'campaigns.delete',
	'campaigns.schedule',
	'campaigns.send',
	'campaigns.sendTest',
	'customFields.delete',
	'lists.delete',
	'segments.delete',
	'subscribers.delete',
	'subscribers.deleteFromAccount',
	'subscribers.deleteMany',
	'subscribers.remove',
	'subscribers.removeMany',
	'subscribers.subscribe',
	'subscribers.subscribeMany',
	'subscribers.unsubscribe',
	'subscribers.unsubscribeFromAccount',
	'subscribers.unsubscribeFromCampaign',
	'transactional.send',
];

const reads = [
	'campaigns.abSummary',
	'campaigns.activityByLocation',
	'campaigns.get',
	'campaigns.linkActivity',
	'campaigns.list',
	'campaigns.stats',
	'campaigns.summary',
	'lists.get',
	'lists.list',
	'lists.listPaged',
	'segments.get',
	'segments.list',
	'segments.members',
	'senders.get',
	'senders.list',
	'subscribers.getByEmail',
	'subscribers.getById',
	'subscribers.getByIdAnyList',
	'subscribers.list',
];

describe('moosend plugin definition', () => {
	const plugin = moosend();

	it('registers as moosend with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('moosend');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
		([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
	);

	it('exposes 52 operations across 7 groups', () => {
		expect(nested).toHaveLength(52);
		expect(Object.keys(plugin.endpoints ?? {}).sort()).toEqual([
			'campaigns',
			'customFields',
			'lists',
			'segments',
			'senders',
			'subscribers',
			'transactional',
		]);
	});

	it('gives every endpoint a description and the right risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual([...nested].sort());
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
		const byLevel = (level: string) =>
			Object.entries(meta)
				.filter(([, entry]) => entry.riskLevel === level)
				.map(([name]) => name)
				.sort();
		expect(byLevel('destructive')).toEqual(destructive);
		expect(byLevel('read')).toEqual(reads);
		expect(byLevel('write')).toHaveLength(
			52 - destructive.length - reads.length,
		);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(moosendEndpointSchemas).sort()).toEqual(
			[...nested].sort(),
		);
		for (const schemas of Object.values(moosendEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = moosend({
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
		expect(names).toContain('RATE_LIMIT_ERROR');
	});
});

describe('moosend key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(moosend({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(moosend(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(buildKey(moosend(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys', async () => {
		await expect(
			moosend().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
