import { z } from 'zod';

const WhoisLiveLookupV2InputSchema = z.object({
	domainName: z.string().min(1),
	format: z.enum(['json', 'xml']).optional(),
});

const WhoisLiveLookupV2OutputSchema = z
	.object({
		status: z.boolean().optional(),
		domain_name: z.string().optional(),
		query_time: z.string().optional(),
		whois_server: z.string().optional(),
		domain_registered: z.boolean().optional(),
	})
	.loose();

export type WhoisLiveLookupV2Input = z.infer<
	typeof WhoisLiveLookupV2InputSchema
>;

export type WhoisLiveLookupV2Response = z.infer<
	typeof WhoisLiveLookupV2OutputSchema
>;

export type WhoisfreaksEndpointInputs = {
	whoisLiveLookupV2: WhoisLiveLookupV2Input;
};

export type WhoisfreaksEndpointOutputs = {
	whoisLiveLookupV2: WhoisLiveLookupV2Response;
};

export const WhoisfreaksEndpointInputSchemas = {
	whoisLiveLookupV2: WhoisLiveLookupV2InputSchema,
} as const;

export const WhoisfreaksEndpointOutputSchemas = {
	whoisLiveLookupV2: WhoisLiveLookupV2OutputSchema,
} as const;
