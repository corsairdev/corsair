import type { Candidate } from '../schema/content';

/**
 * Strips a single leading/trailing markdown code fence (e.g. ```html ... ```)
 * and surrounding explanatory prose is left untouched — Gemini sometimes wraps
 * generated code/markup in a fenced block even when asked for raw output.
 */
export function stripMarkdownFences(text: string): string {
	const fenced = text.trim().match(/^```[^\n]*\n([\s\S]*?)\n```$/);
	return fenced?.[1] !== undefined ? fenced[1].trim() : text;
}

export type ExtractCandidateTextOptions = {
	stripFences?: boolean;
};

/**
 * Joins answer text from the primary candidate while excluding Gemini
 * reasoning parts. Fence removal is opt-in and never changes the request.
 */
export function extractCandidateText(
	candidate: Candidate | undefined,
	options: ExtractCandidateTextOptions = {},
): string | undefined {
	const textParts = candidate?.content?.parts.filter(
		(part) => part.thought !== true && typeof part.text === 'string',
	);

	if (!textParts || textParts.length === 0) {
		return undefined;
	}

	const text = textParts.map((part) => part.text).join('');
	return options.stripFences ? stripMarkdownFences(text) : text;
}
