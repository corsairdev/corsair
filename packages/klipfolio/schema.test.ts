import { KlipfolioEndpointInputSchemas } from './endpoints/types';
import { klipfolio, klipfolioEndpointSchemas } from './index';
import { KlipfolioSchema } from './schema';

jest.mock('./client', () => ({
	makeKlipfolioRequest: jest.fn(),
}));

import { makeKlipfolioRequest } from './client';

// unknown: zod v4 field internals are read to derive type-appropriate
// boundary values; stricter typing would couple the tests to zod internals.
type ZodField = {
	isOptional: () => boolean;
	_zod: {
		def: {
			type: string;
			element?: ZodField;
			entries?: Record<string, string>;
			shape?: Record<string, ZodField>;
		};
	};
};

function scalarFor(field: ZodField, key: string): unknown {
	const type = field._zod.def.type;
	if (type === 'number') {
		return 1;
	}
	if (type === 'boolean') {
		return true;
	}
	if (type === 'enum') {
		// unknown: zod v4 enum defs store the allowed members in entries; the
		// first documented member satisfies the contract.
		const entries = field._zod.def.entries;
		return entries ? Object.values(entries)[0] : 'test-' + key;
	}
	if (type === 'record') {
		return {};
	}
	if (type === 'object') {
		// unknown: zod v4 object defs are read structurally to build a
		// shape-valid nested input; stricter typing would couple the test to
		// zod internals.
		const inner = field._zod.def.shape ?? {};
		const out: Record<string, unknown> = {};
		for (const [k, f] of Object.entries(inner)) {
			if (f.isOptional()) continue;
			out[k] = scalarFor(f, k);
		}
		return out;
	}
	if (type === 'array') {
		// unknown: zod v4 array element defs are read structurally to build a
		// type-appropriate scalar; stricter typing would couple the test to
		// zod internals.
		const element = field._zod.def.element;
		return [element ? scalarFor(element, key) : 'test-' + key];
	}
	return 'test-' + key;
}

function buildValidInput(schema: {
	shape: Record<string, ZodField>;
}): Record<string, unknown> {
	// Minimal valid input: only required fields get values. Optional fields
	// stay absent — placeholder strings would violate enum and array
	// contracts and test nothing about the required-field boundary.
	const input: Record<string, unknown> = {};
	for (const [key, field] of Object.entries(schema.shape)) {
		if (field.isOptional()) continue;
		input[key] = scalarFor(field, key);
	}
	return input;
}

