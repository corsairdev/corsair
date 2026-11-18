import { z } from 'zod';

export const EmailableAccountEntity = z.object({
	id: z.literal('account'),
	availableCredits: z.number().optional(),
});

/** One verification. Names and mailbox details are not stored. */
export const EmailableVerificationEntity = z.object({
	id: z.string().min(1),
	state: z.string().optional(),
	score: z.number().optional(),
	reason: z.string().optional(),
});

/** Batch job. The address list is not stored. */
export const EmailableBatchEntity = z.object({
	id: z.string().min(1),
	message: z.string().optional(),
});

export type EmailableAccountEntity = z.infer<typeof EmailableAccountEntity>;
export type EmailableVerificationEntity = z.infer<
	typeof EmailableVerificationEntity
>;
export type EmailableBatchEntity = z.infer<typeof EmailableBatchEntity>;
