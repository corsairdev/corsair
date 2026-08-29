import { z } from 'zod';

const PartyGetInputSchema = z.object({
	id: z.number(),
});

const PartyGetResponseSchema = z.object({
	party: z.record(z.string(), z.unknown()),
});

const OpportunityGetInputSchema = z.object({
	id: z.number(),
});

const OpportunityGetResponseSchema = z.object({
	opportunity: z.record(z.string(), z.unknown()),
});

const ProjectGetInputSchema = z.object({
	id: z.number(),
});

const ProjectGetResponseSchema = z.object({
	kase: z.record(z.string(), z.unknown()),
});

export type PartyGetInput = z.infer<typeof PartyGetInputSchema>;
export type PartyGetResponse = z.infer<typeof PartyGetResponseSchema>;

export type OpportunityGetInput = z.infer<
	typeof OpportunityGetInputSchema
>;
export type OpportunityGetResponse = z.infer<
	typeof OpportunityGetResponseSchema
>;

export type ProjectGetInput = z.infer<typeof ProjectGetInputSchema>;
export type ProjectGetResponse = z.infer<typeof ProjectGetResponseSchema>;

export type CapsuleCrmEndpointInputs = {
	partyGet: PartyGetInput;
	opportunityGet: OpportunityGetInput;
	projectGet: ProjectGetInput;
};

export type CapsuleCrmEndpointOutputs = {
	partyGet: PartyGetResponse;
	opportunityGet: OpportunityGetResponse;
	projectGet: ProjectGetResponse;
};

export const CapsuleCrmEndpointInputSchemas = {
	partyGet: PartyGetInputSchema,
	opportunityGet: OpportunityGetInputSchema,
	projectGet: ProjectGetInputSchema,
} as const;

export const CapsuleCrmEndpointOutputSchemas = {
	partyGet: PartyGetResponseSchema,
	opportunityGet: OpportunityGetResponseSchema,
	projectGet: ProjectGetResponseSchema,
} as const;