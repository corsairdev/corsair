import { z } from 'zod';

/** @see https://docs.runpod.io/sdks/graphql/configurations */
export const RunpodUser = z.object({
	id: z.string(),
	email: z.string().optional(),
	multiFactorEnabled: z.boolean().optional(),
	pubKey: z.string().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

/** @see https://docs.runpod.io/api-reference/pods/GET/pods/podId */
export const RunpodPod = z.object({
	id: z.string(),
	name: z.string().optional(),
	image: z.string().optional(),
	desiredStatus: z.enum(['RUNNING', 'EXITED', 'TERMINATED']).optional(),
	costPerHr: z.coerce.number().optional(),
	memoryInGb: z.number().optional(),
	vcpuCount: z.number().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

/** @see https://docs.runpod.io/api-reference-v2/clusters/create-a-cluster */
export const RunpodCluster = z.object({
	id: z.string(),
	name: z.string(),
	type: z.enum(['APPLICATION', 'TRAINING', 'SLURM', 'RAY']),
	createdAt: z.coerce.date().nullable().optional(),
});

/** @see https://docs.runpod.io/sdks/graphql/manage-pod-templates */
export const RunpodTemplate = z.object({
	id: z.string(),
	name: z.string().optional(),
	imageName: z.string().optional(),
	isServerless: z.boolean().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

/** @see https://docs.runpod.io/sdks/graphql/manage-endpoints */
export const RunpodEndpoint = z.object({
	id: z.string(),
	name: z.string().optional(),
	templateId: z.string().optional(),
	gpuIds: z.string().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

/** @see https://docs.runpod.io/api-reference/container-registry-auths/POST/containerregistryauth */
export const RunpodRegistryAuth = z.object({
	id: z.string(),
	name: z.string(),
	updatedAt: z.coerce.date().nullable().optional(),
});

/** @see https://docs.runpod.io/sdks/graphql/manage-pod-templates */
export const RunpodSecret = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export type RunpodUser = z.infer<typeof RunpodUser>;
export type RunpodPod = z.infer<typeof RunpodPod>;
export type RunpodCluster = z.infer<typeof RunpodCluster>;
export type RunpodTemplate = z.infer<typeof RunpodTemplate>;
export type RunpodEndpoint = z.infer<typeof RunpodEndpoint>;
export type RunpodRegistryAuth = z.infer<typeof RunpodRegistryAuth>;
export type RunpodSecret = z.infer<typeof RunpodSecret>;
