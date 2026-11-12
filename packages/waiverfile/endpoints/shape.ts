import { WaiverFileAPIError } from '../client';

/**
 * WaiverFile answers in three different serialisations, depending on the route:
 *
 * 1. **A serialised .NET object.** Events, forms, categories and the site come
 *    back with their columns under a `me` property in lowerCamelCase (`iD`,
 *    `waiverEventID`, `name`), and the rest as private fields (`_managerIDs`,
 *    `<Category>k__BackingField`). `fromDotNet` flattens that into the
 *    PascalCase object the API documents (`ID`, `WaiverEventID`, `Name`,
 *    `ManagerIDs`, `Category`).
 * 2. **XML converted to JSON.** The waiver reads put waivers under
 *    `ArrayOfWaiver.Waiver` (an object when there is one, an array otherwise),
 *    every value is a string, and participants sit under
 *    `Particpants.WaiverParticipant` with the same one-or-many rule.
 *    `xmlWaivers` and `xmlWaiver` turn those into arrays.
 * 3. **Plain JSON scalars.** `Ping` is the string `"Service online"`, the
 *    counts are bare numbers, the webhook routes answer `"OK"`, and
 *    `GetUpcomingEvents` is a JSON string whose value is the JSON array.
 *
 * All of this was checked against a live trial account on 2026-11-12.
 */

// unknown: every helper below takes a response body before any schema has
// parsed it.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** `<Name>k__BackingField` → `Name`, `_managerIDs` → `ManagerIDs`, `iD` → `ID`. */
function pascalKey(key: string): string {
	const backing = /^<(.+)>k__BackingField$/.exec(key);
	const bare = backing?.[1] ?? key.replace(/^_+/, '');
	return bare.charAt(0).toUpperCase() + bare.slice(1);
}

/** Flattens a serialised .NET object (see 1. above), recursively. */
// unknown: input and output are untyped JSON; the output schema parses it.
export function fromDotNet(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(fromDotNet);
	if (!isRecord(value)) return value;
	const out: Record<string, unknown> = {};
	for (const [key, entry] of Object.entries(value)) {
		if (key === 'me') continue;
		out[pascalKey(key)] = fromDotNet(entry);
	}
	// The columns win over a private field of the same name.
	if (isRecord(value.me)) {
		for (const [key, entry] of Object.entries(value.me)) {
			out[pascalKey(key)] = fromDotNet(entry);
		}
	}
	return out;
}

/** One item or many, as XML-to-JSON produces them, always as an array. */
// unknown: an XML-converted node of any shape.
function oneOrMany(value: unknown): unknown[] {
	if (value === undefined || value === null) return [];
	return Array.isArray(value) ? value : [value];
}

/**
 * Some routes answer a failure as a 200 with a plain-text body, for example
 * `"Error running waiver search"`. A string where an object belongs is that.
 */
// unknown: the raw body.
function failIfText(raw: unknown, path: string): void {
	if (typeof raw === 'string') {
		throw new WaiverFileAPIError(`WaiverFile 200: ${raw}`, {
			status: 200,
			body: raw,
			method: 'GET',
			path,
		});
	}
}

/**
 * Raises when a 200 lacks the container its route always sends. The shared
 * transport returns undefined for a body it cannot read, and turning that into
 * an empty list or an empty object would report a failed read as a real answer.
 * Live, an empty list is still `[]` or `{ ArrayOfWaiver: {…} }`, and an unknown
 * waiver is a 400, so a missing container is never a valid answer.
 */
export function missingContainer(
	raw: unknown,
	path: string,
	expected: string,
): never {
	throw new WaiverFileAPIError(
		`WaiverFile 200 from ${path} without ${expected}`,
		{
			status: 200,
			body: raw === undefined ? undefined : typeof raw,
			method: 'GET',
			path,
		},
	);
}

/** One XML-converted waiver: drops the `@xmlns` attributes, lists participants. */
// unknown: an XML-converted waiver node.
export function xmlWaiver(value: unknown): Record<string, unknown> {
	if (!isRecord(value)) return {};
	const out: Record<string, unknown> = {};
	for (const [key, entry] of Object.entries(value)) {
		if (!key.startsWith('@')) out[key] = entry;
	}
	const participants = isRecord(value.Particpants)
		? value.Particpants.WaiverParticipant
		: undefined;
	out.Particpants = oneOrMany(participants);
	return out;
}

/** `{ ArrayOfWaiver: { Waiver: … } }` → `{ Waivers: [...] }`. */
// unknown: the raw body.
export function xmlWaivers(
	raw: unknown,
	path: string,
): { Waivers: Record<string, unknown>[] } {
	failIfText(raw, path);
	const list = isRecord(raw) ? raw.ArrayOfWaiver : undefined;
	if (!isRecord(list)) missingContainer(raw, path, 'ArrayOfWaiver');
	const waivers = oneOrMany(list.Waiver);
	return { Waivers: waivers.map(xmlWaiver) };
}

/** `{ Waiver: {...}, CustomFields: {...} }` → the waiver with its `CustomFields`. */
// unknown: the raw body.
export function xmlSingleWaiver(
	raw: unknown,
	path: string,
): Record<string, unknown> {
	failIfText(raw, path);
	if (!isRecord(raw) || !isRecord(raw.Waiver)) {
		missingContainer(raw, path, 'a Waiver');
	}
	return {
		...xmlWaiver(raw.Waiver),
		...(raw.CustomFields === undefined
			? {}
			: { CustomFields: raw.CustomFields }),
	};
}

/** A bare JSON array of .NET objects, under the key the schema names. */
// unknown: the raw body.
export function dotNetList<K extends string>(
	raw: unknown,
	key: K,
	path: string,
): Record<K, unknown[]> {
	failIfText(raw, path);
	if (!Array.isArray(raw)) missingContainer(raw, path, 'an array');
	return { [key]: raw.map(fromDotNet) } as Record<K, unknown[]>;
}

/** `GetUpcomingEvents` serialises its array twice: a JSON string of JSON. */
// unknown: the raw body.
export function parseTwice(raw: unknown): unknown {
	if (typeof raw !== 'string') return raw;
	try {
		return JSON.parse(raw);
	} catch {
		return raw;
	}
}

/** A bare number, as the count routes answer. */
// unknown: the raw body.
export function countFrom(raw: unknown, path: string): { Count: number } {
	if (typeof raw === 'number') return { Count: raw };
	if (typeof raw === 'string' && /^\d+$/.test(raw.trim())) {
		return { Count: Number(raw.trim()) };
	}
	throw new WaiverFileAPIError(
		`WaiverFile returned ${typeof raw} where a count was expected`,
		{ status: 200, method: 'GET', path },
	);
}
