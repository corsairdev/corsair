import type { EndpointPathsOf, RequiredPluginEndpointMeta } from 'corsair/core';
import type { z } from 'zod';
import type { BlazemeterEndpoint, BlazemeterOperationKey } from '../operations';
import {
	BLAZEMETER_OPERATIONS,
	executeBlazemeterOperation,
	getBlazemeterOperation,
} from '../operations';
import {
	BlazemeterEndpointInputSchemas,
	BlazemeterEndpointOutputSchemas,
} from './types';

function endpoint(key: BlazemeterOperationKey): BlazemeterEndpoint {
	const definition = getBlazemeterOperation(key);
	return async (ctx, input = {}) =>
		executeBlazemeterOperation(ctx, input, definition);
}

export const blazemeterEndpointsNested = {
	transactions: {
		convert: endpoint('transactions.convert'),
		create: endpoint('transactions.create'),
		list: endpoint('transactions.list'),
	},
	schedules: {
		create: endpoint('schedules.create'),
		get: endpoint('schedules.get'),
		list: endpoint('schedules.list'),
		update: endpoint('schedules.update'),
		remove: endpoint('schedules.remove'),
	},
	assetDependencies: {
		create: endpoint('assetDependencies.create'),
		get: endpoint('assetDependencies.get'),
		list: endpoint('assetDependencies.list'),
		forAsset: endpoint('assetDependencies.forAsset'),
		updateForAsset: endpoint('assetDependencies.updateForAsset'),
		remove: endpoint('assetDependencies.remove'),
		removeMatching: endpoint('assetDependencies.removeMatching'),
	},
	multiTests: {
		create: endpoint('multiTests.create'),
		get: endpoint('multiTests.get'),
		list: endpoint('multiTests.list'),
	},
	privateLocations: {
		create: endpoint('privateLocations.create'),
		createAgent: endpoint('privateLocations.createAgent'),
		list: endpoint('privateLocations.list'),
		removeWorkspace: endpoint('privateLocations.removeWorkspace'),
	},
	projects: {
		create: endpoint('projects.create'),
		get: endpoint('projects.get'),
		list: endpoint('projects.list'),
		update: endpoint('projects.update'),
		remove: endpoint('projects.remove'),
	},
	search: {
		execute: endpoint('search.execute'),
		metadata: endpoint('search.metadata'),
	},
	tags: {
		create: endpoint('tags.create'),
		list: endpoint('tags.list'),
	},
	tests: {
		create: endpoint('tests.create'),
		get: endpoint('tests.get'),
		list: endpoint('tests.list'),
		update: endpoint('tests.update'),
		remove: endpoint('tests.remove'),
		duplicate: endpoint('tests.duplicate'),
		files: endpoint('tests.files'),
		uploadFile: endpoint('tests.uploadFile'),
		removeFile: endpoint('tests.removeFile'),
		validate: endpoint('tests.validate'),
		validations: endpoint('tests.validations'),
		start: endpoint('tests.start'),
		stop: endpoint('tests.stop'),
	},
	assets: {
		create: endpoint('assets.create'),
		get: endpoint('assets.get'),
		list: endpoint('assets.list'),
		update: endpoint('assets.update'),
		remove: endpoint('assets.remove'),
		data: endpoint('assets.data'),
		uploadData: endpoint('assets.uploadData'),
	},
	packages: {
		create: endpoint('packages.create'),
		get: endpoint('packages.get'),
		list: endpoint('packages.list'),
		update: endpoint('packages.update'),
		remove: endpoint('packages.remove'),
		dependencies: endpoint('packages.dependencies'),
		updateDependencies: endpoint('packages.updateDependencies'),
		export: endpoint('packages.export'),
		exportMany: endpoint('packages.exportMany'),
		import: endpoint('packages.import'),
	},
	testData: {
		generateFromModel: endpoint('testData.generateFromModel'),
		generate: endpoint('testData.generate'),
		getModel: endpoint('testData.getModel'),
		publish: endpoint('testData.publish'),
		validateModel: endpoint('testData.validateModel'),
	},
	accounts: { list: endpoint('accounts.list') },
	generator: {
		functions: endpoint('generator.functions'),
		seedLists: endpoint('generator.seedLists'),
		cardIssuers: endpoint('generator.cardIssuers'),
	},
	info: {
		health: endpoint('info.health'),
		version: endpoint('info.version'),
	},
	masters: {
		summary: endpoint('masters.summary'),
		stop: endpoint('masters.stop'),
	},
	regions: { list: endpoint('regions.list') },
	sharedFolders: { list: endpoint('sharedFolders.list') },
	user: {
		get: endpoint('user.get'),
		activeSessions: endpoint('user.activeSessions'),
		invites: endpoint('user.invites'),
		projects: endpoint('user.projects'),
		register: endpoint('user.register'),
		terminateSessions: endpoint('user.terminateSessions'),
	},
	workspaces: {
		get: endpoint('workspaces.get'),
		list: endpoint('workspaces.list'),
		users: endpoint('workspaces.users'),
		updateUser: endpoint('workspaces.updateUser'),
		removeLogs: endpoint('workspaces.removeLogs'),
		removeManagers: endpoint('workspaces.removeManagers'),
		terminateMasters: endpoint('workspaces.terminateMasters'),
	},
	serviceMockTemplates: {
		get: endpoint('serviceMockTemplates.get'),
		list: endpoint('serviceMockTemplates.list'),
		update: endpoint('serviceMockTemplates.update'),
	},
} as const;

/**
 * Compile-time proof that the endpoint tree and the operation catalog describe
 * exactly the same set of endpoints. Without this, the `Record<...>` casts below
 * would hide a tree entry that has no catalog definition (or the reverse), and
 * `blazemeterEndpointMeta` would silently lose the exhaustiveness that
 * `RequiredPluginEndpointMeta` is meant to enforce.
 */
type MutuallyAssignable<A, B> = [A] extends [B]
	? [B] extends [A]
		? true
		: never
	: never;

const _catalogCoversEveryEndpointPath: MutuallyAssignable<
	BlazemeterOperationKey,
	EndpointPathsOf<typeof blazemeterEndpointsNested>
> = true;
void _catalogCoversEveryEndpointPath;

export const blazemeterEndpointSchemas = Object.fromEntries(
	BLAZEMETER_OPERATIONS.map((definition) => [
		definition.key,
		{
			input: BlazemeterEndpointInputSchemas[definition.key],
			output: BlazemeterEndpointOutputSchemas[definition.key],
		},
	]),
) as Record<BlazemeterOperationKey, { input: z.ZodType; output: z.ZodType }>;

export const blazemeterEndpointMeta: RequiredPluginEndpointMeta<
	typeof blazemeterEndpointsNested
> = Object.fromEntries(
	BLAZEMETER_OPERATIONS.map((definition) => [
		definition.key,
		{
			riskLevel: definition.riskLevel,
			irreversible:
				'irreversible' in definition ? definition.irreversible : undefined,
			description: definition.description,
		},
	]),
) as RequiredPluginEndpointMeta<typeof blazemeterEndpointsNested>;
