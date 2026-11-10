import type { XmlRecord, XmlValue } from '../client';

/**
 * The XML parser keeps attributes under `@` and a node's own text under
 * `#text`. These helpers read CodeREADr's shape into the flat objects the
 * endpoint schemas describe.
 */

// unknown: a parsed node is a string for a leaf and a record when it has
// attributes or children; the type has to stay open here.
function asRecord(value: XmlValue | undefined): XmlRecord | undefined {
	return typeof value === 'object' && !Array.isArray(value) ? value : undefined;
}

function asArray(value: XmlValue | undefined): XmlValue[] {
	if (value === undefined) return [];
	return Array.isArray(value) ? value : [value];
}

/** The text of a leaf node, or of a node whose text sits beside its children. */
function textOf(value: XmlValue | undefined): string | undefined {
	if (typeof value === 'string') return value.length > 0 ? value : undefined;
	const record = asRecord(value);
	if (!record) return undefined;
	const text = record['#text'];
	return typeof text === 'string' && text.length > 0 ? text : undefined;
}

function attrsOf(value: XmlValue | undefined): Record<string, string> {
	const attributes = asRecord(value)?.['@'];
	if (typeof attributes !== 'object' || Array.isArray(attributes)) return {};
	const result: Record<string, string> = {};
	for (const [key, entry] of Object.entries(attributes)) {
		if (typeof entry === 'string') result[key] = entry;
	}
	return result;
}

function childOf(
	value: XmlValue | undefined,
	name: string,
): XmlValue | undefined {
	return asRecord(value)?.[name];
}

function numberFrom(text: string | undefined): number | undefined {
	if (text === undefined) return undefined;
	const value = Number.parseInt(text, 10);
	return Number.isNaN(value) ? undefined : value;
}

function attributeNumber(
	value: XmlValue | undefined,
	name: string,
): number | undefined {
	return numberFrom(attrsOf(value)[name]);
}

/** `<user id="3">demo</user>` becomes `{ id: 3, name: 'demo' }`. */
function endpointRef(value: XmlValue | undefined):
	| {
			id?: number;
			name?: string;
	  }
	| undefined {
	if (value === undefined) return undefined;
	const id = attributeNumber(value, 'id');
	const name = textOf(value);
	if (id === undefined && name === undefined) return undefined;
	return { id, name };
}

/** Repeated `<device id="…"/>` nodes become the IDs they carry. */
function idList(value: XmlValue | undefined): number[] | undefined {
	const nodes = asArray(value);
	if (nodes.length === 0) return undefined;
	return nodes
		.map((node) => attributeNumber(node, 'id'))
		.filter((id): id is number => id !== undefined);
}

/** Reads `<count>` at the root, which every list action sends. */
export function readCount(root: XmlRecord): number | undefined {
	return numberFrom(textOf(root.count));
}

/**
 * A repeated element whose body is bare text rather than child nodes means the
 * response is not the shape the docs describe. Returning an empty record would
 * let a wrong-shaped body parse as a list of blank rows, so it fails here.
 */
function requireRecords(
	nodes: XmlValue[],
	element: string,
): (XmlRecord | undefined)[] {
	return nodes.map((node) => {
		const record = asRecord(node);
		if (!record) {
			throw new Error(
				`CodeREADr returned a <${element}> node with text instead of fields`,
			);
		}
		return record;
	});
}

// ── scans ─────────────────────────────────────────────────────────────────

export function shapeScans(root: XmlRecord): {
	count?: number;
	scans: unknown[];
} {
	return {
		count: readCount(root),
		scans: requireRecords(asArray(root.scan), 'scan').map((scan) => {
			const answers = asArray(childOf(scan, 'answer')).map((answer) => ({
				question_id: attributeNumber(answer, 'qid'),
				question_text: attrsOf(answer).qtext,
				answer: textOf(answer),
			}));
			const properties = asRecord(childOf(scan, 'properties'));
			return {
				id: attributeNumber(scan, 'id'),
				barcode_value: textOf(childOf(scan, 'tid')),
				response: textOf(childOf(scan, 'result')),
				status: textOf(childOf(scan, 'status')),
				timestamp: textOf(childOf(scan, 'timestamp')),
				timestamp_received: textOf(childOf(scan, 'timestamp_received')),
				timestamp_modified: textOf(childOf(scan, 'timestamp_modified')),
				device: endpointRef(childOf(scan, 'device')),
				service: endpointRef(childOf(scan, 'service')),
				user: endpointRef(childOf(scan, 'user')),
				answers: answers.length > 0 ? answers : undefined,
				properties: properties
					? Object.fromEntries(
							Object.entries(properties)
								.map(([key, value]) => [key, textOf(value)])
								.filter(
									(entry): entry is [string, string] => entry[1] !== undefined,
								),
						)
					: undefined,
			};
		}),
	};
}

