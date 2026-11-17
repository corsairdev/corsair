import { FileOutputSchema } from 'corsair/http';
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
export const CreateInputSchema = z.object({
	body: VerificationObjectSchema.describe(
		'Request body sent to StackGo as-is. StackGo has not published the field list; its quickstart uses firstName, lastName, email, emailUser ("Yes" emails the person an invitation), type (e.g. "kyc"), triggeredBy ("direct") and active (true).',
	),
});
export const GetInputSchema = z.object({ id: safeId });
export const ImageInputSchema = z.object({
	verificationId: safeId.describe(
		'ID of the verification the image belongs to',
	),
	imageId: safeId.describe('ID of the captured document or selfie image'),
});
export const IdentityCheckEndpointInputSchemas = {
	create: CreateInputSchema,
	sms: CreateInputSchema,
	kyb: CreateInputSchema,
	tranche2: CreateInputSchema,
	get: GetInputSchema,
	image: ImageInputSchema,
} as const;
export const IdentityCheckEndpointOutputSchemas = {
	create: VerificationObjectSchema,
	sms: VerificationObjectSchema,
	kyb: VerificationObjectSchema,
	tranche2: VerificationObjectSchema,
	get: VerificationObjectSchema,
	image: FileOutputSchema,
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
