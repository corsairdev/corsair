import { z } from 'zod';

const EnvPairSchema = z.object({
	key: z.string(),
	value: z.string(),
});

/** @see https://docs.runpod.io/sdks/graphql/configurations */
export const MyselfOutputSchema = z
	.object({
		id: z.string(),
		email: z.string().optional(),
		multiFactorEnabled: z.boolean().optional(),
		pubKey: z.string().nullable().optional(),
	})
	.loose();

export const GetMyselfInputSchema = z.object({});

/** @see https://docs.runpod.io/api-reference-v2/account/replace-registered-ssh-public-keys */
export const UpdateUserSettingsInputSchema = z.object({
	pubKey: z.string().min(1),
});

export const UpdateUserSettingsOutputSchema = z
	.object({
		id: z.string().optional(),
		pubKey: z.string().nullable().optional(),
		keys: z.array(z.string()).optional(),
	})
	.loose();

/** @see https://docs.runpod.io/sdks/graphql/manage-pods */
export const GetGpuTypesInputSchema = z.object({
	id: z.string().optional(),
	gpuCount: z.number().int().positive().optional(),
});

export const GpuTypeSchema = z
	.object({
		id: z.string(),
		displayName: z.string().optional(),
		memoryInGb: z.number().optional(),
		secureCloud: z.boolean().optional(),
		communityCloud: z.boolean().optional(),
		lowestPrice: z
			.object({
				uninterruptablePrice: z.number().nullable().optional(),
				stockStatus: z.string().nullable().optional(),
				availableGpuCounts: z.array(z.number()).nullable().optional(),
			})
			.loose()
			.nullable()
			.optional(),
	})
	.loose();

export const GetGpuTypesOutputSchema = z.array(GpuTypeSchema);

/** @see https://docs.runpod.io/api-reference-v2/catalog/list-cpu-types */
export const ListCpuTypesInputSchema = z.object({
	include: z.enum(['AVAILABILITY']).optional(),
	product: z.enum(['POD', 'SERVERLESS']).optional(),
	vcpuCount: z.number().int().optional(),
});

export const CpuTypeSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		group: z.string(),
		vcpu: z.object({
			min: z.number(),
			max: z.number(),
		}),
		ramGbPerVcpu: z.number(),
		price: z
			.object({
				securePerVcpu: z.number(),
				serverlessPerVcpu: z.number(),
			})
			.loose(),
		availability: z.enum(['NONE', 'LOW', 'MEDIUM', 'HIGH']).optional(),
	})
	.loose();

export const ListCpuTypesOutputSchema = z.object({
	cpus: z.array(CpuTypeSchema),
});

/** @see https://docs.runpod.io/api-reference/pods/GET/pods */
export const ListPodsInputSchema = z.object({
	computeType: z.enum(['GPU', 'CPU']).optional(),
	cpuFlavorId: z.union([z.string(), z.array(z.string())]).optional(),
	dataCenterId: z.union([z.string(), z.array(z.string())]).optional(),
	desiredStatus: z.enum(['RUNNING', 'EXITED', 'TERMINATED']).optional(),
	endpointId: z.string().optional(),
	gpuTypeId: z.union([z.string(), z.array(z.string())]).optional(),
	id: z.string().optional(),
	imageName: z.string().optional(),
	includeMachine: z.boolean().optional(),
	includeNetworkVolume: z.boolean().optional(),
	includeSavingsPlans: z.boolean().optional(),
	includeTemplate: z.boolean().optional(),
	includeWorkers: z.boolean().optional(),
	name: z.string().optional(),
	networkVolumeId: z.string().optional(),
	templateId: z.string().optional(),
});

/** @see https://docs.runpod.io/api-reference/pods/GET/pods/podId */
export const GetPodInputSchema = z.object({
	podId: z.string().min(1),
	includeMachine: z.boolean().optional(),
	includeNetworkVolume: z.boolean().optional(),
	includeSavingsPlans: z.boolean().optional(),
	includeTemplate: z.boolean().optional(),
	includeWorkers: z.boolean().optional(),
});

export const PodSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		image: z.string().optional(),
		desiredStatus: z.enum(['RUNNING', 'EXITED', 'TERMINATED']).optional(),
		costPerHr: z.coerce.number().optional(),
		memoryInGb: z.number().optional(),
		vcpuCount: z.number().optional(),
		gpu: z
			.object({
				id: z.string().optional(),
				count: z.number().optional(),
				displayName: z.string().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

export const ListPodsOutputSchema = z.array(PodSchema);

/** @see https://docs.runpod.io/api-reference-v2/clusters/create-a-cluster */
export const CreateClusterInputSchema = z.object({
	name: z.string().min(1),
	type: z.enum(['APPLICATION', 'TRAINING', 'SLURM', 'RAY']),
	compute: z.object({
		gpuTypeId: z.string().min(1),
		gpuCountPerPod: z.number().int().min(1),
		podCount: z.number().int().min(2).max(250),
	}),
	image: z.string().optional(),
	disk: z.number().int().min(1).optional(),
	env: z.record(z.string(), z.string()).optional(),
	ports: z.array(z.string()).optional(),
	args: z.string().optional(),
	dataCenterIds: z.array(z.string()).optional(),
	startJupyter: z.boolean().optional(),
	startSsh: z.boolean().optional(),
});

export const ClusterSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		type: z.enum(['APPLICATION', 'TRAINING', 'SLURM', 'RAY']),
		compute: z
			.object({
				gpuTypeId: z.string(),
				gpuCountPerPod: z.number(),
				podCount: z.number(),
			})
			.loose(),
		createdAt: z.string().optional(),
	})
	.loose();

