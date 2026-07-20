/**
 * Strips a single leading/trailing markdown code fence (e.g. ```html ... ```)
 * and surrounding explanatory prose is left untouched — Gemini sometimes wraps
 * generated code/markup in a fenced block even when asked for raw output.
 */
export function stripMarkdownFences(text: string): string {
	const fenced = text.trim().match(/^```[^\n]*\n([\s\S]*?)\n```$/);
	return fenced?.[1] !== undefined ? fenced[1].trim() : text;
}
