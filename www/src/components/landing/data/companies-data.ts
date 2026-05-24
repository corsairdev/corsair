export type PersonCell = {
	type: 'person';
	name: string;
	tone?: string;
	shortLabel?: string;
	avatar?: string;
	square?: boolean;
};

export type ConnectionStatus =
	| 'connected'
	| 'missing_credentials'
	| 'not_connected';

export type StatusCell = {
	type: 'status';
	status: ConnectionStatus;
};

export type CellValue = PersonCell | StatusCell;

export type TableColumn = {
	id: string;
	label: string;
	width: number;
	align?: 'left' | 'right';
	isFirstColumn?: boolean;
	/** Domain used by FaviconLogo (twenty-icons.com) for the column header icon */
	iconDomain?: string;
};

export type TableRow = {
	id: string;
	cells: Record<string, CellValue>;
};

export const PERSON_COLUMN_WIDTH = 148;
export const INTEGRATION_COLUMN_WIDTH = 96;

export const INTEGRATIONS = [
	{ id: 'gmail', label: 'Gmail', iconDomain: 'gmail.com' },
	{ id: 'slack', label: 'Slack', iconDomain: 'slack.com' },
	{ id: 'notion', label: 'Notion', iconDomain: 'notion.so' },
	{ id: 'granola', label: 'Granola', iconDomain: 'granola.ai' },
	{ id: 'hubspot', label: 'HubSpot', iconDomain: 'hubspot.com' },
	{ id: 'gcal', label: 'GCal', iconDomain: 'calendar.google.com' },
	{ id: 'stripe', label: 'Stripe', iconDomain: 'stripe.com' },
	{ id: 'airtable', label: 'Airtable', iconDomain: 'airtable.com' },
	{ id: 'linear', label: 'Linear', iconDomain: 'linear.app' },
	{ id: 'github', label: 'GitHub', iconDomain: 'github.com' },
	{ id: 'posthog', label: 'PostHog', iconDomain: 'posthog.com' },
	{ id: 'resend', label: 'Resend', iconDomain: 'resend.com' },
	{ id: 'gsheets', label: 'Sheets', iconDomain: 'sheets.google.com' },
	{ id: 'discord', label: 'Discord', iconDomain: 'discord.com' },
	{ id: 'tavily', label: 'Tavily', iconDomain: 'tavily.com' },
] as const;

export type IntegrationId = (typeof INTEGRATIONS)[number]['id'];

export const TENANT_COLUMNS: TableColumn[] = [
	{
		id: 'person',
		label: '',
		width: PERSON_COLUMN_WIDTH,
		isFirstColumn: true,
	},
	...INTEGRATIONS.map((integration) => ({
		id: integration.id,
		label: integration.label,
		iconDomain: integration.iconDomain,
		width: INTEGRATION_COLUMN_WIDTH,
	})),
];

const av = (file: string) => `/twenty/avatars/${file}`;

function statusPattern(rowIndex: number, colIndex: number): ConnectionStatus {
	const mix = (rowIndex * 5 + colIndex * 3) % 20;
	if (mix === 19) return 'not_connected';
	if (mix >= 17) return 'missing_credentials';
	return 'connected';
}

function buildIntegrationCells(rowIndex: number): Record<string, StatusCell> {
	return Object.fromEntries(
		INTEGRATIONS.map((integration, colIndex) => [
			integration.id,
			{
				type: 'status' as const,
				status: statusPattern(rowIndex, colIndex),
			},
		]),
	);
}

/** Row id for the chat demo (Patrick Collison) — keep first in PEOPLE. */
export const CHAT_DEMO_ROW_ID = 'patrick-collison';

