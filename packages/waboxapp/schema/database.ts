import { z } from 'zod';

export const WaboxappAccount = z.object({
	success: z.boolean(),
	uid: z.string().optional(),
	hook_url: z.string().optional(),
	alias: z.string().optional(),
	platform: z.string().optional(),
	battery: z.string().optional(),
	plugged: z.string().optional(),
	locale: z.string().optional(),
	error: z.string().optional(),
});

export const WaboxappMessage = z.object({
	success: z.boolean(),
	custom_uid: z.union([z.string(), z.number()]).optional(),
	error: z.string().optional(),
});

export type WaboxappAccount = z.infer<typeof WaboxappAccount>;
export type WaboxappMessage = z.infer<typeof WaboxappMessage>;
