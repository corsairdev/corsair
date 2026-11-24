import { AuthMissingError } from 'corsair/core';
import { mopinion, mopinionAuthConfig, mopinionEndpointSchemas } from './index';

// The key builder only reads authType and the two credential accessors.
function keyContext(creds: {
	publicKey: string | null;
	signatureToken: string | null;
}) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: {
			get_public_key: jest.fn().mockResolvedValue(creds.publicKey),
			// The signature token is the stored API key.
			get_api_key: jest.fn().mockResolvedValue(creds.signatureToken),
		},
	};
}

function buildKey(
	plugin: ReturnType<typeof mopinion>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.get',
	'datasets.feedback',
	'datasets.feedbackItem',
	'datasets.fields',
	'datasets.get',
	'deployments.get',
	'deployments.list',
	'reports.feedback',
	'reports.feedbackItem',
	'reports.fields',
	'reports.get',
];

const riskLevels: Record<string, string> = {
	'account.get': 'read',
	'datasets.get': 'read',
	'datasets.fields': 'read',
	'datasets.feedback': 'read',
	'datasets.feedbackItem': 'read',
	'deployments.list': 'read',
	'deployments.get': 'read',
	'reports.get': 'read',
	'reports.fields': 'read',
	'reports.feedback': 'read',
	'reports.feedbackItem': 'read',
};

describe('mopinion plugin definition', () => {
	const plugin = mopinion();

	it('registers as mopinion with the signature token as API key, the public key as account field and no webhooks', () => {
		expect(plugin.id).toBe('mopinion');
		expect(plugin.options?.authType).toBe('api_key');
		expect(mopinionAuthConfig.api_key?.account).toEqual(['public_key']);
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 11 catalog operations across 4 groups', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(Object.keys(plugin.endpoints ?? {})).toHaveLength(4);
	});

	it('gives every endpoint a description and the read risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
		expect(
			Object.fromEntries(
				Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
			),
		).toEqual(riskLevels);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(mopinionEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(mopinionEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = mopinion({
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

describe('mopinion key builder', () => {
	it('joins the stored credentials into the composite key', async () => {
		const ctx = keyContext({
			publicKey: 'stored-public',
			signatureToken: 'stored-signature',
		});

		await expect(buildKey(mopinion(), ctx)).resolves.toBe(
			'stored-public:stored-signature',
		);
	});

	it('prefers the inline credentials', async () => {
		const ctx = keyContext({
			publicKey: 'stored-public',
			signatureToken: 'stored-signature',
		});

		await expect(
			buildKey(
				mopinion({ publicKey: 'inline-public', signatureToken: 'inline-sig' }),
				ctx,
			),
		).resolves.toBe('inline-public:inline-sig');
		expect(ctx.keys.get_public_key).not.toHaveBeenCalled();
	});

	it('throws AuthMissingError when a credential is missing', async () => {
		await expect(
			buildKey(
				mopinion(),
				keyContext({ publicKey: 'stored-public', signatureToken: null }),
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			buildKey(
				mopinion(),
				keyContext({ publicKey: null, signatureToken: null }),
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses webhook keys: there are no inbound webhooks', async () => {
		await expect(
			mopinion().keyBuilder?.(
				keyContext({ publicKey: 'p', signatureToken: 's' }) as never,
				'webhook',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
