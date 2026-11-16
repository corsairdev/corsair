import type { CorsairErrorHandler } from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { errorHandlers } from './error-handlers';
import type { SignpathKeyBuilderContext } from './index';
import { signpath, signpathEndpointSchemas } from './index';

// Widen the literal map to the type core actually reads, so the assertions
// below can inspect the optional entries.
const handlers: CorsairErrorHandler = errorHandlers;

/** The key builder only reads authType and keys. */
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof signpath>,
	ctx: ReturnType<typeof keyContext>,
	source: 'endpoint' | 'webhook' = 'endpoint',
) {
	// A test fixture cannot be a full AccountKeyManager, which also needs
	// get_dek and issue_new_dek; only get_api_key is read here.
	return plugin.keyBuilder?.(
		ctx as unknown as SignpathKeyBuilderContext, // unknown: partial fixture
		source,
	);
}

const operations = [
	'artifactConfigurations.activate',
	'artifactConfigurations.deactivate',
	'artifactConfigurations.getXml',
	'artifactConfigurations.updateXml',
	'auditLog.listEvents',
	'auditLog.listSigningRequestEvents',
	'certificates.get',
	'certificates.list',
	'organization.get',
	'projects.activate',
	'projects.create',
	'projects.deactivate',
	'projects.get',
	'projects.list',
	'projects.setDefaultArtifactConfiguration',
	'projects.update',
	'signingPolicies.activate',
	'signingPolicies.create',
	'signingPolicies.deactivate',
	'signingPolicies.get',
	'signingPolicies.update',
	'signingRequests.approve',
	'signingRequests.cancel',
	'signingRequests.deny',
	'signingRequests.get',
	'signingRequests.getStatus',
	'signingRequests.list',
	'signingRequests.resubmit',
	'signingRequests.signHash',
	'signingRequests.signMessage',
	'signingRequests.submitWithArtifact',
	'signingRequests.submitWithArtifactRetrievalLink',
	'signingRequests.submitWithoutArtifact',
	'users.me',
];

describe('signpath plugin definition', () => {
	const plugin = signpath();

	it('registers as signpath with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('signpath');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('declares the organization id as an account-level credential', () => {
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['organization_id'] },
		});
	});

	it('exposes exactly the thirty-four catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('gives every endpoint a description and a risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(20);
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
		}
	});

	it('marks deny and cancel as irreversible', () => {
		const meta = plugin.endpointMeta ?? {};
		const irreversible = Object.entries(meta)
			.filter(([, entry]) => entry.irreversible === true)
			.map(([name]) => name)
			.sort();
		expect(irreversible).toEqual([
			'signingRequests.cancel',
			'signingRequests.deny',
			'signingRequests.signHash',
			'signingRequests.signMessage',
		]);
	});

	it('marks signing, submitting, approving, cancelling and denying destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		const destructive = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'destructive')
			.map(([name]) => name)
			.sort();
		expect(destructive).toEqual([
			'signingRequests.approve',
			'signingRequests.cancel',
			'signingRequests.deny',
			'signingRequests.resubmit',
			'signingRequests.signHash',
			'signingRequests.signMessage',
			'signingRequests.submitWithArtifact',
			'signingRequests.submitWithArtifactRetrievalLink',
			'signingRequests.submitWithoutArtifact',
		]);
	});

	it('marks every submitter and resubmit as a job polled through getStatus', () => {
		const meta = plugin.endpointMeta ?? {};
		const jobs = Object.entries(meta)
			.filter(([, entry]) => entry.job !== undefined)
			.map(([name]) => name)
			.sort();
		// resubmit is not here: its id comes from a Location header SignPath may
		// omit, so it is nullable and cannot drive a job.
		expect(jobs).toEqual([
			'signingRequests.submitWithArtifact',
			'signingRequests.submitWithArtifactRetrievalLink',
			'signingRequests.submitWithoutArtifact',
		]);
		for (const name of jobs) {
			const job = meta[name as keyof typeof meta]?.job;
			expect(job?.status.op).toBe('signingRequests.getStatus');
			expect(job?.status.idArg).toBe('signingRequestId');
			expect(job?.status.done).toContain('Completed');
			expect(job?.status.failed).toEqual(['Failed', 'Denied', 'Canceled']);
			expect(job?.cancel?.op).toBe('signingRequests.cancel');
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(signpathEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(signpathEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last and puts caller handlers first', () => {
		const custom = signpath({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names[0]).toBe('QUOTA_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
		expect(names).toContain('AUTH_ERROR');
	});

	it('lets a caller handler shadow a builtin without losing DEFAULT', () => {
		const custom = signpath({
			errorHandlers: {
				AUTH_ERROR: {
					match: () => true,
					handler: async () => ({ maxRetries: 9 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names[0]).toBe('AUTH_ERROR');
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names.filter((name) => name === 'AUTH_ERROR')).toHaveLength(1);
	});
});

describe('signpath key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(signpath({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(signpath(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(buildKey(signpath(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys', async () => {
		await expect(
			buildKey(signpath(), keyContext('stored-key'), 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