describe('Klipfolio schema', () => {
	it('declares a semver version', () => {
		expect(KlipfolioSchema.version).toBeDefined();
		expect(KlipfolioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof KlipfolioSchema.entities).toBe('object');
		expect(KlipfolioSchema.entities).not.toBeNull();
	});

	it('registers the full current Klipfolio operation catalog', () => {
		expect(Object.keys(klipfolioEndpointSchemas).length).toBeGreaterThanOrEqual(
			125,
		);
	});

	it('provides executable input and output contracts for every operation', () => {
		for (const schemas of Object.values(klipfolioEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('requires required fields at the schema boundary for every operation', () => {
		for (const [, rawSchema] of Object.entries(KlipfolioEndpointInputSchemas)) {
			// unknown: zod v4 schema objects are accessed structurally to derive
			// the required-field table; stricter typing would couple the test to
			// zod internals.
			const schema = rawSchema as unknown as {
				shape: Record<string, ZodField>;
				safeParse: (value: unknown) => { success: boolean };
			};
			const required = Object.keys(schema.shape).filter(
				// unknown: zod v4 field records are read structurally; optional
				// chaining guards the indexed access under noUncheckedIndexedAccess.
				(key) => schema.shape[key]?.isOptional() === false,
			);
			if (!required.length) continue;
			expect(schema.safeParse({}).success).toBe(false);
			expect(schema.safeParse(buildValidInput(schema)).success).toBe(true);
		}
	});

	// Per the plugin endpoint-test rule, this table-driven traversal invokes
	// every registered operation through its schema boundary with fixed
	// provider-shaped response mocks.
	it('exercises every registered operation through its public boundary', async () => {
		const request = jest.mocked(makeKlipfolioRequest);
		request.mockClear();
		const plugin = klipfolio({ key: 'secret' });
		// never: the fixture provides exactly the context fields these
		// handlers read (key, options, $getAccountId); omitted runtime
		// services are not exercised by this plugin endpoints.
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		// unknown: spec-derived mocks, one per operation, keyed by operation path.
		const fixedOutputs: Record<string, unknown> = {
			'clients.listClients': {
				data: [{ id: 'rec-1' }],
				meta: { status: 200, success: true },
			},
			'clients.retrieveClient': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'clients.createClient': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'clients.updateClient': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'clients.deleteClient': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'clients.enableDirectBillingClient': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'clients.extendTrialClient': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'clients.retrieveClientFeatures': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'clients.updateClientFeatures': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'clients.retrieveClientProperties': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'clients.updateClientProperties': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'clients.deleteClientProperties': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'clients.retrieveClientResources': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'clients.updateClientResources': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'clients.retrieveClientSettings': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'clients.createClientSettings': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'clients.retrieveClientShareRights': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'clients.setClientShareRights': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'clients.deleteClientShareRight': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.listDatasources': {
				data: [{ id: 'rec-1' }],
				meta: { status: 200, success: true },
			},
			'datasources.retrieveDatasource': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.createDatasource': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.updateDatasource': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.deleteDatasource': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.enableDatasource': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.disableDatasource': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.importDatasource': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.deleteInstancesDatasource': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.retrieveDatasourceProperties': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.updateDatasourceProperties': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.deleteDatasourceProperties': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.retrieveDatasourceShareRights': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.setDatasourceShareRights': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.deleteDatasourceShareRight': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.listDatasourceInstances': {
				data: [{ id: 'rec-1' }],
				meta: { status: 200, success: true },
			},
			'datasources.retrieveDatasourceInstances': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.createDatasourceInstances': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.deleteDatasourceInstances': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.retrieveDatasourceInstancesData': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.updateDatasourceInstancesData': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.refreshDatasourceInstances': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.refreshDatasource': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.retrieveDatasourceInstancesProperties': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.updateDatasourceInstancesProperties': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'datasources.deleteDatasourceInstancesProperties': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'groups.listGroups': {
				data: [{ id: 'rec-1' }],
				meta: { status: 200, success: true },
			},
			'groups.retrieveGroup': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'groups.createGroup': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'groups.updateGroup': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'groups.deleteGroup': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'groups.retrieveGroupDefaultTabs': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'groups.retrieveGroupDefaultTab': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'groups.addGroupDefaultTabs': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'groups.updateGroupDefaultTab': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'groups.deleteGroupDefaultTab': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'groups.retrieveGroupUsers': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'groups.updateGroupUser': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'groups.deleteGroupUser': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'klips.listKlips': {
				data: [{ id: 'rec-1' }],
				meta: { status: 200, success: true },
			},
			'klips.retrieveKlip': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'klips.retrieveKlipClientInstances': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'klips.createKlip': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'klips.updateKlip': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'klips.deleteKlip': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'klips.retrieveKlipAnnotations': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'klips.retrieveKlipAnnotation': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'klips.createKlipAnnotations': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'klips.updateKlipAnnotation': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'klips.deleteKlipAnnotation': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'klips.updateFromParentKlip': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'klips.retrieveKlipSchema': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'klips.updateKlipSchema': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'klips.retrieveKlipShareRights': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'klips.setKlipShareRights': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'klips.deleteKlipShareRights': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'klips.importKlip': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'misc.retrieveProfile': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'misc.createDashboardPublishedLinks': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'misc.listDashboardPublishedLinks': {
				data: [{ id: 'rec-1' }],
				meta: { status: 200, success: true },
			},
			'misc.updateDashboardPublishedLinks': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'misc.deleteDashboardPublishedLinks': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'roles.listRoles': {
				data: [{ id: 'rec-1' }],
				meta: { status: 200, success: true },
			},
			'roles.retrieveRole': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'roles.updateRole': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'roles.createRole': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'roles.deleteRole': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'roles.retrieveRoleUsers': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'roles.updateRoleUser': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'roles.deleteRoleUser': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'roles.retrieveRolePermissions': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'roles.updateRolePermissions': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'roles.deleteRolePermissions': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'tabs.listTabs': {
				data: [{ id: 'rec-1' }],
				meta: { status: 200, success: true },
			},
			'tabs.retrieveTab': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'tabs.createTab': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'tabs.updateTab': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'tabs.deleteTab': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'tabs.retrieveTabKlipInstances': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'tabs.updateTabKlipInstances': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'tabs.deleteTabKlipInstance': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'tabs.retrieveTabLayout': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'tabs.updateTabLayout': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'tabs.retrieveTabShareRights': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'tabs.setTabShareRights': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'tabs.deleteTabShareRight': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'tabs.importTab': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'users.listUsers': {
				data: [{ id: 'rec-1' }],
				meta: { status: 200, success: true },
			},
			'users.retrieveUser': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'users.createUser': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'users.updateUser': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'users.deleteUser': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'users.retrieveUserGroups': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'users.updateUserGroup': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'users.deleteUserGroup': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'users.resendInviteUser': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'users.resetPasswordUser': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'users.retrieveUserProperties': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'users.updateUserProperties': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'users.deleteUserProperties': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'users.retrieveUserRoles': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'users.updateUserRole': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'users.deleteUserRole': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'users.retrieveUserTabInstances': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'users.updateUserTabInstances': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
			'users.deleteUserTabInstance': {
				data: { id: 'rec-1' },
				meta: { status: 200, success: true },
			},
		};
		let invokedOperations = 0;
		// unknown: the walk covers functions and group objects across the
		// plugin tree; the contract resolves only after the path joins.
		const visit = async (value: unknown, prefix: string[] = []) => {
			if (typeof value === 'function') {
				invokedOperations += 1;
				const path = prefix.join('.') as keyof typeof klipfolioEndpointSchemas;
				const contract = klipfolioEndpointSchemas[path];
				if (!contract) throw new Error(`Missing contract for ${path}`);
				if (!contract.input || !contract.output) {
					throw new Error(`Missing input or output contract for ${path}`);
				}
				// unknown: zod v4 schema objects are read structurally to build a
				// valid input; stricter typing would couple the test to zod.
				// buildValidInput expects the schema itself (it reads .shape
				// internally), so contract.input is passed, not a pre-extracted
				// shape object.
				const input = buildValidInput(
					contract.input as unknown as {
						shape: Record<string, ZodField>;
					},
				);
				if (!(path in fixedOutputs)) {
					throw new Error(
						'No fixed provider-shaped response registered for ' + String(path),
					);
				}
				const output = fixedOutputs[path];
				request.mockResolvedValue(output);
				const result =
					await // unknown: walked leaf invoked at the boundary under test
					(value as (context: unknown, args: unknown) => Promise<unknown>)(
						ctx,
						input,
					);
				expect(result).toEqual(output);
				return;
			}
			if (value && typeof value === 'object') {
				for (const [key, child] of Object.entries(value)) {
					await visit(child, [...prefix, key]);
				}
			}
		};

		await visit(plugin.endpoints);
		expect(invokedOperations).toBe(
			Object.keys(klipfolioEndpointSchemas).length,
		);
		expect(request).toHaveBeenCalledTimes(invokedOperations);
	});

	it('exposes the key builder and forwards hooks and error handlers', async () => {
		const plugin = klipfolio({ key: 'kf_key' });
		// unknown: the factory contract is exercised structurally; the plugin
		// type derives from the core CorsairPlugin mapping.
		const wired = plugin as unknown as {
			keyBuilder: (ctx: unknown, source: string) => Promise<string | undefined>;
			hooks: unknown;
			errorHandlers: Record<string, unknown>;
		};
		expect(typeof wired.keyBuilder).toBe('function');
		const key = await wired.keyBuilder({ authType: 'api_key' }, 'endpoint');
		expect(key).toBe('kf_key');
		const unkeyed = klipfolio({}) as unknown as {
			keyBuilder: (ctx: unknown, source: string) => Promise<string | undefined>;
		};
		await expect(
			unkeyed.keyBuilder(
				{ authType: 'api_key', keys: { get_api_key: async () => undefined } },
				'endpoint',
			),
		).rejects.toThrow();
		const hooks = { operation: {} };
		const hooked = klipfolio({ hooks: hooks as never });
		expect((hooked as unknown as { hooks: unknown }).hooks).toBe(hooks);
		const customDefault = {
			match: () => true,
			handler: async () => ({ maxRetries: 0 }),
		};
		const merged = klipfolio({ errorHandlers: { DEFAULT: customDefault } });
		const mergedHandlers = (
			merged as unknown as {
				errorHandlers: Record<string, unknown>;
			}
		).errorHandlers;
		expect(mergedHandlers.DEFAULT).toBe(customDefault);
		expect(mergedHandlers.RATE_LIMIT_ERROR).toBeDefined();
	});
});
