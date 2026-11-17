import { z } from 'zod';
import {
	EmailableAccountEntity,
	EmailableBatchEntity,
} from '../schema/database';

export const EmptyInputSchema = z.object({});
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

export const VerifyInputSchema = z.object({
	email: z.string().email(),
	smtp: z
		.boolean()
		.optional()
		.describe(
			'Run the SMTP check (default true). Off is faster but less accurate.',
		),
	acceptAll: z
		.boolean()
		.optional()
		.describe('Also run the accept-all check (default false). Slower.'),
	timeout: z
		.number()
		.int()
		.min(2)
		.max(10)
		.optional()
		.describe('Seconds to wait for a result (2-10, default 5).'),
});
export type VerifyInput = z.infer<typeof VerifyInputSchema>;

export const BatchCreateInputSchema = z.object({
	emails: z.array(z.string().email()).min(1).max(50000),
	url: z
		.string()
		.url()
		.refine((value) => value.startsWith('https://'), 'Use an https URL')
		.optional()
		.describe(
			'HTTPS URL Emailable POSTs the results to when the batch finishes.',
		),
	responseFields: z
		.array(
			z.enum([
				'accept_all',
				'birth_year',
				'did_you_mean',
				'disposable',
				'domain',
				'email',
				'first_name',
				'free',
				'full_name',
				'gender',
				'last_name',
				'mailbox_full',
				'mx_record',
				'no_reply',
				'reason',
				'role',
				'score',
				'smtp_provider',
				'state',
				'tag',
				'user',
			]),
		)
		.min(1)
		.optional()
		.describe('Only return these fields per address.'),
	retries: z
		.boolean()
		.optional()
		.describe(
			'Retry unclear mail-server answers (default true). Off is faster.',
		),
});
export type BatchCreateInput = z.infer<typeof BatchCreateInputSchema>;

export const BatchIdInputSchema = z.object({
	id: z.string().regex(/^[A-Za-z0-9_-]+$/),
	partial: z
		.boolean()
		.optional()
		.describe('Return results verified so far (batches of up to 1,000 only).'),
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

/**
 * One verification as Emailable returns it. The object is loose: the result
 * fields are typed, and fields Emailable adds later pass through.
 */
export const VerificationSchema = z
	.object({
		email: z.string(),
		state: z.string().nullable().optional(),
		reason: z.string().nullable().optional(),
		score: z.number().nullable().optional(),
		domain: z.string().nullable().optional(),
		user: z.string().nullable().optional(),
		tag: z.string().nullable().optional(),
		did_you_mean: z.string().nullable().optional(),
		accept_all: z.boolean().nullable().optional(),
		disposable: z.boolean().nullable().optional(),
		free: z.boolean().nullable().optional(),
		role: z.boolean().nullable().optional(),
		no_reply: z.boolean().nullable().optional(),
		mailbox_full: z.boolean().nullable().optional(),
		smtp_provider: z.string().nullable().optional(),
		mx_record: z.string().nullable().optional(),
		duration: z.number().nullable().optional(),
	})
	.loose();

export const VerificationResponseSchema = z.object({
	verification: VerificationSchema.optional(),
	pending: z
		.boolean()
		.describe(
			'True when Emailable is still verifying (HTTP 249). Call again within 5 minutes; repeats in that window are free.',
		),
	message: z.string().optional(),
});
export type VerificationResponse = z.infer<typeof VerificationResponseSchema>;

export const BatchResponseSchema = z.object({ batch: EmailableBatchEntity });

export const BatchStatusResponseSchema = z.object({
	batch: z.object({
		id: z.string(),
		message: z.string().optional(),
		processed: z.number().optional(),
		total: z.number().optional(),
		done: z.boolean().describe('True once every address is verified.'),
		emails: z.array(VerificationSchema).optional(),
		downloadFile: z
			.string()
			.optional()
			.describe('ZIP of a CSV with every result, for batches over 1,000.'),
		totalCounts: z.record(z.string(), z.number()).optional(),
		reasonCounts: z.record(z.string(), z.number()).optional(),
	}),
});
export type BatchStatusResponse = z.infer<typeof BatchStatusResponseSchema>;
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
	'batches.get': BatchStatusResponseSchema,
	'oauth.authorize': AuthorizeResponseSchema,
};
