import { z } from 'zod';

export const MailboxLayerEmailCheck = z.object({
	email: z.string(),
	didYouMean: z.string().optional(),
	user: z.string().optional(),
	domain: z.string().optional(),
	formatValid: z.boolean().optional(),
	mxFound: z.boolean().optional(),
	smtpCheck: z.boolean().optional(),
	catchAll: z.boolean().nullable().optional(),
	role: z.boolean().optional(),
	disposable: z.boolean().optional(),
	free: z.boolean().optional(),
	score: z.number().min(0).max(1).optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

export type MailboxLayerEmailCheck = z.infer<typeof MailboxLayerEmailCheck>;
