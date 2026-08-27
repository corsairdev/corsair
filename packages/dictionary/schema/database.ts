import { z } from 'zod';

/**
 * Cached Merriam-Webster dictionary entry.
 *
 * Field names match official JSON keys except `audioUrl` (derived from
 * `hwi.prs[].sound.audio`) and `captured_at` (local).
 *
 * Official JSON: https://dictionaryapi.com/products/json
 * Collegiate: https://www.dictionaryapi.com/products/api-collegiate-dictionary
 * Elementary (sd2): https://dictionaryapi.com/products/api-elementary-dictionary
 * Intermediate (sd3): https://dictionaryapi.com/products/api-intermediate-dictionary
 * School (sd4): https://dictionaryapi.com/products/api-school-dictionary
 */
export const DictionaryEntryEntity = z.object({
	/** Official `meta.id`. Unique within one data set; homographs append `:N`. */
	id: z.string(),
	/** Official `meta.uuid`. Universally unique identifier. */
	uuid: z.string().optional(),
	/** Official `meta.src`. Source data set (e.g. collegiate, sd2). */
	src: z.string().optional(),
	/**
	 * Official `meta.section`. Print section: alpha, biog, geog, idioms, fw&p.
	 */
	section: z.string().optional(),
	/**
	 * Official `meta.stems`. Headwords, variants, inflections, and run-ons
	 * that should match this entry.
	 */
	stems: z.array(z.string()),
	/** Official `meta.offensive`. True if the entry has an offensive label. */
	offensive: z.boolean(),
	/** Official `hwi.hw`. Headword, often with syllable breaks (`*`). */
	hw: z.string(),
	/** Official `fl`. Functional label (part of speech). */
	fl: z.string().optional(),
	/**
	 * Official `shortdef`. Abridged first-sense previews; not the full `def`
	 * tree. https://dictionaryapi.com/products/json#sec-2.shortdef
	 */
	shortdef: z.array(z.string()),
	/**
	 * Official `et` `["text", string]` members, flattened.
	 * https://dictionaryapi.com/products/json#sec-2.et
	 */
	et: z.array(z.string()).optional(),
	/** Official `date`. First known use in English. */
	date: z.string().optional(),
	/** Official `hwi.prs[0].mw`. Written pronunciation. */
	mw: z.string().optional(),
	/**
	 * Derived MP3 URL from official `sound.audio`.
	 * https://dictionaryapi.com/products/json#sec-2.prs
	 */
	audioUrl: z.string().optional(),
	captured_at: z.coerce.date(),
});
export type DictionaryEntryEntity = z.infer<typeof DictionaryEntryEntity>;
