import { z } from 'zod';

const EmptyInputSchema = z.object({}).strict();
export const ListChecksInputSchema = EmptyInputSchema;
export const ListNodesInputSchema = EmptyInputSchema;
export const ListNodeIpsInputSchema = EmptyInputSchema;
export const ListNodeIpv4InputSchema = EmptyInputSchema;
export const ListNodeIpv6InputSchema = EmptyInputSchema;

const NullableTimestamp = z.string().nullable().optional();
export const CheckSchema = z
	.object({
		token: z.string(),
		url: z.string().url().nullable().optional(),
		type: z.string(),
		alias: z.string().nullable().optional(),
		last_status: z.number().int().nullable(),
		uptime: z.number(),
		down: z.boolean(),
		down_since: NullableTimestamp,
		up_since: NullableTimestamp,
		error: z.string().nullable(),
		period: z.number().int(),
		apdex_t: z.number(),
		enabled: z.boolean(),
		published: z.boolean(),
		disabled_locations: z.array(z.string()),
		recipients: z.array(z.string()),
		last_check_at: NullableTimestamp,
		next_check_at: NullableTimestamp,
		created_at: z.string(),
	})
	.loose();
export const NodeSchema = z
	.object({
		ip: z.string(),
		ip6: z.string(),
		city: z.string(),
		country: z.string(),
		country_code: z.string(),
		lat: z.number(),
		lng: z.number(),
	})
	.loose();
export const ChecksResponseSchema = z.array(CheckSchema);
export const NodesResponseSchema = z.record(z.string(), NodeSchema);
export const NodeIpsResponseSchema = z.array(z.string());
export const NodeIpv4ResponseSchema = z.array(z.string());
export const NodeIpv6ResponseSchema = z.array(z.string());

export type UpdownIOEndpointInputs = {
	checksList: z.infer<typeof ListChecksInputSchema>;
	nodesList: z.infer<typeof ListNodesInputSchema>;
	nodesListIps: z.infer<typeof ListNodeIpsInputSchema>;
	nodesListIpv4: z.infer<typeof ListNodeIpv4InputSchema>;
	nodesListIpv6: z.infer<typeof ListNodeIpv6InputSchema>;
};
export type UpdownIOEndpointOutputs = {
	checksList: z.infer<typeof ChecksResponseSchema>;
	nodesList: z.infer<typeof NodesResponseSchema>;
	nodesListIps: z.infer<typeof NodeIpsResponseSchema>;
	nodesListIpv4: z.infer<typeof NodeIpv4ResponseSchema>;
	nodesListIpv6: z.infer<typeof NodeIpv6ResponseSchema>;
};
export const UpdownIOEndpointInputSchemas = {
	checksList: ListChecksInputSchema,
	nodesList: ListNodesInputSchema,
	nodesListIps: ListNodeIpsInputSchema,
	nodesListIpv4: ListNodeIpv4InputSchema,
	nodesListIpv6: ListNodeIpv6InputSchema,
} as const;
export const UpdownIOEndpointOutputSchemas = {
	checksList: ChecksResponseSchema,
	nodesList: NodesResponseSchema,
	nodesListIps: NodeIpsResponseSchema,
	nodesListIpv4: NodeIpv4ResponseSchema,
	nodesListIpv6: NodeIpv6ResponseSchema,
} as const;
