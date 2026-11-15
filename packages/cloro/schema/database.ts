import { z } from 'zod';

// One row per engine, country, area and prompt: the latest answer cloro returned.
// Fields come from the monitor result objects in
// https://cloro.dev/docs/api-reference/openapi.json (text, model, sources,
// organicResults, newsResults).
export const CloroSnapshot = z.object({
	id: z.string(),
	engine: z.enum([
		'chatgpt',
		'perplexity',
		'gemini',
		'copilot',
		'aimode',
		'google',
		'googleNews',
	]),
	prompt: z.string(),
	country: z.string().optional(),
	// US state for assistants, or the Google location / uule.
	area: z.string().optional(),
	text: z.string().optional(),
	model: z.string().optional(),
	sourceUrls: z.array(z.string()),
	checkedAt: z.coerce.date(),
});

export type CloroSnapshot = z.infer<typeof CloroSnapshot>;
