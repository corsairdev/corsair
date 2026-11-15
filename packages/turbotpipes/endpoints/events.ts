// Event payloads persist in event history, so they carry identifiers only:
// handles, ids, aliases, names and the AI provider. Commands, SQL, chat
// messages and titles, list filters, configs, keys, notifier targets, snapshot
// data and emails are never logged.
const IDENTIFIER_KEY = /^(handle|name|provider)$|_(handle|id|alias|name)$/;

/** The identifier fields of an endpoint input, for its event payload. */
export function eventIdentifiers(input: object): Record<string, string> {
	const ids: Record<string, string> = {};
	for (const [key, value] of Object.entries(input)) {
		if (typeof value === 'string' && IDENTIFIER_KEY.test(key)) {
			ids[key] = value;
		}
	}
	return ids;
}
