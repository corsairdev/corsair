import { z } from 'zod';

export const DocparserPingEntity = z.object({
	id: z.literal('ping'),
	msg: z.string().optional(),
});

export const DocparserParserEntity = z.object({
	id: z.string().min(1),
	label: z.string().optional(),
});

export const DocparserModelEntity = z.object({
	id: z.string().min(1),
	label: z.string().optional(),
	parserId: z.string().min(1),
});

/** Parsed document row. Field values and media links are not stored. */
export const DocparserResultEntity = z.object({
	id: z.string().min(1),
	documentId: z.string().optional(),
	fileName: z.string().optional(),
	pageCount: z.number().optional(),
	uploadedAt: z.string().optional(),
	processedAt: z.string().optional(),
});

export type DocparserPingEntity = z.infer<typeof DocparserPingEntity>;
export type DocparserParserEntity = z.infer<typeof DocparserParserEntity>;
export type DocparserModelEntity = z.infer<typeof DocparserModelEntity>;
export type DocparserResultEntity = z.infer<typeof DocparserResultEntity>;
