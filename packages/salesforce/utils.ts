/**
 * Escapes special characters in string values to safely construct SOQL queries,
 * including LIKE wildcards (`%`, `_`).
 */
export function escapeSoql(value: string): string {
	return value
		.replace(/\\/g, '\\\\')
		.replace(/'/g, "\\'")
		.replace(/%/g, '\\%')
		.replace(/_/g, '\\_');
}

/**
 * Parses CSV text responses (e.g. from Salesforce Bulk API v2 result endpoints)
 * into an array of key-value records. If response is already an array, returns it.
 */
export function parseCsvRecords(
	response: unknown,
): Array<Record<string, unknown>> {
	if (Array.isArray(response)) {
		return response as Array<Record<string, unknown>>;
	}

	if (typeof response === 'string' && response.trim().length > 0) {
		const rows = parseCsvRows(response);
		const headers = rows[0];
		if (!headers || rows.length <= 1) return [];

		const records: Array<Record<string, unknown>> = [];
		for (let i = 1; i < rows.length; i++) {
			const values = rows[i];
			if (!values || values.every((value) => value === '')) continue;
			const record: Record<string, unknown> = {};
			for (let j = 0; j < headers.length; j++) {
				const header = headers[j];
				if (header) {
					record[header] = values[j] ?? '';
				}
			}
			records.push(record);
		}
		return records;
	}

	return [];
}

function parseCsvRows(text: string): string[][] {
	const rows: string[][] = [];
	let row: string[] = [];
	let current = '';
	let inQuotes = false;
	let quoted = false;

	const pushField = () => {
		row.push(quoted ? current : current.trim());
		current = '';
		quoted = false;
	};

	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		if (inQuotes) {
			if (char === '"') {
				if (text[i + 1] === '"') {
					current += '"';
					i++;
				} else {
					inQuotes = false;
				}
			} else {
				current += char;
			}
			continue;
		}
		if (char === '"') {
			inQuotes = true;
			quoted = true;
			continue;
		}
		if (char === ',') {
			pushField();
			continue;
		}
		if (char === '\n' || char === '\r') {
			if (char === '\r' && text[i + 1] === '\n') i++;
			pushField();
			if (row.some((value) => value !== '')) rows.push(row);
			row = [];
			continue;
		}
		current += char;
	}

	pushField();
	if (row.some((value) => value !== '')) rows.push(row);
	return rows;
}

/** Keeps only fields Salesforce reports as createable on the sObject. */
export function createableNames(describe: {
	fields?: Array<{ name?: string; createable?: boolean }>;
}): Set<string> {
	const names = new Set<string>();
	for (const field of describe.fields ?? []) {
		if (field.createable && typeof field.name === 'string') {
			names.add(field.name);
		}
	}
	return names;
}

export function cloneableFields(
	record: Record<string, unknown>,
	createable: Set<string>,
): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(record)) {
		if (createable.has(key)) out[key] = value;
	}
	return out;
}

export function assertSobjectName(name: string): string {
	if (!/^[A-Za-z][A-Za-z0-9_]{0,39}$/.test(name)) {
		throw new Error('Invalid Salesforce sObject name');
	}
	return name;
}

const SOQL_FIELD = /^[A-Za-z][A-Za-z0-9_.]*$/;
const SOQL_OP = /^(=|!=|<>|LIKE|>|<|>=|<=|IN)$/i;

function isSoqlLiteral(value: string): boolean {
	const v = value.trim();
	if (/^(true|false|null)$/i.test(v)) return true;
	if (/^-?\d+(\.\d+)?$/.test(v)) return true;
	return /^'(?:[^'\\]|\\.)*'$/.test(v);
}

function splitSoqlList(inner: string): string[] {
	const parts: string[] = [];
	let current = '';
	let inQuote = false;
	for (let i = 0; i < inner.length; i++) {
		const ch = inner[i];
		if (inQuote) {
			current += ch;
			if (ch === '\\' && i + 1 < inner.length) {
				current += inner[++i];
			} else if (ch === "'") {
				inQuote = false;
			}
			continue;
		}
		if (ch === "'") {
			inQuote = true;
			current += ch;
			continue;
		}
		if (ch === ',') {
			parts.push(current);
			current = '';
			continue;
		}
		current += ch;
	}
	parts.push(current);
	return parts;
}

function splitSoqlLogic(sql: string): string[] {
	const clauses: string[] = [];
	let current = '';
	let inQuote = false;
	let i = 0;
	while (i < sql.length) {
		const ch = sql[i];
		if (inQuote) {
			current += ch;
			if (ch === '\\' && i + 1 < sql.length) {
				current += sql[++i];
			} else if (ch === "'") {
				inQuote = false;
			}
			i++;
			continue;
		}
		if (ch === "'") {
			inQuote = true;
			current += ch;
			i++;
			continue;
		}
		const rest = sql.slice(i);
		const m = rest.match(/^\s+(AND|OR)\s+/i);
		if (m) {
			clauses.push(current.trim());
			current = '';
			i += m[0].length;
			continue;
		}
		current += ch;
		i++;
	}
	clauses.push(current.trim());
	return clauses;
}

function assertSoqlClause(clause: string): void {
	const m = clause.match(
		/^([A-Za-z][A-Za-z0-9_.]*)\s*(=|!=|<>|LIKE|>=|<=|>|<|IN)\s*(.+)$/i,
	);
	if (!m || !m[1] || !m[2] || !m[3]) {
		throw new Error('Invalid SOQL WHERE clause');
	}
	if (!SOQL_FIELD.test(m[1]) || !SOQL_OP.test(m[2])) {
		throw new Error('Invalid SOQL WHERE clause');
	}
	const rawValue = m[3].trim();
	if (m[2].toUpperCase() === 'IN') {
		const list = rawValue.match(/^\((.*)\)$/);
		if (!list) throw new Error('Invalid SOQL WHERE clause');
		const items = splitSoqlList(list[1] ?? '');
		if (items.length === 0 || items.some((item) => !isSoqlLiteral(item))) {
			throw new Error('Invalid SOQL WHERE clause');
		}
		return;
	}
	if (!isSoqlLiteral(rawValue)) {
		throw new Error('Invalid SOQL WHERE clause');
	}
}

/**
 * Validates a caller-supplied SOQL WHERE fragment. Only allowlisted
 * field/operator/literal clauses joined by AND/OR are accepted.
 */
export function soqlWhere(fragment: string | undefined): string | undefined {
	if (!fragment) return undefined;
	const trimmed = fragment.trim();
	if (!trimmed) return undefined;
	const clauses = splitSoqlLogic(trimmed);
	if (clauses.some((clause) => !clause)) {
		throw new Error('Invalid SOQL WHERE clause');
	}
	for (const clause of clauses) {
		assertSoqlClause(clause);
	}
	return trimmed;
}
