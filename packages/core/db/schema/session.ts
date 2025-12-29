import * as z from 'zod';
import { coreSchema } from './shared';

export const sessionSchema = coreSchema.extend({
	expiresAt: z.date(),
	token: z.string(),
	ipAddress: z.string().nullish(),
	userAgent: z.string().nullish(),
	userId: z.string(),
});

export type Session = z.infer<typeof sessionSchema>;