const PEOPLE: PersonCell[] = [
	{
		type: 'person',
		name: 'Patrick Collison',
		tone: 'purple',
		avatar: av('patrick-collison.webp'),
	},
	{
		type: 'person',
		name: 'Dario Amodei',
		tone: 'gray',
		avatar: av('dario-amodei.webp'),
	},
	{
		type: 'person',
		name: 'Ryan Roslansky',
		tone: 'teal',
		avatar: av('ryan-roslansky.webp'),
	},
	{
		type: 'person',
		name: 'Stewart Butterfield',
		tone: 'teal',
		avatar: av('stewart-butterfield.webp'),
	},
	{
		type: 'person',
		name: 'Ivan Zhao',
		tone: 'gray',
		avatar: av('ivan-zhao.webp'),
	},
	{
		type: 'person',
		name: 'Dylan Field',
		tone: 'purple',
		avatar: av('dylan-field.webp'),
	},
	{
		type: 'person',
		name: 'Thomas Dohmke',
		tone: 'gray',
		avatar: av('thomas-dohmke.webp'),
	},
	{
		type: 'person',
		name: 'Joe Gebbia',
		tone: 'pink',
		avatar: av('joe-gebbia.webp'),
	},
	{
		type: 'person',
		name: 'Sundar Pichai',
		tone: 'blue',
		avatar: av('sundar-pichai.webp'),
	},
	{
		type: 'person',
		name: 'Reid Hoffman',
		tone: 'purple',
		avatar: av('reid-hoffman.webp'),
	},
	{
		type: 'person',
		name: 'Brian Chesky',
		tone: 'pink',
		avatar: av('brian-chesky.webp'),
	},
	{
		type: 'person',
		name: 'Chris Wanstrath',
		tone: 'gray',
		avatar: av('chris-wanstrath.webp'),
	},
	{
		type: 'person',
		name: 'Lidiane Jones',
		tone: 'pink',
		avatar: av('anonymous-indira.webp'),
	},
	{
		type: 'person',
		name: 'Ben Chestnut',
		tone: 'amber',
		shortLabel: 'BC',
	},
];

/** People used in the terminal trio landing demos (OAuth, permissions, triggers). */
export const TRIO_DEMO_PEOPLE = [PEOPLE[0], PEOPLE[1], PEOPLE[2]] as const;

export const TENANT_ROWS: TableRow[] = PEOPLE.map((person, index) => ({
	id: person.name.toLowerCase().replace(/\s+/g, '-'),
	cells: {
		person,
		...buildIntegrationCells(index),
	},
}));

export const TABLE_WIDTH =
	PERSON_COLUMN_WIDTH + INTEGRATIONS.length * INTEGRATION_COLUMN_WIDTH + 120;

/** @deprecated Use TENANT_COLUMNS */
export const COMPANIES_COLUMNS = TENANT_COLUMNS;

/** @deprecated Use TENANT_ROWS */
export const COMPANIES_ROWS = TENANT_ROWS;

export const CORSAIR_HOME_NAV = [
	{ id: 'dashboard', label: 'Dashboard', active: false, icon: 'home' },
	{ id: 'quick-start', label: 'Quick Start', active: false, icon: 'sparkles' },
	{ id: 'api-keys', label: 'API Keys', active: false, icon: 'key' },
] as const;

export const CORSAIR_INSTANCE_NAV = [
	{
		id: 'agent-chat-app',
		label: 'Agent Chat App',
		active: true,
		icon: 'instance',
	},
	{
		id: 'internal-ops-chat',
		label: 'Internal Ops Chat',
		active: false,
		icon: 'instance',
	},
] as const;

/** @deprecated Corsair shell uses CORSAIR_* nav exports */
export const WORKSPACE_NAV = CORSAIR_INSTANCE_NAV;

/** @deprecated Corsair shell no longer uses favorites */
export const FAVORITES_NAV = [] as const;

export const CONNECTION_STATUS_LABELS: Record<ConnectionStatus, string> = {
	connected: 'Connected',
	missing_credentials: 'Missing Credentials',
	not_connected: 'Not Connected',
};

export const CONNECTION_STATUS_COLORS: Record<
	ConnectionStatus,
	{ dot: string; text: string }
