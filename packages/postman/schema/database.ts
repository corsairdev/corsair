import { z } from 'zod';

export const PostmanCollection = z.object({
	id: z.string(),
	name: z.string().optional(),
	uid: z.string().optional(),
});
export type PostmanCollection = z.infer<typeof PostmanCollection>;

export const PostmanWorkspace = z.object({
	id: z.string(),
	name: z.string().optional(),
	type: z.string().optional(),
});
export type PostmanWorkspace = z.infer<typeof PostmanWorkspace>;

export const PostmanEnvironment = z.object({
	id: z.string(),
	name: z.string().optional(),
	uid: z.string().optional(),
});
export type PostmanEnvironment = z.infer<typeof PostmanEnvironment>;

export const PostmanMonitor = z.object({
	id: z.string(),
	name: z.string().optional(),
	uid: z.string().optional(),
});
export type PostmanMonitor = z.infer<typeof PostmanMonitor>;

export const PostmanMock = z.object({
	id: z.string(),
	name: z.string().optional(),
	uid: z.string().optional(),
});
export type PostmanMock = z.infer<typeof PostmanMock>;
