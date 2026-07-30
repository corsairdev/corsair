/**
 * Encodes URI component safely for URL paths.
 */
export function safeEncode(value: string): string {
	return encodeURIComponent(value);
}

type AzureServicePrincipalInput = {
	azure_service_principal?: {
		directory_id: string;
		application_id: string;
		client_secret: string;
	};
};

export function redactAzureServicePrincipal<
	T extends AzureServicePrincipalInput,
>(input: T): T {
	if (!input.azure_service_principal) {
		return input;
	}
	return {
		...input,
		azure_service_principal: {
			...input.azure_service_principal,
			client_secret: '[redacted]',
		},
	};
}

function splitCsvRecords(text: string): string[] {
	const records: string[] = [];
	let current = '';
	let inQuotes = false;

	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		if (char === '"') {
			if (inQuotes && text[i + 1] === '"') {
				current += '""';
				i++;
			} else {
				inQuotes = !inQuotes;
				current += char;
			}
		} else if ((char === '\n' || char === '\r') && !inQuotes) {
			if (char === '\r' && text[i + 1] === '\n') {
				i++;
			}
			if (current.trim()) {
				records.push(current);
			}
			current = '';
		} else {
			current += char;
		}
	}

	if (current.trim()) {
		records.push(current);
	}

	return records;
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
		const lines = splitCsvRecords(response.trim());
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
