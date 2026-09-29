import { z } from 'zod';

// attributes/sourceFilters/fields differ per saved-object and data-view
// type, so values use z.unknown() rather than an invented fixed shape.
export const KibanaSavedObject = z.object({
	id: z.string(),
	type: z.string(),
	// Attributes vary by saved-object type; unknown allows safe extension.
	attributes: z.record(z.string(), z.unknown()),
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
	// Source filters and fields vary by data view; unknown allows safe extension.
	sourceFilters: z.array(z.record(z.string(), z.unknown())).optional(),
	fields: z.record(z.string(), z.unknown()).optional(),
});

export type KibanaSavedObject = z.infer<typeof KibanaSavedObject>;
export type KibanaSpace = z.infer<typeof KibanaSpace>;
export type KibanaDataView = z.infer<typeof KibanaDataView>;
