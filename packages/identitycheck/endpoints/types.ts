import { z } from 'zod';

// The official OpenAPI specifies objects but does not publish their fields.
export const VerificationObjectSchema = z.record(z.string(), z.unknown());
const safeId = z
	.string()
	.min(1)
	.refine(
		(value) => value !== '.' && value !== '..' && !/[\\/"']/.test(value),
		'Invalid path identifier',
	);
export const CreateInputSchema = z.object({ body: VerificationObjectSchema });
export const GetInputSchema = z.object({ id: safeId });
export const IdentityCheckEndpointInputSchemas = {
	create: CreateInputSchema,
	sms: CreateInputSchema,
	kyb: CreateInputSchema,
	tranche2: CreateInputSchema,
	get: GetInputSchema,
} as const;
export const IdentityCheckEndpointOutputSchemas = {
	create: VerificationObjectSchema,
	sms: VerificationObjectSchema,
	kyb: VerificationObjectSchema,
	tranche2: VerificationObjectSchema,
	get: VerificationObjectSchema,
} as const;
export type IdentityCheckEndpointInputs = {
	[K in keyof typeof IdentityCheckEndpointInputSchemas]: z.infer<
		(typeof IdentityCheckEndpointInputSchemas)[K]
	>;
};
export type IdentityCheckEndpointOutputs = {
	[K in keyof typeof IdentityCheckEndpointOutputSchemas]: z.infer<
		(typeof IdentityCheckEndpointOutputSchemas)[K]
	>;
};
