import { lugHandleProblem } from '@/lib/site-links';

// lug.dev's own availability route: it asks Hub (/lug/handle-availability)
// with the shared secret, so corsair.dev needs no secret of its own. Hub rate
// limits it per caller (120 a minute), shared with lug.dev's own visitors.
// `www.` because lug.dev redirects there.
export const LUG_HANDLE_API = 'https://www.lug.dev/api/handle';

export type LugHandleAnswer =
	| { available: true }
	| {
			available: false;
			reason: 'taken' | 'reserved' | 'blocked' | 'format';
			suggestion?: string;
	  };

const REASONS = new Set(['taken', 'reserved', 'blocked', 'format']);

/**
 * Keeps only the fields the page shows, so nothing else from upstream leaks
 * through. `body` is another service's JSON (or null if it wasn't JSON), so it
 * is `unknown` until each field is checked here.
 */
export function readLugHandleAnswer(body: unknown): LugHandleAnswer | null {
	if (!body || typeof body !== 'object') return null;
	// An object of unchecked fields; each one is tested below before use.
	const { available, reason, suggestion } = body as Record<string, unknown>;
	if (available === true) return { available: true };
	if (available !== false || typeof reason !== 'string') return null;
	if (!REASONS.has(reason)) return null;
	const answer: LugHandleAnswer = {
		available: false,
		reason: reason as 'taken' | 'reserved' | 'blocked' | 'format',
	};
	if (typeof suggestion === 'string' && !lugHandleProblem(suggestion)) {
		answer.suggestion = suggestion;
	}
	return answer;
}
