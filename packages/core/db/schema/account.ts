import * as z from 'zod';
import { coreSchema } from './shared';

export const accountSchema = coreSchema.extend({
	accountId: z.string(),
	providerId: z.string(),
	userId: z.string(),
	accessToken: z.string().nullish(),
	refreshToken: z.string().nullish(),
	idToken: z.string().nullish(),
	accessTokenExpiresAt: z.date().nullish(),
	refreshTokenExpiresAt: z.date().nullish(),
	scope: z.string().nullish(),
});

export type Account = z.infer<typeof accountSchema>;
