import { z } from 'zod';

/**
 * A render stored by Imejis and handed back as a URL.
 *
 * API: POST https://render.imejis.io/v1/{design_id}?delivery=hosted|signed
 * Docs: https://www.imejis.io/apis
 * OpenAPI: `renderDesignPost` → 200 `application/json`
 *
 * Only `delivery=hosted` and `delivery=signed` are persisted: those are the
 * modes where Imejis stores the render and returns a URL. `delivery=stream`
 * returns raw bytes that Imejis never stores, so there is nothing to mirror.
 */
export const ImejisioRender = z.object({
	designId: z.string(),
	delivery: z.enum(['hosted', 'signed']),
	url: z.string().url(),
	format: z.enum(['png', 'jpeg', 'webp', 'pdf']).nullable().optional(),
	/** Signed delivery only — when the URL expires. */
	expiresAt: z.string().nullable().optional(),
	/** File metadata returned by Imejis, passed through as-is. */
	file: z.record(z.string(), z.unknown()).nullable().optional(),
	renderedAt: z.coerce.date(),
});

export type ImejisioRender = z.infer<typeof ImejisioRender>;
