import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { RunpodEndpoints } from '..';
import type { RunpodGraphqlVariables } from '../client';
import { makeRunpodGraphql, makeRunpodRequest } from '../client';
import type { ListCpuTypesInput, ListPodsInput } from './types';
import {
	CreateClusterInputSchema,
	CreateSecretInputSchema,
	DeleteRegistryAuthInputSchema,
	DeleteTemplateInputSchema,
	GetGpuTypesInputSchema,
	GetMyselfInputSchema,
	GetPodInputSchema,
	ListCpuTypesInputSchema,
	ListPodsInputSchema,
	RunpodEndpointOutputSchemas,
	SaveEndpointInputSchema,
	SaveRegistryAuthInputSchema,
	SaveTemplateInputSchema,
	UpdateRegistryAuthInputSchema,
	UpdateUserSettingsInputSchema,
} from './types';

async function validated<I, O>(
	inputSchema: z.ZodType<I>,
	outputSchema: z.ZodType<O>,
	input: I,
	run: (parsed: I) => Promise<O>,
): Promise<O> {
	return outputSchema.parse(await run(inputSchema.parse(input)));
}

function restQuery(
	input: ListPodsInput | ListCpuTypesInput,
): Record<string, string | number | boolean | undefined> {
	const query: Record<string, string | number | boolean | undefined> = {};
	for (const [key, value] of Object.entries(input)) {
		if (value === undefined) continue;
		query[key] = Array.isArray(value) ? value.join(',') : value;
	}
	return query;
}

export const getMyself: RunpodEndpoints['getMyself'] = async (ctx, input) =>
	validated(
		GetMyselfInputSchema,
		RunpodEndpointOutputSchemas.getMyself,
		input,
		async () => {
			const data = await makeRunpodGraphql<{
				myself: z.infer<typeof RunpodEndpointOutputSchemas.getMyself>;
			}>(
				ctx.key,
				`query {
					myself { id email multiFactorEnabled pubKey }
				}`,
			);
			await logEventFromContext(ctx, 'runpod.account.myself', {}, 'completed');
			return data.myself;
		},
	);

export const updateUserSettings: RunpodEndpoints['updateUserSettings'] = async (
	ctx,
	input,
) =>
	validated(
		UpdateUserSettingsInputSchema,
		RunpodEndpointOutputSchemas.updateUserSettings,
		input,
		async (parsed) => {
			const data = await makeRunpodGraphql<{
				updateUserSettings: z.infer<
					typeof RunpodEndpointOutputSchemas.updateUserSettings
				>;
			}>(
				ctx.key,
				`mutation ($pubKey: String!) {
					updateUserSettings(input: { pubKey: $pubKey }) { id pubKey }
				}`,
				{ pubKey: parsed.pubKey },
			);
			await logEventFromContext(
				ctx,
				'runpod.account.updateSettings',
				{},
				'completed',
			);
			return data.updateUserSettings;
		},
	);

export const getGpuTypes: RunpodEndpoints['getGpuTypes'] = async (ctx, input) =>
	validated(
		GetGpuTypesInputSchema,
		RunpodEndpointOutputSchemas.getGpuTypes,
		input,
		async (parsed) => {
			const gpuCount = parsed.gpuCount ?? 1;
			const data = parsed.id
				? await makeRunpodGraphql<{
						gpuTypes: z.infer<typeof RunpodEndpointOutputSchemas.getGpuTypes>;
					}>(
						ctx.key,
						`query ($id: String!, $gpuCount: Int!) {
							gpuTypes(input: { id: $id }) {
								id displayName memoryInGb secureCloud communityCloud
								lowestPrice(input: { gpuCount: $gpuCount }) {
									uninterruptablePrice stockStatus availableGpuCounts
								}
							}
						}`,
						{ id: parsed.id, gpuCount },
					)
				: await makeRunpodGraphql<{
						gpuTypes: z.infer<typeof RunpodEndpointOutputSchemas.getGpuTypes>;
					}>(
						ctx.key,
						`query ($gpuCount: Int!) {
							gpuTypes {
								id displayName memoryInGb secureCloud communityCloud
								lowestPrice(input: { gpuCount: $gpuCount }) {
									uninterruptablePrice stockStatus availableGpuCounts
								}
							}
						}`,
						{ gpuCount },
					);
			await logEventFromContext(
				ctx,
				'runpod.catalog.gpuTypes',
				{ id: parsed.id },
				'completed',
			);
			return data.gpuTypes;
		},
	);

