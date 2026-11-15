import { AuthMissingError } from 'corsair/core';
import { z } from 'zod';
import { linguapop, linguapopEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof linguapop>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = ['invitations.create', 'languages.list'];

describe('linguapop plugin definition', () => {
	const plugin = linguapop();

	it('registers as linguapop with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('linguapop');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the two documented operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('marks the read as read and the invitation as an irreversible write', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(30);
		}
		expect(meta['languages.list']).toMatchObject({ riskLevel: 'read' });
		expect(meta['languages.list']?.irreversible).toBeUndefined();
		expect(meta['invitations.create']).toMatchObject({
			riskLevel: 'write',
			irreversible: true,
		});
	});

	it('says that invitations.create can email the candidate', () => {
		const description =
			plugin.endpointMeta?.['invitations.create']?.description ?? '';
		expect(description).toMatch(/emails the invitation to the candidate/);
		expect(description).toMatch(/sendEmail/);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(linguapopEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(linguapopEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('exports JSON-schema-able inputs for the agent tools', () => {
		const schema = z.toJSONSchema(
			linguapopEndpointSchemas['invitations.create'].input,
		);

		expect(schema).toMatchObject({
			required: expect.arrayContaining(['email', 'languageCode', 'sendEmail']),
		});
	});

	it('keeps DEFAULT last and caller handlers first when handlers are merged', () => {
		const custom = linguapop({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names[0]).toBe('QUOTA_ERROR');
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('RATE_LIMIT_ERROR');
	});
});

describe('linguapop key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(linguapop({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(linguapop(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(
			buildKey(linguapop(), keyContext(null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses webhook keys', async () => {
		await expect(
			linguapop().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
