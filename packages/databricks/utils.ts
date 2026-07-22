/**
 * Encodes URI component safely for URL paths.
 */
export function safeEncode(value: string): string {
	return encodeURIComponent(value);
}

/**
 * Parses CSV text responses into an array of record objects.
 */
export function parseCsvRecords(
	response: unknown,
): Array<Record<string, unknown>> {
	if (Array.isArray(response)) {
		return response as Array<Record<string, unknown>>;
	}

	if (typeof response === 'string' && response.trim().length > 0) {
		const lines = response.trim().split(/\r?\n/);
		if (lines.length <= 1) return [];

		const firstLine = lines[0];
		if (!firstLine) return [];

		const headers = parseCsvLine(firstLine);
		const records: Array<Record<string, unknown>> = [];

		for (let i = 1; i < lines.length; i++) {
			const rawLine = lines[i];
			if (!rawLine) continue;
			const line = rawLine.trim();
			if (!line) continue;
			const values = parseCsvLine(line);
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

function parseCsvLine(line: string): string[] {
	const result: string[] = [];
	let current = '';
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const char = line[i];
		if (char === '"') {
			if (inQuotes && line[i + 1] === '"') {
				current += '"';
				i++;
			} else {
				inQuotes = !inQuotes;
			}
		} else if (char === ',' && !inQuotes) {
			result.push(current.trim());
			current = '';
		} else {
			current += char;
		}
	}
	result.push(current.trim());
	return result;
}