export const listCpuTypes: RunpodEndpoints['listCpuTypes'] = async (
	ctx,
	input,
) =>
	validated(
		ListCpuTypesInputSchema,
		RunpodEndpointOutputSchemas.listCpuTypes,
		input,
		async (parsed) => {
			const response = await makeRunpodRequest<
				z.infer<typeof RunpodEndpointOutputSchemas.listCpuTypes>
			>('v2', '/v2/catalog/cpus', ctx.key, {
				method: 'GET',
				query: restQuery(parsed),
			});
			await logEventFromContext(
				ctx,
				'runpod.catalog.cpuTypes',
				parsed,
				'completed',
			);
			return response;
		},
	);

export const listPods: RunpodEndpoints['listPods'] = async (ctx, input) =>
	validated(
		ListPodsInputSchema,
		RunpodEndpointOutputSchemas.listPods,
		input,
		async (parsed) => {
			const response = await makeRunpodRequest<
				z.infer<typeof RunpodEndpointOutputSchemas.listPods>
			>('v1', '/pods', ctx.key, {
				method: 'GET',
				query: restQuery(parsed),
			});
			await logEventFromContext(ctx, 'runpod.pods.list', parsed, 'completed');
			return response;
		},
	);

export const getPod: RunpodEndpoints['getPod'] = async (ctx, input) =>
	validated(
		GetPodInputSchema,
		RunpodEndpointOutputSchemas.getPod,
		input,
		async (parsed) => {
			const { podId, ...query } = parsed;
			const response = await makeRunpodRequest<
				z.infer<typeof RunpodEndpointOutputSchemas.getPod>
			>('v1', `/pods/${encodeURIComponent(podId)}`, ctx.key, {
				method: 'GET',
				query,
			});
			await logEventFromContext(ctx, 'runpod.pods.get', { podId }, 'completed');
			return response;
		},
	);

export const createCluster: RunpodEndpoints['createCluster'] = async (
	ctx,
	input,
) =>
	validated(
		CreateClusterInputSchema,
		RunpodEndpointOutputSchemas.createCluster,
		input,
		async (parsed) => {
			const response = await makeRunpodRequest<
				z.infer<typeof RunpodEndpointOutputSchemas.createCluster>
			>('v2', '/v2/clusters', ctx.key, {
				method: 'POST',
				body: parsed,
			});
			await logEventFromContext(
				ctx,
				'runpod.clusters.create',
				{ name: parsed.name, type: parsed.type },
				'completed',
			);
			return response;
		},
	);

export const createSecret: RunpodEndpoints['createSecret'] = async (
	ctx,
	input,
) =>
	validated(
		CreateSecretInputSchema,
		RunpodEndpointOutputSchemas.createSecret,
		input,
		async (parsed) => {
			const data = await makeRunpodGraphql<{
				secretCreate: z.infer<typeof RunpodEndpointOutputSchemas.createSecret>;
			}>(
				ctx.key,
				`mutation ($name: String!, $value: String!, $description: String) {
					secretCreate(input: { name: $name, value: $value, description: $description }) {
						id name description
					}
				}`,
				parsed,
			);
			await logEventFromContext(
				ctx,
				'runpod.secrets.create',
				{ name: parsed.name },
				'completed',
			);
			return data.secretCreate;
		},
	);

export const saveRegistryAuth: RunpodEndpoints['saveRegistryAuth'] = async (
	ctx,
	input,
) =>
	validated(
		SaveRegistryAuthInputSchema,
		RunpodEndpointOutputSchemas.saveRegistryAuth,
		input,
		async (parsed) => {
			const response = await makeRunpodRequest<
				z.infer<typeof RunpodEndpointOutputSchemas.saveRegistryAuth>
			>('v1', '/containerregistryauth', ctx.key, {
				method: 'POST',
				body: parsed,
			});
			await logEventFromContext(
				ctx,
				'runpod.registries.save',
				{ name: parsed.name },
				'completed',
			);
			return response;
		},
	);

export const updateRegistryAuth: RunpodEndpoints['updateRegistryAuth'] = async (
	ctx,
	input,
) =>
	validated(
		UpdateRegistryAuthInputSchema,
		RunpodEndpointOutputSchemas.updateRegistryAuth,
		input,
		async (parsed) => {
			const data = await makeRunpodGraphql<{
				updateRegistryAuth: z.infer<
					typeof RunpodEndpointOutputSchemas.updateRegistryAuth
				>;
			}>(
				ctx.key,
				`mutation ($id: String!, $username: String!, $password: String!) {
					updateRegistryAuth(input: { id: $id, username: $username, password: $password }) {
						id name
					}
				}`,
				parsed,
			);
			await logEventFromContext(
				ctx,
				'runpod.registries.update',
				{ id: parsed.id },
				'completed',
			);
			return data.updateRegistryAuth;
		},
	);

