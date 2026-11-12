import { AuthMissingError } from 'corsair/core';
import {
	DeployHQEndpoints,
	deployHQEndpointMeta,
	deployHQEndpointSchemas,
} from './endpoints';
import {
	deployHQOperationFixtures,
	deployHQOperationKeys,
	deployHQOperations,
} from './endpoints/openapi-operations';
import {
	DeploymentSchema,
	PaginationRecordsObjectSchema,
} from './endpoints/openapi-schemas';
import type { DeployHQKeyBuilderContext, DeployHQPluginOptions } from './index';
import { deployHQAuthConfig, deployhq } from './index';

function makeKeyBuilderContext(
	meteredOperationId?: string,
	apiKey: string | null = 'test-api-key',
	username: string | null = 'agent@example.com',
): DeployHQKeyBuilderContext {
	return {
		authType: 'api_key',
		options: { accountSubdomain: 'demo-account' },
		tenantId: 'test-tenant',
		meteredOperationId,
		keys: {
			get_dek: async () => 'test-dek',
			issue_new_dek: async () => 'test-dek',
			get_api_key: async () => apiKey,
			set_api_key: async () => undefined,
			get_account_subdomain: async () => 'demo-account',
			set_account_subdomain: async () => undefined,
			get_webhook_signature: async () => null,
			set_webhook_signature: async () => undefined,
			get_username: async () => username,
			set_username: async () => undefined,
		},
	};
}

describe('DeployHQ OpenAPI schemas and registry', () => {
	it('keeps endpoint handlers, schemas, metadata, and OpenAPI operations in sync', () => {
		const operationKeys = [...deployHQOperationKeys];
		const schemaKeys = Object.keys(deployHQEndpointSchemas);
		const metadataKeys = Object.keys(deployHQEndpointMeta);
		expect(schemaKeys.sort()).toEqual([...operationKeys].sort());
		expect(metadataKeys.sort()).toEqual([...operationKeys].sort());
		expect(deployHQOperationKeys).toHaveLength(216);
		expect(Object.keys(DeployHQEndpoints).length).toBeGreaterThan(0);
	});

	it.each(deployHQOperationKeys)(
		'%s validates its documented input and output examples',
		(operationKey) => {
			const operation = deployHQOperations[operationKey];
			const fixture = deployHQOperationFixtures[operationKey];
			expect(operation.inputSchema.parse(fixture.input)).toEqual(fixture.input);
			expect(operation.outputSchema.parse(fixture.output)).toEqual(
				fixture.output,
			);
			expect(
				operation.inputSchema.safeParse({ undocumented_field: true }).success,
			).toBe(false);
			expect(operation.outputSchema.safeParse(Symbol('not JSON')).success).toBe(
				false,
			);
		},
	);

	it('provides a strict empty schema for operations without inputs', () => {
		const noInputKey = deployHQOperationKeys.find(
			(key) => deployHQOperations[key].inputSchema.safeParse({}).success,
		);
		expect(noInputKey).toBeDefined();
		if (noInputKey) {
			expect(
				deployHQOperations[noInputKey].inputSchema.safeParse({ extra: true })
					.success,
			).toBe(false);
		}
	});

	it('accepts deployment file maps keyed by UUIDs other than the OpenAPI example', () => {
		const files = {
			'4a4b83ad-1786-4d43-a8b8-8eeea3490f2c': {
				changed: [],
				removed: [],
			},
		};
		expect(DeploymentSchema.parse({ files })).toEqual({ files });
		expect(
			PaginationRecordsObjectSchema.parse({ records: [{ files }] }),
		).toEqual({
			records: [{ files }],
		});
	});

	it('includes only the documented API-key auth type and username field', () => {
		expect(Object.keys(deployHQAuthConfig)).toEqual(['api_key']);
		expect(deployHQAuthConfig.api_key?.account).toEqual([
			'username',
			'account_subdomain',
		]);
	});

	it('uses stored Basic credentials for authenticated calls and keeps public calls keyless', async () => {
		const plugin = deployhq<DeployHQPluginOptions>({
			accountSubdomain: 'demo-account',
		});
		const keyBuilder = plugin.keyBuilder;
		expect(keyBuilder).toBeDefined();
		if (!keyBuilder) return;
		await expect(
			keyBuilder(makeKeyBuilderContext('account.getAccount'), 'endpoint'),
		).resolves.toBe('test-api-key');
		await expect(
			keyBuilder(makeKeyBuilderContext('ipRanges.listIpRanges'), 'endpoint'),
		).resolves.toBe('');
		await expect(
			keyBuilder(makeKeyBuilderContext('account.getAccount'), 'webhook'),
		).resolves.toBe('');
		await expect(
			keyBuilder(makeKeyBuilderContext('account.getAccount', null), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			keyBuilder(
				makeKeyBuilderContext('account.getAccount', 'test-api-key', null),
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);

		const directPlugin = deployhq<DeployHQPluginOptions>({
			accountSubdomain: 'direct-account',
			username: 'direct@example.com',
			key: 'direct-api-key',
		});
		const directKeyBuilder = directPlugin.keyBuilder;
		expect(directKeyBuilder).toBeDefined();
		if (!directKeyBuilder) return;
		const context = makeKeyBuilderContext('account.getAccount');
		context.keys.get_api_key = async () => {
			throw new Error('stored API key should not be read');
		};
		context.keys.get_username = async () => {
			throw new Error('stored username should not be read');
		};
		context.keys.get_account_subdomain = async () => {
			throw new Error('stored account should not be read');
		};
		await expect(directKeyBuilder(context, 'endpoint')).resolves.toBe(
			'direct-api-key',
		);
	});
});
