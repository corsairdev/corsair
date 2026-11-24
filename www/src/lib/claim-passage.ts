// The steps of corsair.dev/start: name the URL, pick apps, pick agents, then
// hand off to Hub's sign-in. Ported from lug.dev (hub apps/lug/src/lib/passage.ts).
// Differences: the catalog comes in as `appIds` (corsair.dev loads it), and a
// name in the link starts at the app picker, because the homepage form that
// sends it has already checked it. The flow checks it again on every step.
import { CLAIM_CLIENTS } from './claim-clients';
import type { NameProblem } from './claim-handle';
import { handleProblem, linkProblem, tidyTyped } from './claim-handle';
import { DEFAULT_LINK } from './claim-hub-url';
import type { LugHandleAnswer } from './lug-handle';

export const STEPS = ['claim', 'pick', 'review'] as const;
export type Step = (typeof STEPS)[number];

export type Passage = {
	step: Step;
	handle: string;
	link: string;
	apps: string[];
	/** The agents the URL is for, in the order picked; never empty. The first is the one Hub opens on. */
	clients: string[];
	/** A starter skill the visitor came to set up; Hub sets it up once its apps are connected. Empty when none. */
	skill: string;
};

export type PassageEvent =
	| { type: 'typeHandle'; raw: string }
	| { type: 'typeLink'; raw: string }
	| { type: 'toggleApp'; id: string }
	| { type: 'toggleClient'; id: string }
	| { type: 'next' }
	| { type: 'back' }
	| { type: 'goto'; step: Step };

/** Hub's answer for a handle, from /api/lug-handle. */
export type HandleAvailabilityState =
	| { status: 'idle' }
	| { status: 'checking' }
	| { status: 'ready'; data: LugHandleAnswer }
	| { status: 'error' };

export type Blocker =
	| NameProblem
	| 'blocked'
	| 'taken'
	| 'checking'
	| 'no-apps';

export const MAX_APPS = 8;
const MAX_CLIENTS = CLAIM_CLIENTS.length;
const FALLBACK_CLIENT = 'claude';
const CLIENT_IDS = new Set(CLAIM_CLIENTS.map((c) => c.id));

