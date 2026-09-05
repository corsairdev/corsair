import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { KibanaEndpoints } from '..';
import { makeKibanaRequest } from '../client';
import type { KibanaEndpointOutputs } from './types';

// All paths verified in the Kibana OpenAPI spec (kibana.json); query params
// below mirror the spec operation parameters. List responses are
// passthrough-validated.

const pageQuery = {
	page: z.number().optional(),
	perPage: z.number().optional(),
	kuery: z.string().optional(),
};

type Ctx = Parameters<KibanaEndpoints['fleetAgentPoliciesList']>[0];

async function baseUrlOf(ctx: Ctx): Promise<string> {
	return ctx.options.baseUrl ?? (await ctx.keys.get_base_url()) ?? '';
}

function q(
	input: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> | undefined {
	const entries = Object.entries(input).filter(([, v]) => v !== undefined);
	return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

export const FleetCheckPermissionsInputSchema = z.object({
	fleetServerSetup: z.boolean().optional(),
});
export type FleetCheckPermissionsInput = z.infer<
	typeof FleetCheckPermissionsInputSchema
>;
export const FleetCheckPermissionsResponseSchema = z
	.object({ success: z.boolean().optional(), error: z.string().optional() })
	.passthrough();
export type FleetCheckPermissionsResponse = z.infer<
	typeof FleetCheckPermissionsResponseSchema
>;

export const FleetAgentPoliciesListInputSchema = z.object({
	...pageQuery,
	full: z.boolean().optional(),
	withAgentCount: z.boolean().optional(),
	showUpgradeable: z.boolean().optional(),
});
export type FleetAgentPoliciesListInput = z.infer<
	typeof FleetAgentPoliciesListInputSchema
>;
export const FleetAgentPoliciesListResponseSchema = z
	.object({
		items: z.array(z.record(z.string(), z.unknown())).optional(),
		total: z.number().optional(),
	})
	.passthrough();
export type FleetAgentPoliciesListResponse = z.infer<
	typeof FleetAgentPoliciesListResponseSchema
>;

export const FleetPackagePoliciesListInputSchema = z.object({
	...pageQuery,
	withAgentCount: z.boolean().optional(),
	showUpgradeable: z.boolean().optional(),
});
export type FleetPackagePoliciesListInput = z.infer<
	typeof FleetPackagePoliciesListInputSchema
>;
export const FleetPackagePoliciesListResponseSchema =
	FleetAgentPoliciesListResponseSchema;
export type FleetPackagePoliciesListResponse = z.infer<
	typeof FleetPackagePoliciesListResponseSchema
>;

export const FleetEnrollmentKeysListInputSchema = z.object({ ...pageQuery });
export type FleetEnrollmentKeysListInput = z.infer<
	typeof FleetEnrollmentKeysListInputSchema
>;
export const FleetEnrollmentKeysListResponseSchema = z
	.object({
		items: z.array(z.record(z.string(), z.unknown())).optional(),
		total: z.number().optional(),
	})
	.passthrough();
export type FleetEnrollmentKeysListResponse = z.infer<
	typeof FleetEnrollmentKeysListResponseSchema
>;

export const FleetEnrollmentKeyGetInputSchema = z.object({ keyId: z.string() });
export type FleetEnrollmentKeyGetInput = z.infer<
	typeof FleetEnrollmentKeyGetInputSchema
>;
export const FleetEnrollmentKeyGetResponseSchema = z
	.object({ item: z.record(z.string(), z.unknown()).optional() })
	.passthrough();
export type FleetEnrollmentKeyGetResponse = z.infer<
	typeof FleetEnrollmentKeyGetResponseSchema
>;

export const FleetServerHostsListInputSchema = z.object({});
export type FleetServerHostsListInput = z.infer<
	typeof FleetServerHostsListInputSchema
>;
export const FleetServerHostsListResponseSchema = z
	.object({ items: z.array(z.record(z.string(), z.unknown())).optional() })
	.passthrough();
export type FleetServerHostsListResponse = z.infer<
	typeof FleetServerHostsListResponseSchema
>;

export const FleetServerHostGetInputSchema = z.object({ itemId: z.string() });
export type FleetServerHostGetInput = z.infer<
	typeof FleetServerHostGetInputSchema
>;
export const FleetServerHostGetResponseSchema = z
	.object({ item: z.record(z.string(), z.unknown()).optional() })
	.passthrough();
export type FleetServerHostGetResponse = z.infer<
	typeof FleetServerHostGetResponseSchema
>;

export const FleetOutputDeleteInputSchema = z.object({ outputId: z.string() });
export type FleetOutputDeleteInput = z.infer<
	typeof FleetOutputDeleteInputSchema
>;
export const FleetOutputDeleteResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type FleetOutputDeleteResponse = z.infer<
	typeof FleetOutputDeleteResponseSchema
>;

export const FleetProxyDeleteInputSchema = z.object({ itemId: z.string() });
export type FleetProxyDeleteInput = z.infer<typeof FleetProxyDeleteInputSchema>;
export const FleetProxyDeleteResponseSchema = z.record(z.string(), z.unknown());
export type FleetProxyDeleteResponse = z.infer<
	typeof FleetProxyDeleteResponseSchema
>;

export const FleetAgentsSetupInputSchema = z.object({});
export type FleetAgentsSetupInput = z.infer<typeof FleetAgentsSetupInputSchema>;
export const FleetAgentsSetupResponseSchema = z
	.object({ isReady: z.boolean().optional() })
	.passthrough();
export type FleetAgentsSetupResponse = z.infer<
	typeof FleetAgentsSetupResponseSchema
>;

export const FleetAgentsVersionsInputSchema = z.object({});
export type FleetAgentsVersionsInput = z.infer<
	typeof FleetAgentsVersionsInputSchema
>;
export const FleetAgentsVersionsResponseSchema = z
	.object({ items: z.array(z.string()).optional() })
	.passthrough();
export type FleetAgentsVersionsResponse = z.infer<
	typeof FleetAgentsVersionsResponseSchema
>;

export const FleetEpmPackagesListInputSchema = z.object({});
export type FleetEpmPackagesListInput = z.infer<
	typeof FleetEpmPackagesListInputSchema
>;
export const FleetEpmPackagesListResponseSchema = z
	.object({ response: z.array(z.record(z.string(), z.unknown())).optional() })
	.passthrough();
export type FleetEpmPackagesListResponse = z.infer<
	typeof FleetEpmPackagesListResponseSchema
>;

export const FleetEpmPackagesLimitedInputSchema = z.object({});
export type FleetEpmPackagesLimitedInput = z.infer<
	typeof FleetEpmPackagesLimitedInputSchema
>;
export const FleetEpmPackagesLimitedResponseSchema = z
	.object({ response: z.array(z.string()).optional() })
	.passthrough();
export type FleetEpmPackagesLimitedResponse = z.infer<
	typeof FleetEpmPackagesLimitedResponseSchema
>;

export const FleetEpmPackagesInstalledInputSchema = z.object({
	nameQuery: z.string().optional(),
	perPage: z.number().optional(),
});
export type FleetEpmPackagesInstalledInput = z.infer<
	typeof FleetEpmPackagesInstalledInputSchema
>;
export const FleetEpmPackagesInstalledResponseSchema = z
	.object({ response: z.array(z.record(z.string(), z.unknown())).optional() })
	.passthrough();
export type FleetEpmPackagesInstalledResponse = z.infer<
	typeof FleetEpmPackagesInstalledResponseSchema
>;

export const FleetEpmPackageDetailsInputSchema = z.object({
	pkgName: z.string(),
	pkgVersion: z.string(),
	full: z.boolean().optional(),
});
export type FleetEpmPackageDetailsInput = z.infer<
	typeof FleetEpmPackageDetailsInputSchema
>;
export const FleetEpmPackageDetailsResponseSchema = z
	.object({ response: z.record(z.string(), z.unknown()).optional() })
	.passthrough();
export type FleetEpmPackageDetailsResponse = z.infer<
	typeof FleetEpmPackageDetailsResponseSchema
>;

export const FleetEpmPackageFileInputSchema = z.object({
	pkgName: z.string(),
	pkgVersion: z.string(),
	filePath: z.string(),
});
export type FleetEpmPackageFileInput = z.infer<
	typeof FleetEpmPackageFileInputSchema
>;
export const FleetEpmPackageFileResponseSchema = z.object({}).passthrough();
export type FleetEpmPackageFileResponse = z.infer<
	typeof FleetEpmPackageFileResponseSchema
>;

export const FleetEpmPackageStatsInputSchema = z.object({
	pkgName: z.string(),
});
export type FleetEpmPackageStatsInput = z.infer<
	typeof FleetEpmPackageStatsInputSchema
>;
export const FleetEpmPackageStatsResponseSchema = z
	.object({ response: z.record(z.string(), z.unknown()).optional() })
	.passthrough();
export type FleetEpmPackageStatsResponse = z.infer<
	typeof FleetEpmPackageStatsResponseSchema
>;

export const FleetEpmDataStreamsInputSchema = z.object({
	type: z.string().optional(),
	datasetQuery: z.string().optional(),
});
export type FleetEpmDataStreamsInput = z.infer<
	typeof FleetEpmDataStreamsInputSchema
>;
export const FleetEpmDataStreamsResponseSchema = z
	.object({
		data_streams: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type FleetEpmDataStreamsResponse = z.infer<
	typeof FleetEpmDataStreamsResponseSchema
>;

export const FleetEpmCategoriesInputSchema = z.object({
	prerelease: z.boolean().optional(),
});
export type FleetEpmCategoriesInput = z.infer<
	typeof FleetEpmCategoriesInputSchema
>;
export const FleetEpmCategoriesResponseSchema = z
	.object({ response: z.array(z.record(z.string(), z.unknown())).optional() })
	.passthrough();
export type FleetEpmCategoriesResponse = z.infer<
	typeof FleetEpmCategoriesResponseSchema
>;

export const checkPermissions: KibanaEndpoints['fleetCheckPermissions'] =
	async (ctx, input) => {
		const baseUrl = await baseUrlOf(ctx);
		const response = await makeKibanaRequest<
			KibanaEndpointOutputs['fleetCheckPermissions']
		>('api/fleet/check-permissions', baseUrl, ctx.key, {
			method: 'GET',
			query: q({ fleetServerSetup: input.fleetServerSetup }),
		});
		await logEventFromContext(
			ctx,
			'kibana.fleet.checkPermissions',
			{ ...input },
			'completed',
		);
		return response;
	};

export const agentPoliciesList: KibanaEndpoints['fleetAgentPoliciesList'] =
	async (ctx, input) => {
		const baseUrl = await baseUrlOf(ctx);
		const response = await makeKibanaRequest<
			KibanaEndpointOutputs['fleetAgentPoliciesList']
		>('api/fleet/agent_policies', baseUrl, ctx.key, {
			method: 'GET',
			query: q({ ...input }),
		});
		await logEventFromContext(
			ctx,
			'kibana.fleet.agentPoliciesList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const packagePoliciesList: KibanaEndpoints['fleetPackagePoliciesList'] =
	async (ctx, input) => {
		const baseUrl = await baseUrlOf(ctx);
		const response = await makeKibanaRequest<
			KibanaEndpointOutputs['fleetPackagePoliciesList']
		>('api/fleet/package_policies', baseUrl, ctx.key, {
			method: 'GET',
			query: q({ ...input }),
		});
		await logEventFromContext(
			ctx,
			'kibana.fleet.packagePoliciesList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const enrollmentKeysList: KibanaEndpoints['fleetEnrollmentKeysList'] =
	async (ctx, input) => {
		const baseUrl = await baseUrlOf(ctx);
		const response = await makeKibanaRequest<
			KibanaEndpointOutputs['fleetEnrollmentKeysList']
		>('api/fleet/enrollment_api_keys', baseUrl, ctx.key, {
			method: 'GET',
			query: q({ ...input }),
		});
		await logEventFromContext(
			ctx,
			'kibana.fleet.enrollmentKeysList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const enrollmentKeyGet: KibanaEndpoints['fleetEnrollmentKeyGet'] =
	async (ctx, input) => {
		const baseUrl = await baseUrlOf(ctx);
		const response = await makeKibanaRequest<
			KibanaEndpointOutputs['fleetEnrollmentKeyGet']
		>(
			`api/fleet/enrollment_api_keys/${encodeURIComponent(input.keyId)}`,
			baseUrl,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'kibana.fleet.enrollmentKeyGet',
			{ ...input },
			'completed',
		);
		return response;
	};

export const serverHostsList: KibanaEndpoints['fleetServerHostsList'] = async (
	ctx,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['fleetServerHostsList']
	>('api/fleet/fleet_server_hosts', baseUrl, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'kibana.fleet.serverHostsList',
		{},
		'completed',
	);
	return response;
};

export const serverHostGet: KibanaEndpoints['fleetServerHostGet'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['fleetServerHostGet']
	>(
		`api/fleet/fleet_server_hosts/${encodeURIComponent(input.itemId)}`,
		baseUrl,
		ctx.key,
		{
			method: 'GET',
		},
	);
	await logEventFromContext(
		ctx,
		'kibana.fleet.serverHostGet',
		{ ...input },
		'completed',
	);
	return response;
};

export const outputDelete: KibanaEndpoints['fleetOutputDelete'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['fleetOutputDelete']
	>(
		`api/fleet/outputs/${encodeURIComponent(input.outputId)}`,
		baseUrl,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	await logEventFromContext(
		ctx,
		'kibana.fleet.outputDelete',
		{ ...input },
		'completed',
	);
	return response;
};

export const proxyDelete: KibanaEndpoints['fleetProxyDelete'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['fleetProxyDelete']
	>(`api/fleet/proxies/${encodeURIComponent(input.itemId)}`, baseUrl, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'kibana.fleet.proxyDelete',
		{ ...input },
		'completed',
	);
	return response;
};

export const agentsSetup: KibanaEndpoints['fleetAgentsSetup'] = async (ctx) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['fleetAgentsSetup']
	>('api/fleet/agents/setup', baseUrl, ctx.key, { method: 'GET' });
	await logEventFromContext(ctx, 'kibana.fleet.agentsSetup', {}, 'completed');
	return response;
};

export const agentsVersions: KibanaEndpoints['fleetAgentsVersions'] = async (
	ctx,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['fleetAgentsVersions']
	>('api/fleet/agents/available_versions', baseUrl, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'kibana.fleet.agentsVersions',
		{},
		'completed',
	);
	return response;
};

export const epmPackagesList: KibanaEndpoints['fleetEpmPackagesList'] = async (
	ctx,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['fleetEpmPackagesList']
	>('api/fleet/epm/packages', baseUrl, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'kibana.fleet.epmPackagesList',
		{},
		'completed',
	);
	return response;
};

export const epmPackagesLimited: KibanaEndpoints['fleetEpmPackagesLimited'] =
	async (ctx) => {
		const baseUrl = await baseUrlOf(ctx);
		const response = await makeKibanaRequest<
			KibanaEndpointOutputs['fleetEpmPackagesLimited']
		>('api/fleet/epm/packages/limited', baseUrl, ctx.key, { method: 'GET' });
		await logEventFromContext(
			ctx,
			'kibana.fleet.epmPackagesLimited',
			{},
			'completed',
		);
		return response;
	};

export const epmPackagesInstalled: KibanaEndpoints['fleetEpmPackagesInstalled'] =
	async (ctx, input) => {
		const baseUrl = await baseUrlOf(ctx);
		const response = await makeKibanaRequest<
			KibanaEndpointOutputs['fleetEpmPackagesInstalled']
		>('api/fleet/epm/packages/installed', baseUrl, ctx.key, {
			method: 'GET',
			query: q({ ...input }),
		});
		await logEventFromContext(
			ctx,
			'kibana.fleet.epmPackagesInstalled',
			{ ...input },
			'completed',
		);
		return response;
	};

export const epmPackageDetails: KibanaEndpoints['fleetEpmPackageDetails'] =
	async (ctx, input) => {
		const baseUrl = await baseUrlOf(ctx);
		const response = await makeKibanaRequest<
			KibanaEndpointOutputs['fleetEpmPackageDetails']
		>(
			`api/fleet/epm/packages/${encodeURIComponent(input.pkgName)}/${encodeURIComponent(input.pkgVersion)}`,
			baseUrl,
			ctx.key,
			{
				method: 'GET',
				query: q({ full: input.full }),
			},
		);
		await logEventFromContext(
			ctx,
			'kibana.fleet.epmPackageDetails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const epmPackageFile: KibanaEndpoints['fleetEpmPackageFile'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['fleetEpmPackageFile']
	>(
		`api/fleet/epm/packages/${encodeURIComponent(input.pkgName)}/${encodeURIComponent(input.pkgVersion)}/${input.filePath.split('/').map(encodeURIComponent).join('/')}`,
		baseUrl,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'kibana.fleet.epmPackageFile',
		{ ...input },
		'completed',
	);
	return response;
};

export const epmPackageStats: KibanaEndpoints['fleetEpmPackageStats'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['fleetEpmPackageStats']
	>(
		`api/fleet/epm/packages/${encodeURIComponent(input.pkgName)}/stats`,
		baseUrl,
		ctx.key,
		{
			method: 'GET',
		},
	);
	await logEventFromContext(
		ctx,
		'kibana.fleet.epmPackageStats',
		{ ...input },
		'completed',
	);
	return response;
};

export const epmDataStreams: KibanaEndpoints['fleetEpmDataStreams'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['fleetEpmDataStreams']
	>('api/fleet/epm/data_streams', baseUrl, ctx.key, {
		method: 'GET',
		query: q({ ...input }),
	});
	await logEventFromContext(
		ctx,
		'kibana.fleet.epmDataStreams',
		{ ...input },
		'completed',
	);
	return response;
};

export const epmCategories: KibanaEndpoints['fleetEpmCategories'] = async (
	ctx,
	input,
) => {
	const baseUrl = await baseUrlOf(ctx);
	const response = await makeKibanaRequest<
		KibanaEndpointOutputs['fleetEpmCategories']
	>('api/fleet/epm/categories', baseUrl, ctx.key, {
		method: 'GET',
		query: q({ ...input }),
	});
	await logEventFromContext(
		ctx,
		'kibana.fleet.epmCategories',
		{ ...input },
		'completed',
	);
	return response;
};
