import { z } from 'zod';
import { optBool, optNum, optStr } from './common';

// The full user, or a `limited` one when the token can't see everything.
export const UserSchema = z
	.object({
		id: z.string(),
		email: optStr(),
		name: optStr(),
		username: optStr(),
		avatar: optStr(),
		defaultTeamId: optStr(),
		createdAt: optNum(),
		limited: optBool(),
		stagingPrefix: optStr(),
		version: optStr(),
		// Nested Vercel objects passed through as is: their fields change often.
		billing: z.record(z.string(), z.unknown()).nullable().optional(),
		softBlock: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.passthrough();

export const VercelUserInputSchemas = {
	getUser: z.object({}),
} as const;

export const VercelUserOutputSchemas = {
	getUser: z.object({ user: UserSchema }).passthrough(),
} as const;

export type VercelUserInputs = {
	[K in keyof typeof VercelUserInputSchemas]: z.input<
		(typeof VercelUserInputSchemas)[K]
	>;
};
export type VercelUserOutputs = {
	[K in keyof typeof VercelUserOutputSchemas]: z.infer<
		(typeof VercelUserOutputSchemas)[K]
	>;
};
