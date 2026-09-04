import { z } from 'zod';

const ListPodsInputSchema = z.object({
	computeType: z.enum(['GPU', 'CPU']).optional(),
	desiredStatus: z.enum(['RUNNING', 'EXITED', 'TERMINATED']).optional(),
	endpointId: z.string().optional(),
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

export type ListPodsInput = z.infer<typeof ListPodsInputSchema>;

const PodSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	image: z.string().optional(),
	desiredStatus: z.enum(['RUNNING', 'EXITED', 'TERMINATED']).optional(),
	costPerHr: z.number().optional(),
	memoryInGb: z.number().optional(),
	vcpuCount: z.number().optional(),
	volumeInGb: z.number().optional(),
	volumeMountPath: z.string().optional(),
	publicIp: z.string().nullable().optional(),
	ports: z.array(z.string()).optional(),
	interruptible: z.boolean().optional(),
});

const ListPodsResponseSchema = z.array(PodSchema);

export type ListPodsResponse = z.infer<typeof ListPodsResponseSchema>;

export type RunpodEndpointInputs = {
	listPods: ListPodsInput;
};

export type RunpodEndpointOutputs = {
	listPods: ListPodsResponse;
};

export const RunpodEndpointInputSchemas = {
	listPods: ListPodsInputSchema,
} as const;

export const RunpodEndpointOutputSchemas = {
	listPods: ListPodsResponseSchema,
} as const;
