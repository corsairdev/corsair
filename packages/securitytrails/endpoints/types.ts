import { z } from 'zod';

const DomainGetInputSchema = z.object({
	hostname: z.string().min(1),
});

export type DomainGetInput = z.infer<typeof DomainGetInputSchema>;

const DomainGetResponseSchema = z.record(z.string(), z.unknown());

export type DomainGetResponse = z.infer<typeof DomainGetResponseSchema>;

export type SecuritytrailsEndpointInputs = {
	domainGet: DomainGetInput;
};

export type SecuritytrailsEndpointOutputs = {
	domainGet: DomainGetResponse;
};

export const SecuritytrailsEndpointInputSchemas = {
	domainGet: DomainGetInputSchema,
} as const;

export const SecuritytrailsEndpointOutputSchemas = {
	domainGet: DomainGetResponseSchema,
} as const;
