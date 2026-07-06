import { z } from 'zod';

export const AnchorBrowserSession = z.object({
	session_id: z.string().optional(),
	status: z.string().optional(),
	cdp_url: z.string().optional(),
	live_view_url: z.string().optional(),
}).catchall(z.unknown());

export const AnchorBrowserTask = z.object({
	taskId: z.string().optional(),
	name: z.string().optional(),
	language: z.string().optional(),
}).catchall(z.unknown());

export const AnchorBrowserProfile = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	status: z.string().optional(),
}).catchall(z.unknown());

export type AnchorBrowserSession = z.infer<typeof AnchorBrowserSession>;
export type AnchorBrowserTask = z.infer<typeof AnchorBrowserTask>;
export type AnchorBrowserProfile = z.infer<typeof AnchorBrowserProfile>;
