import * as z from 'zod';
import { coreSchema } from './shared';

export const userSchema = coreSchema.extend({
	email: z.string().transform((val) => val.toLowerCase()),
	emailVerified: z.boolean().default(false),
	name: z.string(),
	image: z.string().nullish(),
});

export type User = z.infer<typeof userSchema>;
