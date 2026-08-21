import { z } from 'zod';

const GetCredentialInputSchema = z.object({
	id: z.string(),
});

export type GetCredentialInput = z.infer<typeof GetCredentialInputSchema>;

const GetCredentialResponseSchema = z.object({
	credential: z.record(z.string(), z.unknown()),
});

export type GetCredentialResponse = z.infer<typeof GetCredentialResponseSchema>;

export type AccredibleCertificatesEndpointInputs = {
	getCredential: GetCredentialInput;
};

export type AccredibleCertificatesEndpointOutputs = {
	getCredential: GetCredentialResponse;
};

export const AccredibleCertificatesEndpointInputSchemas = {
	getCredential: GetCredentialInputSchema,
} as const;

export const AccredibleCertificatesEndpointOutputSchemas = {
	getCredential: GetCredentialResponseSchema,
} as const;