/** @see https://docs.runpod.io/sdks/graphql/manage-pod-templates */
export const CreateSecretInputSchema = z.object({
	name: z.string().min(1),
	value: z.string().min(1),
	description: z.string().optional(),
});

export const SecretSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().nullable().optional(),
	})
	.loose();

/** @see https://docs.runpod.io/api-reference/container-registry-auths/POST/containerregistryauth */
export const SaveRegistryAuthInputSchema = z.object({
	name: z.string().min(1),
	username: z.string().min(1),
	password: z.string().min(1),
});

export const RegistryAuthSchema = z
	.object({
		id: z.string(),
		name: z.string(),
	})
	.loose();

export const UpdateRegistryAuthInputSchema = z.object({
	id: z.string().min(1),
	username: z.string().min(1),
	password: z.string().min(1),
});

export const DeleteRegistryAuthInputSchema = z.object({
	containerRegistryAuthId: z.string().min(1),
});

export const DeleteRegistryAuthOutputSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
	})
	.loose();

export const SaveTemplateInputSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1),
	imageName: z.string().min(1),
	containerDiskInGb: z.number().int().min(1),
	volumeInGb: z.number().int().min(0),
	dockerArgs: z.string().optional().default(''),
	env: z.array(EnvPairSchema).optional(),
	ports: z.string().optional(),
	readme: z.string().optional(),
	volumeMountPath: z.string().optional(),
	isServerless: z.boolean().optional(),
	containerRegistryAuthId: z.string().optional(),
});

export const TemplateSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		imageName: z.string().optional(),
		containerDiskInGb: z.number().optional(),
		volumeInGb: z.number().optional(),
		isServerless: z.boolean().optional(),
		dockerArgs: z.string().nullable().optional(),
		ports: z.string().nullable().optional(),
		readme: z.string().nullable().optional(),
		volumeMountPath: z.string().nullable().optional(),
		env: z.array(EnvPairSchema).optional(),
	})
	.loose();

export const DeleteTemplateInputSchema = z.object({
	templateName: z.string().min(1),
});

export const DeleteTemplateOutputSchema = z.object({
	success: z.literal(true),
});

/** @see https://docs.runpod.io/sdks/graphql/manage-endpoints */
export const SaveEndpointInputSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1),
	templateId: z.string().min(1),
	gpuIds: z.string().min(1),
	type: z.enum(['QB', 'LB']).optional(),
	idleTimeout: z.number().int().optional(),
	locations: z.string().optional(),
	flashBootType: z.enum(['FLASHBOOT']).optional(),
	scalerType: z.enum(['QUEUE_DELAY', 'REQUEST_COUNT']).optional(),
	scalerValue: z.number().int().optional(),
	workersMin: z.number().int().optional(),
	workersMax: z.number().int().optional(),
	networkVolumeId: z.string().optional(),
});

export const EndpointSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		gpuIds: z.string().optional(),
		templateId: z.string().optional(),
		idleTimeout: z.number().optional(),
		locations: z.string().nullable().optional(),
		flashBootType: z.string().nullable().optional(),
		scalerType: z.string().optional(),
		scalerValue: z.number().optional(),
		workersMin: z.number().optional(),
		workersMax: z.number().optional(),
	})
	.loose();

export type GetMyselfInput = z.input<typeof GetMyselfInputSchema>;
export type MyselfOutput = z.infer<typeof MyselfOutputSchema>;
export type UpdateUserSettingsInput = z.input<
	typeof UpdateUserSettingsInputSchema
>;
export type UpdateUserSettingsOutput = z.infer<
	typeof UpdateUserSettingsOutputSchema