// Desktop clients embed a browser whose UA names the app; Cursor and Windsurf
// are VS Code forks, so they must be matched before `Code/`.
const UA_CLIENTS: ReadonlyArray<[RegExp, string]> = [
	[/\bCursor\//, 'cursor'],
	[/\bWindsurf\//, 'windsurf'],
	[/\bCode\//, 'vscode'],
	[/\bClaude\//, 'claude'],
	[/\bChatGPT\//, 'chatgpt'],
	[/\bZed\//, 'zed'],
];

export function guessClient(ua: string): string {
	return UA_CLIENTS.find(([re]) => re.test(ua))?.[1] ?? FALLBACK_CLIENT;
}

export function start(ua: string): Passage {
	return {
		step: 'claim',
		handle: '',
		link: DEFAULT_LINK,
		apps: [],
		clients: [guessClient(ua)],
		skill: '',
	};
}

function reachable(p: Passage, step: Step): boolean {
	if (step === 'claim') return true;
	if (handleProblem(p.handle)) return false;
	return step === 'pick' || p.apps.length > 0;
}

function clamp(p: Passage, step: Step): Step {
	for (let i = STEPS.indexOf(step); i > 0; i--) {
		const s = STEPS[i] as Step;
		if (reachable(p, s)) return s;
	}
	return 'claim';
}

/**
 * Whether a visit past the name step has lost its handle. A handle was checked
 * when it was claimed, not since: someone may have taken it in the meantime, or
 * it came in a link. The name step then says why.
 */
export function claimLapsed(
	p: Passage,
	availability: HandleAvailabilityState,
): boolean {
	return (
		p.step !== 'claim' &&
		!handleProblem(p.handle) &&
		availability.status === 'ready' &&
		!availability.data.available
	);
}

/**
 * Whether the name step may continue. A failed check doesn't hold it up: Hub
 * checks again before the URL is made, as it does for the homepage form.
 */
export function claimReady(
	handle: string,
	availability: HandleAvailabilityState,
): boolean {
	if (!handle || handleProblem(handle)) return false;
	if (availability.status === 'error') return true;
	return availability.status === 'ready' && availability.data.available;
}

/** What stops the visitor leaving the current step, as far as the draft alone can tell. */
export function blocker(p: Passage): Blocker | null {
	if (p.step === 'claim') return handleProblem(p.handle);
	if (p.step === 'pick') return p.apps.length ? null : 'no-apps';
	return linkProblem(p.link);
}

export function advance(
	p: Passage,
	e: PassageEvent,
	appIds: ReadonlySet<string>,
): Passage {
	switch (e.type) {
		case 'typeHandle':
			return { ...p, handle: tidyTyped(e.raw) };
		case 'typeLink':
			return { ...p, link: tidyTyped(e.raw) };
		case 'toggleApp': {
			if (p.apps.includes(e.id)) {
				return { ...p, apps: p.apps.filter((id) => id !== e.id) };
			}
			if (!appIds.has(e.id) || p.apps.length >= MAX_APPS) return p;
			return { ...p, apps: [...p.apps, e.id] };
		}
		case 'toggleClient': {
			// The last agent stays: the URL is always for at least one.
			if (p.clients.includes(e.id)) {
				return p.clients.length > 1
					? { ...p, clients: p.clients.filter((id) => id !== e.id) }
					: p;
			}
			if (!CLIENT_IDS.has(e.id) || p.clients.length >= MAX_CLIENTS) return p;
			return { ...p, clients: [...p.clients, e.id] };
		}
		case 'next': {
			const to = STEPS[STEPS.indexOf(p.step) + 1];
			return to && !blocker(p) && reachable(p, to) ? { ...p, step: to } : p;
		}
		case 'back':
			return {
				...p,
				step: STEPS[Math.max(0, STEPS.indexOf(p.step) - 1)] as Step,
			};
		case 'goto':
			return reachable(p, e.step) ? { ...p, step: e.step } : p;
	}
}

/** `search` goes in the URL so Back works, empty on the name step; `saved` goes in sessionStorage so refresh keeps the draft. */
export function save(p: Passage): { search: string; saved: string } {
	const { step, ...draft } = p;
	return {
		search: step === 'claim' ? '' : `?step=${step}`,
		saved: JSON.stringify(draft),
	};
}

/** Known agent ids, deduplicated, in order; unknown ones are dropped. */
// `unknown`: the ids come from the URL or a stored draft, so each is checked.
function cleanClients(ids: readonly unknown[]): string[] {
	const known = ids.filter(
		(id): id is string => typeof id === 'string' && CLIENT_IDS.has(id),
	);
	return Array.from(new Set(known)).slice(0, MAX_CLIENTS);
}

// `unknown`: the ids come from the URL or a stored draft, so each is checked.
function cleanApps(ids: readonly unknown[], appIds: ReadonlySet<string>) {
	const known = ids.filter(
		(id): id is string => typeof id === 'string' && appIds.has(id),
	);
	return Array.from(new Set(known)).slice(0, MAX_APPS);
}

/**
 * What a link asks for: /start?handle=acme&apps=gmail,slack&clients=cursor,claude
 * (`plugins=` works as `apps=`, as on Hub's login link; a single `client=` works
 * too), and `skill=` from a "Set up" button. Unknown apps, agents and skills and
 * an invalid handle are dropped; apps are capped at 8 like a pick.
 */
export function prefill(
	search: string,
	appIds: ReadonlySet<string>,
	skillSlugs: ReadonlySet<string>,
): { handle: string; apps: string[]; clients?: string[]; skill: string } {
	const params = new URLSearchParams(search);
	const split = (value: string | null) =>
		(value ?? '').split(',').map((id) => id.trim().toLowerCase());
	const apps = cleanApps(
		split(params.get('apps') ?? params.get('plugins')),
		appIds,
	);
	const handle = tidyTyped((params.get('handle') ?? '').trim());
	const clients = cleanClients(
		split(params.get('clients') ?? params.get('client')),
	);
	const skill = (params.get('skill') ?? '').trim().toLowerCase();
	return {
		handle: handleProblem(handle) ? '' : handle,
		apps,
		clients: clients.length ? clients : undefined,
		skill: skillSlugs.has(skill) ? skill : '',
	};
}

type Draft = Omit<Passage, 'step'>;

function readDraft(
	saved: string | null,
	appIds: ReadonlySet<string>,
	skillSlugs: ReadonlySet<string>,
): Draft | null {
	// `unknown`: parsed from sessionStorage, which anyone can edit; checked field by field below.
	let raw: unknown;
	try {
		raw = saved ? JSON.parse(saved) : null;
	} catch {
		return null;
	}
	if (!raw || typeof raw !== 'object') return null;
	// Fields from storage, each checked below before use.
	const d = raw as Record<string, unknown>;
	if (typeof d.handle !== 'string' || !Array.isArray(d.apps)) return null;
	return {
		handle: tidyTyped(d.handle),
		link:
			typeof d.link === 'string' && !linkProblem(d.link)
				? d.link
				: DEFAULT_LINK,
		apps: cleanApps(d.apps, appIds),
		clients: cleanClients(Array.isArray(d.clients) ? d.clients : []),
		skill:
			typeof d.skill === 'string' && skillSlugs.has(d.skill) ? d.skill : '',
	};
}

export function restore(
	search: string,
	saved: string | null,
	ua: string,
	appIds: ReadonlySet<string>,
	skillSlugs: ReadonlySet<string>,
): Passage {
	const fromLink = prefill(search, appIds, skillSlugs);
	const draft = readDraft(saved, appIds, skillSlugs);
	// Apps or a skill in the link come from a "Set up" button, a fresh choice:
	// they replace the draft's apps and skill. Otherwise the draft keeps its own.
	const freshPick = fromLink.apps.length > 0 || fromLink.skill !== '';
	const p: Passage = {
		step: 'claim',
		handle: fromLink.handle || draft?.handle || '',
		link: draft?.link ?? DEFAULT_LINK,
		apps: freshPick ? fromLink.apps : (draft?.apps ?? []),
		clients:
			fromLink.clients ??
			(draft?.clients.length ? draft.clients : [guessClient(ua)]),
		skill: freshPick ? fromLink.skill : (draft?.skill ?? ''),
	};
	if (!p.handle) return p;
	// A name in the link was typed on the homepage, which checked it: apps next.
	if (fromLink.handle) return { ...p, step: clamp(p, 'pick') };
	const asked = new URLSearchParams(search).get('step');
	const step = STEPS.find((s) => s === asked) ?? 'claim';
	return { ...p, step: clamp(p, step) };
}
