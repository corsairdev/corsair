import type { CaptureResult } from 'posthog-js';

// The name someone types for their MCP URL travels in URLs on this site
// (/start?handle=, /api/lug-handle?handle=). PostHog doesn't need it, so its
// value is blanked wherever a URL lands in an event. lug.dev did the same.
const HANDLE_PARAM = /([?&]handle=)[^&#\s"'<>]*/g;

export function scrubHandle(value: string): string {
	return value.replace(HANDLE_PARAM, '$1:value');
}

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