// ── services ──────────────────────────────────────────────────────────────

export function shapeServices(root: XmlRecord): unknown {
	return {
		services: requireRecords(asArray(root.service), 'service').map(
			(service) => ({
				id: attributeNumber(service, 'id'),
				name: textOf(childOf(service, 'name')),
				validation_method: textOf(childOf(service, 'validationmethod')),
				postback_url: textOf(childOf(service, 'postback')),
				database_id: numberFrom(textOf(childOf(service, 'database'))),
				duplicate_scan_value: numberFrom(
					textOf(childOf(service, 'duplicateScanValue')),
				),
				user_ids: idList(childOf(service, 'user')),
				question_ids: idList(childOf(service, 'question')),
			}),
		),
	};
}

// ── databases ─────────────────────────────────────────────────────────────

export function shapeDatabases(root: XmlRecord): unknown {
	return {
		databases: requireRecords(asArray(root.database), 'database').map(
			(database) => ({
				id: attributeNumber(database, 'id'),
				name: textOf(childOf(database, 'name')),
				count: numberFrom(textOf(childOf(database, 'count'))),
				service_ids: idList(childOf(database, 'service')),
			}),
		),
	};
}

export function shapeDatabaseValues(root: XmlRecord): {
	count?: number;
	values: unknown[];
} {
	return {
		count: readCount(root),
		values: requireRecords(asArray(root.value), 'value').map((value) => ({
			value: textOf(childOf(value, 'id')),
			response: textOf(childOf(value, 'response')),
			validity: attributeNumber(value, 'validity'),
		})),
	};
}

// ── users ─────────────────────────────────────────────────────────────────

/** The docs call the device limit `<limit>` and `limit`; `limit` is the newer node. */
export function shapeUsers(root: XmlRecord): unknown {
	return {
		users: requireRecords(asArray(root.user), 'user').map((user) => ({
			id: attributeNumber(user, 'id'),
			username: textOf(childOf(user, 'username')),
			service_ids: idList(childOf(user, 'service')),
			device_limit: numberFrom(
				textOf(childOf(user, 'limit')) ?? textOf(childOf(user, 'device_limit')),
			),
			created: textOf(childOf(user, 'created')),
		})),
	};
}

// ── questions ─────────────────────────────────────────────────────────────

export function shapeQuestions(root: XmlRecord): unknown {
	return {
		questions: requireRecords(asArray(root.question), 'question').map(
			(question) => ({
				id: attributeNumber(question, 'id'),
				text: textOf(childOf(question, 'text')),
				type: textOf(childOf(question, 'type')),
				answers: asArray(childOf(question, 'answer')).map((answer) => ({
					id: attributeNumber(answer, 'id'),
					name: textOf(answer),
				})),
			}),
		),
	};
}

// ── devices ───────────────────────────────────────────────────────────────

export function shapeDevices(root: XmlRecord): unknown {
	return {
		devices: requireRecords(asArray(root.device), 'device').map((device) => ({
			id: attributeNumber(device, 'id'),
			udid: textOf(childOf(device, 'udid')),
			name: textOf(childOf(device, 'devicename')),
			created: textOf(childOf(device, 'created')),
		})),
	};
}

// ── uploads ───────────────────────────────────────────────────────────────

/** Uploads carry every field as an attribute and no child nodes. */
export function shapeUploads(root: XmlRecord): {
	count?: number;
	uploads: unknown[];
} {
	return {
		count: readCount(root),
		uploads: requireRecords(asArray(root.upload), 'upload').map((upload) => ({
			id: attributeNumber(upload, 'id'),
			device_id: attributeNumber(upload, 'device_id'),
			service_id: attributeNumber(upload, 'service_id'),
			user_id: attributeNumber(upload, 'user_id'),
			status: attributeNumber(upload, 'status'),
			count: attributeNumber(upload, 'count'),
			timestamp: attrsOf(upload).timestamp,
		})),
	};
}

// ── limits ────────────────────────────────────────────────────────────────

export function shapeLimits(root: XmlRecord): unknown {
	const readWindow = (node: XmlValue | undefined) => {
		if (node === undefined) return undefined;
		return {
			left: attributeNumber(node, 'left'),
			limit: attributeNumber(node, 'limit'),
		};
	};
	return { minute: readWindow(root.minute), day: readWindow(root.day) };
}

// ── create actions ────────────────────────────────────────────────────────

/** A create answers `<status>1</status>` and an `<id>` holding the new record. */
export function readCreatedId(root: XmlRecord): number | undefined {
	return numberFrom(textOf(root.id));
}
