import { RenderEndpointInputSchemas } from './endpoints/types';
import { render, renderEndpointSchemas } from './index';
import { RenderSchema } from './schema';

jest.mock('./client', () => ({
	makeRenderRequest: jest.fn(),
}));

import { makeRenderRequest } from './client';

describe('Render schema', () => {
	it('declares a semver version', () => {
		expect(RenderSchema.version).toBeDefined();
		expect(RenderSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof RenderSchema.entities).toBe('object');
		expect(RenderSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(RenderSchema.entities))).toBe(true);
		for (const entity of Object.values(RenderSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('registers the full current Render operation catalog', () => {
		expect(Object.keys(renderEndpointSchemas).length).toBeGreaterThanOrEqual(
			93,
		);
	});

	it('enforces endpoint schemas at the bound endpoint boundary', async () => {
		const request = jest.mocked(makeRenderRequest);
		request.mockClear();
		request.mockResolvedValue([]);
		const plugin = render({ key: 'secret' });
		const ctx = {
			key: 'secret',
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		if (!plugin.endpoints) throw new Error('Render endpoints are missing');

		await expect(
			plugin.endpoints.services.list(ctx, { limit: 0 } as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();

		await expect(plugin.endpoints.services.list(ctx, {})).resolves.toEqual([]);
		await expect(plugin.endpoints.projects.list(ctx, {})).resolves.toEqual([]);

		request.mockResolvedValue({ invalid: true });
		await expect(plugin.endpoints.services.list(ctx, {})).rejects.toThrow();

		request.mockResolvedValue(undefined);
		await expect(
			plugin.endpoints.services.delete(ctx, { serviceId: 'service-1' }),
		).resolves.toBeUndefined();
	});

	it('requires identifiers for resource operations with path parameters', () => {
		const idOperations = [
			'retrieveEnvironment',
			'updateEnvironment',
			'deleteEnvironment',
			'retrieveEnvGroup',
			'updateEnvGroup',
			'deleteEnvGroup',
			'retrieveProject',
			'updateProject',
			'retrievePostgres',
			'updatePostgres',
			'retrieveRegistryCredential',
			'updateRegistryCredential',
			'deleteRegistryCredential',
		] as const;

		for (const operation of idOperations) {
			const schema = RenderEndpointInputSchemas[operation];
			expect(schema.safeParse({}).success).toBe(false);
			expect(schema.safeParse({ id: 'resource-1' }).success).toBe(true);
		}
	});

	it('requires every path parameter at the schema boundary', () => {
		const idOperations = [
			'retrieveOwner',
			'listOwnerMembers',
			'deleteOwnerLogStream',
			'updateOwnerLogStream',
			'addHeaders',
			'addResourcesToEnvironment',
			'addRoute',
			'createCustomDomain',
			'deleteKeyValue',
			'disconnectBlueprint',
			'listInstances',
			'listPostgresExport',
			'listPostgresUsers',
			'listRoutes',
			'listSecretFiles',
			'retrieveOwnerNotificationSettings',
			'updateEnvVarsForService',
			'updateHeaders',
			'updateResourceLogStream',
			'updateSecretFilesForService',
			'deleteOwnerMetricsStream',
			'updateOwnerNotificationSettings',
			'updateRoutes',
		] as const;
		for (const operation of idOperations) {
			const schema = RenderEndpointInputSchemas[operation];
			expect(schema.safeParse({}).success).toBe(false);
			expect(schema.safeParse({ id: 'resource-1' }).success).toBe(true);
		}

		const keyOperations = [
			'addOrUpdateSecretFile',
			'deleteEnvGroupEnvVar',
			'deleteEnvGroupSecretFile',
			'deleteSecretFile',
			'retrieveCustomDomain',
			'retrieveDeploy',
			'retrieveEnvGroupEnvVar',
			'retrieveEnvGroupSecretFile',
			'retrieveEnvVar',
			'retrieveSecretFile',
			'updateEnvGroupEnvVar',
			'updateEnvGroupSecretFile',
			'updateEnvVar',
			'verifyCustomDomain',
		] as const;
		for (const operation of keyOperations) {
			const schema = RenderEndpointInputSchemas[operation];
			expect(schema.safeParse({ id: 'resource-1' }).success).toBe(false);
			expect(
				schema.safeParse({ id: 'resource-1', key: 'resource-key' }).success,
			).toBe(true);
		}

		expect(
			RenderEndpointInputSchemas.linkServiceToEnvGroup.safeParse({
				id: 'group-1',
			}).success,
		).toBe(false);
		expect(
			RenderEndpointInputSchemas.linkServiceToEnvGroup.safeParse({
				id: 'group-1',
				serviceId: 'service-1',
			}).success,
		).toBe(true);
	});

	it('provides executable input and output contracts for every operation', () => {
		for (const schemas of Object.values(renderEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps every registered endpoint behind a schema boundary', () => {
		const plugin = render({ key: 'secret' });
		const paths: string[] = [];
		const visit = (value: unknown, prefix: string[] = []) => {
			if (typeof value === 'function') {
				paths.push(prefix.join('.'));
				return;
			}
			if (value && typeof value === 'object') {
				for (const [key, child] of Object.entries(value)) {
					visit(child, [...prefix, key]);
				}
			}
		};

		visit(plugin.endpoints);
		expect(paths).toHaveLength(Object.keys(renderEndpointSchemas).length);
		for (const path of paths) {
			expect(
				renderEndpointSchemas[path as keyof typeof renderEndpointSchemas],
			).toBeDefined();
		}
	});

	// Per the plugin endpoint-test rule, this table-driven traversal invokes
	// every registered operation and asserts one request plus response parsing.
	it('exercises every registered operation through its public boundary', async () => {
		const request = jest.mocked(makeRenderRequest);
		request.mockClear();
		const plugin = render({ key: 'secret' });
		const ctx = {
			key: 'secret',
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		const inputCandidates = [
			{ id: 'resource-1', key: 'resource-key', serviceId: 'service-1' },
			{ serviceId: 'service-1' },
			{ id: 'resource-1' },
			{ key: 'resource-key' },
			{},
		];
		const outputCandidates = [
			[],
			{ data: 'event: task.completed\\ndata: {}\\n\\n' },
			{
				id: 'resource-1',
				name: 'resource',
				type: 'service',
				ownerId: 'owner-1',
			},
			{
				service: {
					id: 'service-1',
					name: 'service',
					type: 'web_service',
					ownerId: 'owner-1',
				},
			},
			{},
			undefined,
		];
		let invokedOperations = 0;
		const visit = async (value: unknown, prefix: string[] = []) => {
			if (typeof value === 'function') {
				invokedOperations += 1;
				const path = prefix.join('.') as keyof typeof renderEndpointSchemas;
				const contract = renderEndpointSchemas[path];
				if (!contract) throw new Error(`Missing contract for ${path}`);
				const input = inputCandidates.find(
					(candidate) => contract.input.safeParse(candidate).success,
				);
				if (!input) throw new Error(`No valid test input for ${path}`);
				const output = outputCandidates.find(
					(candidate) => contract.output.safeParse(candidate).success,
				);
				request.mockResolvedValue(
					path === 'automation.streamTaskRunsEvents'
						? 'event: task.completed\\ndata: {}\\n\\n'
						: output,
				);
				await (value as (context: unknown, args: unknown) => Promise<unknown>)(
					ctx,
					input,
				);
				return;
			}
			if (value && typeof value === 'object') {
				for (const [key, child] of Object.entries(value)) {
					await visit(child, [...prefix, key]);
				}
			}
		};

		await visit(plugin.endpoints);
		expect(invokedOperations).toBe(Object.keys(renderEndpointSchemas).length);
		expect(request).toHaveBeenCalledTimes(invokedOperations);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
