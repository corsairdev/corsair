import { z } from 'zod';

/**
 * Local storage shapes for API.Bible resources.
 * Field names follow the official REST payloads at https://rest.api.bible/v1
 * (docs: https://docs.api.bible).
 */

const ApiBibleLanguage = z.object({
	id: z.string(),
	name: z.string(),
	nameLocal: z.string().optional(),
	script: z.string().nullable().optional(),
	scriptDirection: z.string().nullable().optional(),
});

/** GET /v1/bibles — Bible version catalog row */
export const ApiBibleBible = z.object({
	id: z.string(),
	dblId: z.string(),
	relatedDbl: z.string().nullable().optional(),
	name: z.string(),
	nameLocal: z.string(),
	abbreviation: z.string().nullable().optional(),
	abbreviationLocal: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	descriptionLocal: z.string().nullable().optional(),
	language: ApiBibleLanguage,
	type: z.string(),
	updatedAt: z.string(),
	copyright: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

/** GET /v1/bibles/{bibleId}/books — book catalog row */
export const ApiBibleBook = z.object({
	id: z.string(),
	bibleId: z.string(),
	abbreviation: z.string(),
	name: z.string(),
	nameLong: z.string().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

/** GET /v1/bibles/{bibleId}/books/{bookId}/chapters — chapter catalog row */
export const ApiBibleChapter = z.object({
	id: z.string(),
	bibleId: z.string(),
	bookId: z.string(),
	number: z.string(),
	reference: z.string(),
	updatedAt: z.coerce.date().nullable().optional(),
});

/** GET /v1/bibles/{bibleId}/verses/{verseId} — verse content cache */
export const ApiBibleVerse = z.object({
	id: z.string(),
	orgId: z.string().optional(),
	bibleId: z.string(),
	bookId: z.string(),
	chapterId: z.string(),
	reference: z.string(),
	content: z.string(),
	copyright: z.string().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

/** GET /v1/bibles/{bibleId}/passages/{passageId} — passage content cache */
export const ApiBiblePassage = z.object({
	id: z.string(),
	orgId: z.string().optional(),
	bibleId: z.string(),
	bookId: z.string().optional(),
	reference: z.string(),
	content: z.string(),
	copyright: z.string().optional(),
	verseCount: z.number().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

/** GET /v1/bibles/{bibleId}/books/{bookId}/sections — section catalog row */
export const ApiBibleSection = z.object({
	id: z.string(),
	bibleId: z.string(),
	bookId: z.string(),
	title: z.string(),
	firstVerseId: z.string().optional(),
	lastVerseId: z.string().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

/** GET /v1/audio-bibles — audio Bible catalog row */
export const ApiBibleAudioBible = z.object({
	id: z.string(),
	dblId: z.string().optional(),
	name: z.string(),
	nameLocal: z.string(),
	abbreviation: z.string().nullable().optional(),
	abbreviationLocal: z.string().nullable().optional(),
	language: ApiBibleLanguage,
	type: z.string(),
	updatedAt: z.string(),
	copyright: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

/** GET /v1/audio-bibles/{id}/chapters/{chapterId} — signed audio chapter cache */
export const ApiBibleAudioChapter = z.object({
	id: z.string(),
	bibleId: z.string(),
	bookId: z.string(),
	number: z.string(),
	reference: z.string(),
	resourceUrl: z.string(),
	expiresAt: z.string(),
	copyright: z.string().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export type ApiBibleBible = z.infer<typeof ApiBibleBible>;
export type ApiBibleBook = z.infer<typeof ApiBibleBook>;
export type ApiBibleChapter = z.infer<typeof ApiBibleChapter>;
export type ApiBibleVerse = z.infer<typeof ApiBibleVerse>;
export type ApiBiblePassage = z.infer<typeof ApiBiblePassage>;
export type ApiBibleSection = z.infer<typeof ApiBibleSection>;
export type ApiBibleAudioBible = z.infer<typeof ApiBibleAudioBible>;
export type ApiBibleAudioChapter = z.infer<typeof ApiBibleAudioChapter>;