export const deleteRegistryAuth: RunpodEndpoints['deleteRegistryAuth'] = async (
	ctx,
	input,
) =>
	validated(
		DeleteRegistryAuthInputSchema,
		RunpodEndpointOutputSchemas.deleteRegistryAuth,
		input,
		async (parsed) => {
			const response = await makeRunpodRequest<
				z.infer<typeof RunpodEndpointOutputSchemas.deleteRegistryAuth>
			>(
				'v1',
				`/containerregistryauth/${encodeURIComponent(parsed.containerRegistryAuthId)}`,
				ctx.key,
				{ method: 'DELETE' },
			);
			await logEventFromContext(
				ctx,
				'runpod.registries.delete',
				{ containerRegistryAuthId: parsed.containerRegistryAuthId },
				'completed',
			);
			return response ?? {};
		},
	);

export const saveTemplate: RunpodEndpoints['saveTemplate'] = async (
	ctx,
	input,
) =>
	validated(
		SaveTemplateInputSchema,
		RunpodEndpointOutputSchemas.saveTemplate,
		input,
		async (parsed) => {
			const data = await makeRunpodGraphql<{
				saveTemplate: z.infer<typeof RunpodEndpointOutputSchemas.saveTemplate>;
			}>(
				ctx.key,
				`mutation ($input: SaveTemplateInput!) {
					saveTemplate(input: $input) {
						id name imageName containerDiskInGb volumeInGb isServerless
						dockerArgs ports readme volumeMountPath env { key value }
					}
				}`,
				{
					input: {
						...parsed,
						dockerArgs: parsed.dockerArgs ?? '',
						env: parsed.env ?? [],
						ports: parsed.ports ?? '',
						readme: parsed.readme ?? '',
						volumeMountPath: parsed.volumeMountPath ?? '',
					},
				},
			);
			await logEventFromContext(
				ctx,
				'runpod.templates.save',
				{ name: parsed.name, id: parsed.id },
				'completed',
			);
			return data.saveTemplate;
		},
	);

export const deleteTemplate: RunpodEndpoints['deleteTemplate'] = async (
	ctx,
	input,
) =>
	validated(
		DeleteTemplateInputSchema,
		RunpodEndpointOutputSchemas.deleteTemplate,
		input,
		async (parsed) => {
			await makeRunpodGraphql<{ deleteTemplate: null }>(
				ctx.key,
				`mutation ($templateName: String!) {
					deleteTemplate(templateName: $templateName)
				}`,
				parsed,
			);
			await logEventFromContext(
				ctx,
				'runpod.templates.delete',
				{ templateName: parsed.templateName },
				'completed',
			);
			return { success: true as const };
		},
	);

export const saveEndpoint: RunpodEndpoints['saveEndpoint'] = async (
	ctx,
	input,
) =>
	validated(
		SaveEndpointInputSchema,
		RunpodEndpointOutputSchemas.saveEndpoint,
		input,
		async (parsed) => {
			const variables: RunpodGraphqlVariables = {
				id: parsed.id,
				name: parsed.name,
				templateId: parsed.templateId,
				gpuIds: parsed.gpuIds,
				idleTimeout: parsed.idleTimeout,
				locations: parsed.locations,
				scalerType: parsed.scalerType,
				scalerValue: parsed.scalerValue,
				workersMin: parsed.workersMin,
				workersMax: parsed.workersMax,
				networkVolumeId: parsed.networkVolumeId,
				type: parsed.type,
				flashBootType: parsed.flashBootType,
			};
			const data = await makeRunpodGraphql<{
				saveEndpoint: z.infer<typeof RunpodEndpointOutputSchemas.saveEndpoint>;
			}>(
				ctx.key,
				`mutation (
					$id: String
					$name: String!
					$templateId: String!
					$gpuIds: String!
					$idleTimeout: Int
					$locations: String
					$scalerType: String
					$scalerValue: Int
					$workersMin: Int
					$workersMax: Int
					$networkVolumeId: String
					$type: EndpointType
					$flashBootType: FlashBootType
				) {
					saveEndpoint(input: {
						id: $id
						name: $name
						templateId: $templateId
						gpuIds: $gpuIds
						idleTimeout: $idleTimeout
						locations: $locations
						scalerType: $scalerType
						scalerValue: $scalerValue
						workersMin: $workersMin
						workersMax: $workersMax
						networkVolumeId: $networkVolumeId
						type: $type
						flashBootType: $flashBootType
					}) {
						id name gpuIds templateId idleTimeout locations
						flashBootType scalerType scalerValue workersMin workersMax
					}
				}`,
				variables,
			);
			await logEventFromContext(
				ctx,
				'runpod.endpoints.save',
				{ name: parsed.name, id: parsed.id },
				'completed',
			);
			return data.saveEndpoint;
		},
	);