> = {
	connected: { dot: '#10b981', text: '#1c1c1c' },
	missing_credentials: { dot: '#f59e0b', text: '#1c1c1c' },
	not_connected: { dot: '#ef4444', text: '#1c1c1c' },
};

export type PermissionMode = 'open' | 'cautious' | 'strict' | 'readonly';

export const PERMISSION_MODE_LABELS: Record<PermissionMode, string> = {
	open: 'Open',
	cautious: 'Cautious',
	strict: 'Strict',
	readonly: 'Read-only',
};

/** Per-integration demo permission mode and a trust-building one-liner. */
export const INTEGRATION_PERMISSION_CONFIG: Record<
	IntegrationId,
	{ mode: PermissionMode; trustLine: string }
> = {
	slack: {
		mode: 'cautious',
		trustLine: 'Deletes and archives need your approval.',
	},
	github: {
		mode: 'cautious',
		trustLine: 'Merges and deletes need your approval.',
	},
	gmail: {
		mode: 'strict',
		trustLine: 'The agent cannot send an email until you approve it.',
	},
	linear: {
		mode: 'cautious',
		trustLine: 'Closing or deleting issues needs your approval.',
	},
	hubspot: {
		mode: 'strict',
		trustLine: 'Contact and deal updates need your approval.',
	},
	stripe: {
		mode: 'strict',
		trustLine: 'Charges and refunds need your approval.',
	},
	gcal: {
		mode: 'cautious',
		trustLine: 'Canceling events needs your approval.',
	},
	gsheets: {
		mode: 'strict',
		trustLine: 'Cell edits need your approval.',
	},
	notion: {
		mode: 'cautious',
		trustLine: 'Permanent deletes need your approval.',
	},
	granola: {
		mode: 'readonly',
		trustLine: 'Meeting notes only — no edits.',
	},
	posthog: {
		mode: 'readonly',
		trustLine: 'Read-only — nothing can be changed.',
	},
	resend: {
		mode: 'strict',
		trustLine: 'Sends need your approval.',
	},
	discord: {
		mode: 'cautious',
		trustLine: 'Bans and deletes need your approval.',
	},
	airtable: {
		mode: 'strict',
		trustLine: 'Row edits need your approval.',
	},
	tavily: {
		mode: 'readonly',
		trustLine: 'Search only — no writes.',
	},
};

export const INTEGRATION_BY_ID = Object.fromEntries(
	INTEGRATIONS.map((i) => [i.id, i]),
) as Record<IntegrationId, (typeof INTEGRATIONS)[number]>;

export const CELL_STATUS_CALLOUTS: Record<ConnectionStatus, string> = {
	connected: 'Webhooks active.',
	missing_credentials: 'Add an API key to finish setup.',
	not_connected: 'Send a connect link to authorize.',
};

/** Placeholder shown in the demo — not a real URL. */
export const DEMO_MASKED_CONNECT_URL =
	'https://connect.corsair.dev/t/********?exp=30m';

export type ActivityItem = {
	operation: string;
	timestamp: string;
	status: 'completed' | 'pending';
};

