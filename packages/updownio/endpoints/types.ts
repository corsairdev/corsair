import { z } from 'zod';
import { UpdownIOCheck, UpdownIONode } from '../schema/database';

const EmptyInputSchema = z.object({}).strict();
export const ListChecksInputSchema = EmptyInputSchema;
export const ListNodesInputSchema = EmptyInputSchema;
export const ListNodeIpsInputSchema = EmptyInputSchema;
export const ListNodeIpv4InputSchema = EmptyInputSchema;
export const ListNodeIpv6InputSchema = EmptyInputSchema;

/**
 * A check and a node are persisted entities, so their shapes live in the
 * plugin's database schema and are reused here rather than redeclared.
 * https://updown.io/api
 */
export const CheckSchema = UpdownIOCheck;
export const NodeSchema = UpdownIONode;

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
