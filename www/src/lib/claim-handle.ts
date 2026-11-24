// Name rules for corsair.dev/start, ported from lug.dev (hub
// apps/lug/src/lib/handle.ts). The handle check is site-links' format and
// reserved list, the one the homepage form uses. Hub stays the authority: its
// availability check (/api/lug-handle) also answers for brand names and the
// blocklist, and it checks everything again after sign-in.
import { lugHandleProblem } from '@/lib/site-links';

export const HANDLE_MAX_LENGTH = 32;

const NAME_RE = /^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$/;

export type NameProblem = 'format' | 'reserved';

export function handleProblem(handle: string): NameProblem | null {
	return lugHandleProblem(handle);
}

/** The path after the handle (`/work`): the handle's format, without the reserved names. */
export function linkProblem(link: string): 'format' | null {
	return NAME_RE.test(link) ? null : 'format';
}

export function tidyTyped(raw: string): string {
	return raw.toLowerCase().replace(/\s/g, '-');
}
