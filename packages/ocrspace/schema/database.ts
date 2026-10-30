import { z } from 'zod';

// One cached OCR extraction. `source` is required because it forms the
// entityId; only URL-sourced parses are cached (file/base64 inputs are not
// worth hashing multi-megabyte payloads for).
export const OcrResult = z.object({
	source: z.string(),
	engine: z.number().int().nullable().optional(),
	language: z.string().nullable().optional(),
	text: z.string().nullable().optional(),
	pageCount: z.number().int().nullable().optional(),
	exitCode: z.number().int().nullable().optional(),
	isSearchablePdf: z.boolean().nullable().optional(),
	processingTimeMs: z.number().int().nullable().optional(),
	updatedAt: z.coerce.date().optional(),
});

// Monthly conversion counters. Opened to free-plan keys in May 2026;
// invalid keys still return zeros rather than an error.
export const ConversionStats = z.object({
	engine1: z.number().nullable().optional(),
	engine2: z.number().nullable().optional(),
	engine3: z.number().nullable().optional(),
	total: z.number().nullable().optional(),
	period: z.string().nullable().optional(),
	updatedAt: z.coerce.date().optional(),
});

export type OcrResult = z.infer<typeof OcrResult>;
export type ConversionStats = z.infer<typeof ConversionStats>;
