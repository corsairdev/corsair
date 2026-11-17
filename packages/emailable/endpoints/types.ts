import { z } from 'zod';
import {
	EmailableAccountEntity,
	EmailableBatchEntity,
	EmailableVerificationEntity,
} from '../schema/database';

export const EmptyInputSchema = z.object({});
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

export const VerifyInputSchema = z.object({
	email: z.string().email(),
});
export type VerifyInput = z.infer<typeof VerifyInputSchema>;

export const BatchCreateInputSchema = z.object({
	emails: z.array(z.string().email()).min(1).max(50000),
});
export type BatchCreateInput = z.infer<typeof BatchCreateInputSchema>;

export const BatchIdInputSchema = z.object({
	id: z.string().regex(/^[A-Za-z0-9_-]+$/),
});
export type BatchIdInput = z.infer<typeof BatchIdInputSchema>;

export const AuthorizeInputSchema = z
	.object({
		clientId: z.string().regex(/^[A-Za-z0-9_-]+$/),
		redirectUri: z.string().url(),
		state: z.string().min(1).max(200).optional(),
		codeChallenge: z.string().min(1).max(200).optional(),
		codeChallengeMethod: z
			.string()
			.regex(/^(S256|plain)$/)
			.optional(),
	})
	.superRefine((value, ctx) => {
		if (value.codeChallenge && !value.codeChallengeMethod) {
			ctx.addIssue({
				code: 'custom',
				message: 'codeChallengeMethod is required with codeChallenge',
				path: ['codeChallengeMethod'],
			});
		}
	});
export type AuthorizeInput = z.infer<typeof AuthorizeInputSchema>;

export const AccountResponseSchema = z.object({
	account: EmailableAccountEntity,
});
export type AccountResponse = z.infer<typeof AccountResponseSchema>;

export const VerificationResponseSchema = z.object({
	verification: EmailableVerificationEntity,
});
export type VerificationResponse = z.infer<typeof VerificationResponseSchema>;

export const BatchResponseSchema = z.object({ batch: EmailableBatchEntity });
export type BatchResponse = z.infer<typeof BatchResponseSchema>;

export const AuthorizeResponseSchema = z.object({ url: z.string().url() });
export type AuthorizeResponse = z.infer<typeof AuthorizeResponseSchema>;

export const EndpointInputSchemas = {
	'account.get': EmptyInputSchema,
	'verifications.verify': VerifyInputSchema,
	'batches.create': BatchCreateInputSchema,
	'batches.get': BatchIdInputSchema,
	'oauth.authorize': AuthorizeInputSchema,
};

export const EndpointOutputSchemas = {
	'account.get': AccountResponseSchema,
	'verifications.verify': VerificationResponseSchema,
	'batches.create': BatchResponseSchema,
	'batches.get': BatchResponseSchema,
	'oauth.authorize': AuthorizeResponseSchema,
};
