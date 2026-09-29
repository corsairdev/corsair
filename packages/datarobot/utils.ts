export type DatarobotQueryValue = string | number | boolean | undefined;

// ponytail: DataRobot OpenAPI often names path params differently from the URL template
const PATH_ALIASES: Record<string, readonly string[]> = {
	authorizedProviderId: ['authorizationID', 'authorizationId'],
	authorizationID: ['authorizedProviderId'],
	jobId: ['jobID'],
	jobID: ['jobId'],
	providerID: ['providerId'],
	providerId: ['providerID'],
};

function lookupPathValue(
	record: Record<string, unknown>,
	name: string,
): unknown {
	const direct = record[name];
	if (direct !== undefined && direct !== null && direct !== '') {
		return direct;
	}
	const lower = name.toLowerCase();
	for (const [key, value] of Object.entries(record)) {
		if (
			key.toLowerCase() === lower &&
			value !== undefined &&
			value !== null &&
			value !== ''
		) {
			return value;
		}
	}
	for (const alias of PATH_ALIASES[name] ?? []) {
		const value = record[alias];
		if (value !== undefined && value !== null && value !== '') {
			return value;
		}
	}
	return undefined;
}

function isPathKey(key: string, pathKeys: readonly string[]): boolean {
	if (pathKeys.includes(key)) {
		return true;
	}
	const lower = key.toLowerCase();
	if (pathKeys.some((pathKey) => pathKey.toLowerCase() === lower)) {
		return true;
	}
	for (const pathKey of pathKeys) {
		if (
			(PATH_ALIASES[pathKey] ?? []).includes(key) ||
			(PATH_ALIASES[key] ?? []).includes(pathKey)
		) {
			return true;
		}
	}
	return false;
}

export function buildDatarobotPath(template: string, input: unknown): string {
	const record =
		input !== null && typeof input === 'object'
			? (input as Record<string, unknown>)
			: {};
	return template.replace(/\{([^}]+)\}/g, (_, name: string) => {
		const value = lookupPathValue(record, name);
		if (value === undefined || value === null || value === '') {
			throw new Error(`Missing path parameter ${name}`);
		}
		return encodeURIComponent(String(value));
	});
}

export function splitDatarobotInput(
	input: unknown,
	pathKeys: readonly string[],
	queryKeys: readonly string[],
): {
	query: Record<string, DatarobotQueryValue> | undefined;
	body: Record<string, unknown> | undefined;
} {
	const record =
		input !== null && typeof input === 'object'
			? (input as Record<string, unknown>)
			: {};
	const querySet = new Set(queryKeys);
	const query: Record<string, DatarobotQueryValue> = {};
	const body: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(record)) {
		if (value === undefined || isPathKey(key, pathKeys)) {
			continue;
		}
		if (querySet.has(key)) {
			if (
				typeof value === 'string' ||
				typeof value === 'number' ||
				typeof value === 'boolean'
			) {
				query[key] = value;
			} else {
				query[key] = String(value);
			}
			continue;
		}
		body[key] = value;
	}

	return {
		query: Object.keys(query).length > 0 ? query : undefined,
		body: Object.keys(body).length > 0 ? body : undefined,
	};
}
