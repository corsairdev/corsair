import * as z from 'zod';
import { coreSchema } from './shared';

export const verificationSchema = coreSchema.extend({
	identifier: z.string(),
	value: z.string(),
	expiresAt: z.date(),
});

export type Verification = z.infer<typeof verificationSchema>;
