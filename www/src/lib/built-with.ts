// "Built with Corsair": projects outside the team built on Corsair. The list lives in
// github.com/corsairdev/awesome-corsair (data/projects.yaml), whose build writes data/built-with.json; this page
// reads that file, so a merged entry shows up within the revalidate window without a deploy here.

export const BUILT_WITH_REPO = 'https://github.com/corsairdev/awesome-corsair';
export const BUILT_WITH_SUBMIT = `${BUILT_WITH_REPO}/blob/main/CONTRIBUTING.md#how-to-submit`;
const DATA_URL =
	'https://raw.githubusercontent.com/corsairdev/awesome-corsair/main/data/built-with.json';
/** Seconds between re-reads of the list. */
export const BUILT_WITH_REVALIDATE = 3600;

export type BuiltWithCategory = { id: string; title: string; blurb: string };

export type BuiltWithProject = {
	id: string;
	name: string;
	url: string;
	repo: string;
	author: string;
	category: string;
	kind: string[];
	lang: string[];
	corsair: string[];
	description: string;
	event: string;
	hosted: boolean;
	added: string;
	verified: boolean;
};

export type BuiltWith = {
	categories: BuiltWithCategory[];
	projects: BuiltWithProject[];
};

// The file is built from another repo that outside contributors edit by pull request, so nothing in it is
// trusted: every field is checked and normalized here, and a row that isn't a project is dropped. A bad row
// then costs one card, never the page.

const isString = (v: unknown): v is string => typeof v === 'string';

/** Only the strings in a list; anything else in it (a number, an object) is left out. */
const strings = (v: unknown): string[] =>
	Array.isArray(v) ? v.filter(isString) : [];

// Takes unknown because it is what narrows a parsed JSON row into a project: the row can be any JSON value.
function toProject(row: unknown): BuiltWithProject | null {
	if (!row || typeof row !== 'object' || Array.isArray(row)) return null;
	// A JSON object's fields are unknown until each one is checked below.
	const o = row as Record<string, unknown>;
	if (
		!isString(o.id) ||
		!isString(o.name) ||
		!isString(o.url) ||
		!/^https?:\/\//.test(o.url) ||
		!isString(o.repo) ||
		!isString(o.description) ||
		!isString(o.category) ||
		!Array.isArray(o.corsair)
	)
		return null;
	return {
		id: o.id,
		name: o.name,
		url: o.url,
		repo: o.repo,
		description: o.description,
		category: o.category,
		author: isString(o.author) ? o.author : '',
		kind: strings(o.kind),
		lang: strings(o.lang),
		corsair: strings(o.corsair),
		event: isString(o.event) ? o.event : '',
		hosted: o.hosted === true,
		added: isString(o.added) ? o.added : '',
		verified: o.verified === true,
	};
}

// Takes unknown like toProject: a category row can be any JSON value until it is checked.
function toCategory(row: unknown): BuiltWithCategory | null {
	if (!row || typeof row !== 'object' || Array.isArray(row)) return null;
	// A JSON object's fields are unknown until each one is checked below.
	const o = row as Record<string, unknown>;
	if (!isString(o.id) || !isString(o.title)) return null;
	return { id: o.id, title: o.title, blurb: isString(o.blurb) ? o.blurb : '' };
}

const kept = <T>(rows: (T | null)[]): T[] =>
	rows.filter((r): r is T => r !== null);

// Takes unknown because it parses the fetched file, which can be any JSON value (or none at all).
/** Keeps only well-formed entries, so a bad row in the source can't break the page. */
export function parseBuiltWith(json: unknown): BuiltWith | null {
	if (!json || typeof json !== 'object') return null;
	// The file's top-level fields are unknown until checked below.
	const o = json as Record<string, unknown>;
	if (!Array.isArray(o.categories) || !Array.isArray(o.projects)) return null;
	return {
		categories: kept(o.categories.map(toCategory)),
		projects: kept(o.projects.map(toProject)),
	};
}

export async function getBuiltWith(): Promise<BuiltWith | null> {
	try {
		const res = await fetch(DATA_URL, {
			next: { revalidate: BUILT_WITH_REVALIDATE },
		});
		if (!res.ok) return null;
		return parseBuiltWith(await res.json());
	} catch {
		return null;
	}
}

/** Categories in the source's order, each with its projects by name; empty categories are left out. */
export function builtWithByCategory(data: BuiltWith) {
	return data.categories
		.map((category) => ({
			category,
			projects: data.projects
				.filter((p) => p.category === category.id)
				.sort((a, b) => a.name.localeCompare(b.name)),
		}))
		.filter((g) => g.projects.length > 0);
}

const APP_NAMES: Record<string, string> = {
	gmail: 'Gmail',
	googlecalendar: 'Google Calendar',
	googledrive: 'Google Drive',
	googlesheets: 'Google Sheets',
	github: 'GitHub',
	slack: 'Slack',
	linear: 'Linear',
	notion: 'Notion',
	outlook: 'Outlook',
	jira: 'Jira',
	hubspot: 'HubSpot',
	zendesk: 'Zendesk',
	discord: 'Discord',
	telegram: 'Telegram',
	calendly: 'Calendly',
	stripe: 'Stripe',
	exa: 'Exa',
	firecrawl: 'Firecrawl',
	resend: 'Resend',
	airtable: 'Airtable',
	asana: 'Asana',
	trello: 'Trello',
	todoist: 'Todoist',
	zoom: 'Zoom',
	sentry: 'Sentry',
	posthog: 'PostHog',
};

/** The apps a project uses that have a logo: real plugin ids only, not the "mcp" marker or a "plus-N-more" count. */
export function builtWithApps(project: BuiltWithProject): string[] {
	return project.corsair.filter((id) => /^[a-z0-9]+$/.test(id) && id !== 'mcp');
}

/** How many more plugins the source counted than it listed ("plus-278-more"). */
export function builtWithMoreApps(project: BuiltWithProject): number {
	const more = project.corsair
		.map((id) => /^plus-(\d+)-more$/.exec(id)?.[1])
		.find(Boolean);
	return more ? Number(more) : 0;
}

export function builtWithAppName(id: string): string {
	// Own names only: an id such as "constructor" would otherwise read Object's inherited property.
	return Object.hasOwn(APP_NAMES, id)
		? APP_NAMES[id]!
		: id.charAt(0).toUpperCase() + id.slice(1);
}

export function builtWithCategorySlug(id: string): string {
	return id.replace(/[^a-z0-9-]/g, '');
}
