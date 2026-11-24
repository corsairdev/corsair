import type {
	EndpointSearch,
	SearchChoices,
	SearchJson,
	SearchPart,
} from './index';

/** What a caller is certain of about a question, in this app's own terms. */
export type SearchHints = {
	/** Subject words or phrases. */
	topic?: readonly string[];
	/** Ids the question names, as the app writes them. */
	ids?: readonly string[];
	/** People as this app knows them (login, email, id). */
	people?: readonly string[];
	/** Channels, repos, projects or labels the question names, as the app writes them. */
	places?: readonly string[];
	/** Entity kinds the question asks for, as the plugin's schema names them. */
	kinds?: readonly string[];
	/** States the question asks for, such as `open` or `unread`. */
	states?: readonly string[];
	/** Start of the window, an ISO 8601 instant, inclusive. */
	after?: string;
	/** End of the window, an ISO 8601 instant, exclusive. */
	before?: string;
	/** IANA zone that day formats are written in; UTC when absent. */
	tz?: string;
	limit?: number;
};

type Args = Record<string, unknown>;

const ISO_DAY = /^\d{4}-\d{2}-\d{2}/;
const DAY_MS = 86_400_000;
const OPERATOR_WORD = /^(AND|OR|NOT)$/;

const clean = (values: readonly string[] | undefined, unquote: boolean) => {
	const seen = new Set<string>();
	for (const raw of values ?? []) {
		const v = (unquote ? raw.replace(/"/g, '') : raw).trim();
		if (v) seen.add(v);
	}
	return [...seen];
};

const quoted = (v: string) =>
	/[\s:(){}]/.test(v) || v.startsWith('-') || OPERATOR_WORD.test(v)
		? `"${v}"`
		: v;

const fill = (template: string, vars: Record<string, string>) =>
	template.replace(/\{(\w+)\}/g, (m, k: string) => vars[k] ?? m);

const fillJson = (t: SearchJson, vars: Record<string, string>): SearchJson => {
	if (typeof t === 'string') return fill(t, vars);
	if (Array.isArray(t)) return t.map((x) => fillJson(x, vars));
	if (t && typeof t === 'object') {
		return Object.fromEntries(
			Object.entries(t).map(([k, x]) => [k, fillJson(x, vars)]),
		);
	}
	return t;
};

function parent(args: Args, path: string): [Args, string] {
	const keys = path.split('.');
	const last = keys.pop() as string;
	let node = args;
	for (const k of keys) {
		const next = node[k];
		node =
			next && typeof next === 'object' && !Array.isArray(next)
				? (next as Args)
				: (node[k] = {});
	}
	return [node, last];
}

const dayIn = (ms: number, tz: string | undefined) => {
	try {
		return new Intl.DateTimeFormat('en-CA', {
			timeZone: tz ?? 'UTC',
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		}).format(ms);
	} catch {
		return dayIn(ms, undefined);
	}
};

const addDays = (day: string, n: number) =>
	new Date(Date.parse(`${day}T00:00:00Z`) + n * DAY_MS)
		.toISOString()
		.slice(0, 10);

function written(
	iso: string | undefined,
	edge: 'after' | 'before',
	part: SearchPart,
	tz: string | undefined,
): string | undefined {
	if (!iso || !ISO_DAY.test(iso)) return undefined;
	const ms = Date.parse(iso);
	if (Number.isNaN(ms)) return undefined;
	const format = part.format ?? 'iso';
	if (format === 'iso') return new Date(ms).toISOString();
	if (format === 'epoch') {
		return String(
			edge === 'after' ? Math.floor(ms / 1000) : Math.ceil(ms / 1000),
		);
	}
	let day = dayIn(ms, tz);
	// A day bound that falls mid-day takes in the whole day, so a search never narrows past the window.
	if (edge === 'before' && dayIn(ms - 1, tz) === day) day = addDays(day, 1);
	day = addDays(day, part.shiftDays ?? 0);
	return format === 'YYYY/MM/DD' ? day.replace(/-/g, '/') : day;
}

/**
 * Turns what a caller is certain of into one operation's args, from the
 * operation's own declaration. Pure and deterministic; it holds no app names.
 * Returns null when no hint beyond topic words is one the app can use, so the
 * caller reads the app another way instead of sending a bare keyword search.
 */
export function searchArgs(
	decl: EndpointSearch,
	hints: SearchHints,
): Args | null {
	const args = JSON.parse(JSON.stringify(decl.fixed ?? {})) as Args;
	const { limit } = decl;
	const asked = Math.floor(hints.limit ?? 0);
	const n = asked >= 1 ? asked : limit.default;
	const [limitNode, limitKey] = parent(args, limit.arg);
	limitNode[limitKey] = limit.max ? Math.min(n, limit.max) : n;

	let used = false;

	const place = (
		part: SearchPart,
		values: string[],
		vars: Record<string, string> = {},
		quote = true,
	) => {
		let kept = values;
		if (part.max !== undefined && kept.length > part.max) return false;
		if (part.cap !== undefined) {
			let total = 0;
			const cap = part.cap;
			kept = kept.filter((v) => (total += v.length) <= cap);
		}
		if (!kept.length) return false;
		const [node, key] = parent(args, part.arg);
		if (part.text !== undefined) {
			const templates = typeof part.text === 'string' ? [part.text] : part.text;
			const terms = kept.flatMap((v) =>
				templates.map((t) => fill(t, { v: quote ? quoted(v) : v, ...vars })),
			);
			const term =
				part.join === 'or' && terms.length > 1
					? `(${terms.join(' OR ')})`
					: terms.join(' ');
			node[key] = typeof node[key] === 'string' ? `${node[key]} ${term}` : term;
		} else if (part.list) {
			const list = part.list;
			const items = kept.flatMap((v) =>
				list.map((t) => fillJson(t, { v, ...vars })),
			);
			node[key] = [...(Array.isArray(node[key]) ? node[key] : []), ...items];
		} else if (part.set !== undefined) {
			node[key] = fillJson(part.set, { v: kept[0] as string, ...vars });
		} else return false;
		return true;
	};

	const choose = (
		choices: SearchChoices | undefined,
		asked?: readonly string[],
	) => {
		if (!choices) return;
		const map = new Map(
			Object.entries(choices.map).map(([k, p]) => [k.toLowerCase(), p]),
		);
		const picked = clean(asked, false)
			.map((v) => v.toLowerCase())
			.filter((v, i, all) => map.has(v) && all.indexOf(v) === i);
		if (choices.max !== undefined && picked.length > choices.max) return;
		for (const key of picked) {
			if (place(map.get(key) as SearchPart, [key])) used = true;
		}
	};

	const { hints: map } = decl;
	if (map.topic) place(map.topic, clean(hints.topic, true));
	if (map.ids && place(map.ids, clean(hints.ids, true))) used = true;
	if (map.people && place(map.people, clean(hints.people, true))) used = true;
	if (map.places && place(map.places, clean(hints.places, true))) used = true;
	choose(map.kinds, hints.kinds);
	choose(map.states, hints.states);

	const after = (p: SearchPart) => written(hints.after, 'after', p, hints.tz);
	const before = (p: SearchPart) =>
		written(hints.before, 'before', p, hints.tz);
	const from = map.window && after(map.window);
	const to = map.window && before(map.window);
	if (map.window && from && to) {
		if (place(map.window, [from], { after: from, before: to }, false)) {
			used = true;
		}
	} else {
		for (const [part, value] of [
			[map.after, map.after && after(map.after)],
			[map.before, map.before && before(map.before)],
		] as const) {
			if (part && value && place(part, [value], {}, false)) used = true;
		}
	}

	return used ? args : null;
}
