import type { CaptureResult } from 'posthog-js';

// The name someone types for their MCP URL travels in URLs on this site
// (/start?handle=, /api/lug-handle?handle=). PostHog doesn't need it, so its
// value is blanked wherever a URL lands in an event. lug.dev did the same.
// Any query pair; its name is decoded before comparing, so %68andle counts too.
const QUERY_PAIR = /([?&])([^=&#\s"'<>]+)=([^&#\s"'<>]*)/g;

function decodedName(name: string): string {
	try {
		return decodeURIComponent(name.replace(/\+/g, ' ')).toLowerCase();
	} catch {
		return name.toLowerCase();
	}
}

export function scrubHandle(value: string): string {
	return value.replace(QUERY_PAIR, (pair, sep: string, name: string) =>
		decodedName(name) === 'handle' ? `${sep}${name}=:value` : pair,
	);
}

// `unknown`: PostHog event properties hold any JSON, so this walks whatever is
// there and only rewrites strings.
function scrubValue(value: unknown): unknown {
	if (typeof value === 'string') return scrubHandle(value);
	if (Array.isArray(value)) return value.map(scrubValue);
	if (value && Object.getPrototypeOf(value) === Object.prototype) {
		return Object.fromEntries(
			Object.entries(value).map(([key, item]) => [key, scrubValue(item)]),
		);
	}
	return value;
}

/** PostHog's before_send. Session snapshots pass through untouched. */
export function scrubEvent(event: CaptureResult | null): CaptureResult | null {
	if (!event || event.event === '$snapshot') return event;
	const scrubbed = {
		...event,
		properties: scrubValue(event.properties) as CaptureResult['properties'],
	};
	if (event.$set)
		scrubbed.$set = scrubValue(event.$set) as CaptureResult['$set'];
	if (event.$set_once)
		scrubbed.$set_once = scrubValue(
			event.$set_once,
		) as CaptureResult['$set_once'];
	return scrubbed;
}