export const ACTIVITY_EVENTS: Omit<ActivityItem, 'timestamp'>[] = [
	{ operation: 'gmail.messages.send', status: 'completed' },
	{ operation: 'gmail.messages.get', status: 'completed' },
	{ operation: 'gmail.messages.list', status: 'completed' },
	{ operation: 'gmail.threads.get', status: 'completed' },
	{ operation: 'gmail.labels.list', status: 'completed' },
	{ operation: 'slack.api.messages.post', status: 'completed' },
	{ operation: 'slack.api.messages.list', status: 'completed' },
	{ operation: 'slack.api.channels.list', status: 'completed' },
	{ operation: 'slack.api.users.info', status: 'completed' },
	{ operation: 'slack.api.reactions.add', status: 'completed' },
	{ operation: 'linear.api.issues.create', status: 'completed' },
	{ operation: 'linear.api.issues.update', status: 'completed' },
	{ operation: 'linear.api.issues.list', status: 'completed' },
	{ operation: 'linear.api.comments.create', status: 'pending' },
	{ operation: 'github.api.pulls.list', status: 'completed' },
	{ operation: 'github.api.pulls.create', status: 'completed' },
	{ operation: 'github.api.issues.get', status: 'completed' },
	{ operation: 'github.api.repos.list', status: 'completed' },
	{ operation: 'github.api.commits.list', status: 'completed' },
	{ operation: 'stripe.api.charges.list', status: 'completed' },
	{ operation: 'stripe.api.charges.create', status: 'pending' },
	{ operation: 'stripe.api.customers.get', status: 'completed' },
	{ operation: 'stripe.api.invoices.list', status: 'completed' },
	{ operation: 'hubspot.api.contacts.search', status: 'completed' },
	{ operation: 'hubspot.api.deals.update', status: 'pending' },
	{ operation: 'hubspot.api.companies.get', status: 'completed' },
	{ operation: 'notion.api.pages.get', status: 'completed' },
	{ operation: 'notion.api.pages.create', status: 'completed' },
	{ operation: 'notion.api.databases.query', status: 'completed' },
	{ operation: 'gcal.api.events.list', status: 'completed' },
	{ operation: 'gcal.api.events.create', status: 'completed' },
	{ operation: 'gcal.api.events.update', status: 'pending' },
	{ operation: 'gsheets.api.spreadsheets.get', status: 'completed' },
	{ operation: 'gsheets.api.values.update', status: 'pending' },
	{ operation: 'gsheets.api.values.get', status: 'completed' },
	{ operation: 'posthog.api.events.list', status: 'completed' },
	{ operation: 'posthog.api.insights.get', status: 'completed' },
	{ operation: 'resend.api.emails.send', status: 'pending' },
	{ operation: 'resend.api.emails.get', status: 'completed' },
	{ operation: 'discord.api.messages.post', status: 'completed' },
	{ operation: 'discord.api.channels.list', status: 'completed' },
	{ operation: 'airtable.api.records.list', status: 'completed' },
	{ operation: 'airtable.api.records.create', status: 'completed' },
	{ operation: 'tavily.api.search', status: 'completed' },
	{ operation: 'tavily.api.extract', status: 'completed' },
];

const ACTIVITY_SAMPLE_SIZE = 5;
const ACTIVITY_WINDOW_MS = 48 * 60 * 60 * 1000;

function pickRandomUnique<T>(items: T[], count: number): T[] {
	const pool = [...items];
	const picked: T[] = [];
	const n = Math.min(count, pool.length);
	for (let i = 0; i < n; i++) {
		const index = Math.floor(Math.random() * pool.length);
		picked.push(pool[index]);
		pool.splice(index, 1);
	}
	return picked;
}

function randomTimestampsInPast48Hours(count: number): Date[] {
	const now = Date.now();
	return Array.from({ length: count }, () => {
		const offsetMs = Math.floor(Math.random() * ACTIVITY_WINDOW_MS);
		return new Date(now - offsetMs);
	}).sort((a, b) => b.getTime() - a.getTime());
}

function formatActivityTimestamp(date: Date): string {
	return date.toLocaleString('en-US', {
		month: 'numeric',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		second: '2-digit',
	});
}

/** Random sample of recent events — new set each time the sidebar opens. */
export function sampleUserActivity(): ActivityItem[] {
	const events = pickRandomUnique(ACTIVITY_EVENTS, ACTIVITY_SAMPLE_SIZE);
	const timestamps = randomTimestampsInPast48Hours(events.length);
	return events.map((event, index) => ({
		...event,
		timestamp: formatActivityTimestamp(timestamps[index]),
	}));
}

export function getFirstName(fullName: string): string {
	return fullName.trim().split(/\s+/)[0] ?? fullName;
}