>;
export type GetGpuTypesInput = z.input<typeof GetGpuTypesInputSchema>;
export type GetGpuTypesOutput = z.infer<typeof GetGpuTypesOutputSchema>;
export type ListCpuTypesInput = z.input<typeof ListCpuTypesInputSchema>;
export type ListCpuTypesOutput = z.infer<typeof ListCpuTypesOutputSchema>;
export type ListPodsInput = z.input<typeof ListPodsInputSchema>;
export type ListPodsOutput = z.infer<typeof ListPodsOutputSchema>;
export type GetPodInput = z.input<typeof GetPodInputSchema>;
export type GetPodOutput = z.infer<typeof PodSchema>;
export type CreateClusterInput = z.input<typeof CreateClusterInputSchema>;
export type CreateClusterOutput = z.infer<typeof ClusterSchema>;
export type CreateSecretInput = z.input<typeof CreateSecretInputSchema>;
export type CreateSecretOutput = z.infer<typeof SecretSchema>;
export type SaveRegistryAuthInput = z.input<typeof SaveRegistryAuthInputSchema>;
export type SaveRegistryAuthOutput = z.infer<typeof RegistryAuthSchema>;
export type UpdateRegistryAuthInput = z.input<
	typeof UpdateRegistryAuthInputSchema
>;
export type UpdateRegistryAuthOutput = z.infer<typeof RegistryAuthSchema>;
export type DeleteRegistryAuthInput = z.input<
	typeof DeleteRegistryAuthInputSchema
>;
export type DeleteRegistryAuthOutput = z.infer<
	typeof DeleteRegistryAuthOutputSchema
>;
export type SaveTemplateInput = z.input<typeof SaveTemplateInputSchema>;
export type SaveTemplateOutput = z.infer<typeof TemplateSchema>;
export type DeleteTemplateInput = z.input<typeof DeleteTemplateInputSchema>;
export type DeleteTemplateOutput = z.infer<typeof DeleteTemplateOutputSchema>;
export type SaveEndpointInput = z.input<typeof SaveEndpointInputSchema>;
export type SaveEndpointOutput = z.infer<typeof EndpointSchema>;

export type RunpodEndpointInputs = {
	getMyself: GetMyselfInput;
	updateUserSettings: UpdateUserSettingsInput;
	getGpuTypes: GetGpuTypesInput;
	listCpuTypes: ListCpuTypesInput;
	listPods: ListPodsInput;
	getPod: GetPodInput;
	createCluster: CreateClusterInput;
	createSecret: CreateSecretInput;
	saveRegistryAuth: SaveRegistryAuthInput;
	updateRegistryAuth: UpdateRegistryAuthInput;
	deleteRegistryAuth: DeleteRegistryAuthInput;
	saveTemplate: SaveTemplateInput;
	deleteTemplate: DeleteTemplateInput;
	saveEndpoint: SaveEndpointInput;
};

export type RunpodEndpointOutputs = {
	getMyself: MyselfOutput;
	updateUserSettings: UpdateUserSettingsOutput;
	getGpuTypes: GetGpuTypesOutput;
	listCpuTypes: ListCpuTypesOutput;
	listPods: ListPodsOutput;
	getPod: GetPodOutput;
	createCluster: CreateClusterOutput;
	createSecret: CreateSecretOutput;
	saveRegistryAuth: SaveRegistryAuthOutput;
	updateRegistryAuth: UpdateRegistryAuthOutput;
	deleteRegistryAuth: DeleteRegistryAuthOutput;
	saveTemplate: SaveTemplateOutput;
	deleteTemplate: DeleteTemplateOutput;
	saveEndpoint: SaveEndpointOutput;
};

export const RunpodEndpointInputSchemas = {
	getMyself: GetMyselfInputSchema,
	updateUserSettings: UpdateUserSettingsInputSchema,
	getGpuTypes: GetGpuTypesInputSchema,
	listCpuTypes: ListCpuTypesInputSchema,
	listPods: ListPodsInputSchema,
	getPod: GetPodInputSchema,
	createCluster: CreateClusterInputSchema,
	createSecret: CreateSecretInputSchema,
	saveRegistryAuth: SaveRegistryAuthInputSchema,
	updateRegistryAuth: UpdateRegistryAuthInputSchema,
	deleteRegistryAuth: DeleteRegistryAuthInputSchema,
	saveTemplate: SaveTemplateInputSchema,
	deleteTemplate: DeleteTemplateInputSchema,
	saveEndpoint: SaveEndpointInputSchema,
} as const;

export const RunpodEndpointOutputSchemas = {
	getMyself: MyselfOutputSchema,
	updateUserSettings: UpdateUserSettingsOutputSchema,
	getGpuTypes: GetGpuTypesOutputSchema,
	listCpuTypes: ListCpuTypesOutputSchema,
	listPods: ListPodsOutputSchema,
	getPod: PodSchema,
	createCluster: ClusterSchema,
	createSecret: SecretSchema,
	saveRegistryAuth: RegistryAuthSchema,
	updateRegistryAuth: RegistryAuthSchema,
	deleteRegistryAuth: DeleteRegistryAuthOutputSchema,
	saveTemplate: TemplateSchema,
	deleteTemplate: DeleteTemplateOutputSchema,
	saveEndpoint: EndpointSchema,
} as const;
