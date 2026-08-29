import { z } from 'zod';

export const KibanaSavedObject = z.object({
	id: z.string(),
	type: z.string(),
	attributes: z.record(z.string(), z.any()),
	version: z.string().optional(),
	updated_at: z.string().optional(),
	created_at: z.string().optional(),
});

export const KibanaSpace = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	disabledFeatures: z.array(z.string()).optional(),
	initials: z.string().optional(),
	color: z.string().optional(),
});

export const KibanaDataView = z.object({
	id: z.string(),
	title: z.string(),
	name: z.string().optional(),
	timeFieldName: z.string().optional(),
	sourceFilters: z.array(z.record(z.string(), z.any())).optional(),
	fields: z.record(z.string(), z.any()).optional(),
});

export type KibanaSavedObject = z.infer<typeof KibanaSavedObject>;
export type KibanaSpace = z.infer<typeof KibanaSpace>;
export type KibanaDataView = z.infer<typeof KibanaDataView>;
