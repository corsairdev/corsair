import type { GongCredentials, GongOpaqueRecord } from '../client';

export type GongFamilyContext = {
	key: string;
	options: {
		baseUrl?: string;
		authType?: 'api_key' | 'oauth_2';
		accessKey?: string;
		accessKeySecret?: string;
	};
	$getAccountId: () => Promise<string>;
};

export function gongCredentials(ctx: GongFamilyContext): GongCredentials {
	if (ctx.options.authType === 'oauth_2')
		return { type: 'bearer', accessToken: ctx.key };
	if (!ctx.options.accessKeySecret)
		throw new Error('Gong Basic authentication requires an API key secret');
	return {
		type: 'basic',
		accessKey: ctx.options.accessKey || ctx.key,
		accessKeySecret: ctx.options.accessKeySecret,
	};
}

// Request fields that describe the request without naming a person.
const SAFE_EVENT_FIELDS = new Set([
	'aggregationPeriod',
	'crmEntityType',
	'eventType',
	'from',
	'fromDate',
	'fromDateTime',
	'logType',
	'objectType',
	'status',
	'timePeriod',
	'to',
	'toDate',
	'toDateTime',
	'validateOnly',
]);

function isIdField(key: string): boolean {
	return key === 'id' || key.endsWith('Id') || key.endsWith('-id');
}

/**
 * Builds the event payload for a Gong request: identifiers, a few request
 * descriptors and list sizes. Gong inputs carry names, email addresses, phone
 * numbers, prospects, call parties and free text, and none of that belongs in
 * the event log.
 */
export function gongEventPayload(
	input: GongOpaqueRecord,
	depth = 0,
): GongOpaqueRecord {
	// Built field by field from the allowlist above, so the value types stay mixed.
	const payload: GongOpaqueRecord = {};
	for (const [key, value] of Object.entries(input)) {
		if (value === undefined || value === null) continue;
		if (Array.isArray(value)) {
			payload[`${key}Count`] = value.length;
			continue;
		}
		if (typeof value === 'object') {
			if (depth > 0 || Object.getPrototypeOf(value) !== Object.prototype)
				continue;
			// A plain nested object such as `filter`; summarised one level deep.
			const nested = gongEventPayload(value as GongOpaqueRecord, depth + 1);
			if (Object.keys(nested).length > 0) payload[key] = nested;
			continue;
		}
		if (isIdField(key) || SAFE_EVENT_FIELDS.has(key)) payload[key] = value;
	}
	return payload;
}
