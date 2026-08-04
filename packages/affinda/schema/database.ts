import { z } from 'zod';

export const AffindaDocument = z
	.object({
		identifier: z.string().optional(),
		fileName: z.string().optional(),
		status: z.string().optional(),
		ready: z.boolean().optional(),
	})
	.catchall(z.unknown());

export const AffindaCollection = z
	.object({
		identifier: z.string().optional(),
		name: z.string().optional(),
		extractor: z.string().optional(),
	})
	.catchall(z.unknown());

export const AffindaWorkspace = z
	.object({
		identifier: z.string().optional(),
		name: z.string().optional(),
	})
	.catchall(z.unknown());

export type AffindaDocument = z.infer<typeof AffindaDocument>;
export type AffindaCollection = z.infer<typeof AffindaCollection>;
export type AffindaWorkspace = z.infer<typeof AffindaWorkspace>;
