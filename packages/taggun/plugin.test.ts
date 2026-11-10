import { AuthMissingError } from 'corsair/core';
import type { TaggunKeyBuilderContext } from './index';
import { TaggunAPIError, taggun, taggunEndpointSchemas } from './index';

const OPERATIONS = [
	'simple.url',
	'simple.encoded',
	'simple.file',
	'verbose.url',
	'verbose.encoded',
	'verbose.file',
	'campaigns.list',
	'campaigns.get',
	'campaigns.create',
	'campaigns.update',
	'campaigns.delete',
	'campaigns.validateFile',
	'campaigns.validateUrl',
	'receiptValidation.file',
	'receiptValidation.url',
] as const;

type EndpointMeta = {
	riskLevel: string;
	irreversible?: boolean;
	description: string;
};
type ErrorHandler = {
	match: (error: Error, context: MatcherContext) => boolean;
	handler: (error: Error) => Promise<{ maxRetries?: number }>;
};
type MatcherContext = {
	pluginId: string;
	operation: string;
	input: Record<string, string | number | boolean | undefined>;
	originalError: Error;
};
/**
 * The plugin's key builder as the tests call it: the two arguments it receives
 * and the string it resolves to. Both plugins the tests build fit this view.
 */
type KeyBuilder = (
	ctx: TaggunKeyBuilderContext,
	source: 'endpoint' | 'webhook',
) => Promise<string> | string;

/**
 * The plugin's key builder, read off the object under test. Its declared
 * signature is the full CorsairKeyBuilder; this view is the part the tests call.
 */
/**
 * The key builder off the plugin under test. Its declared type is generic over
 * the plugin's options, which this suite does not name, so it is viewed as the
 * call signature the two arguments and the string result already match.
 */
const keyBuilderOf = (candidate: {
	keyBuilder?: unknown; // unknown: generic over options the test does not name
}): KeyBuilder => {
	const builder = candidate.keyBuilder as KeyBuilder | undefined;
	if (!builder) {
		throw new Error('the plugin registered no keyBuilder');
	}
	return builder;
};

/** The operation paths as `<group>.<name>`, from the plugin's nested tree. */
function flatten(endpoints: object | undefined): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(
		(endpoints ?? {}) as Record<string, object>,
	)) {
		for (const name of Object.keys(members)) {
			paths.push(`${group}.${name}`);
		}
	}
	return paths.sort();
}

describe('taggun plugin', () => {
	const plugin = taggun();
	const meta = plugin.endpointMeta as Record<string, EndpointMeta>;
	const handlers = plugin.errorHandlers as Record<string, ErrorHandler>;
	it('registers the id Taggun is known by', () => {
		expect(plugin.id).toBe('taggun');
	});

	it('uses a single api_key auth type', () => {
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('registers every advertised operation', () => {
		expect(flatten(plugin.endpoints)).toEqual([...OPERATIONS].sort());
	});

	it('declares metadata for every operation, and none for others', () => {
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS].sort());
	});

	it('declares a schema pair for every operation', () => {
		expect(Object.keys(taggunEndpointSchemas).sort()).toEqual(
			[...OPERATIONS].sort(),
		);
	});

	it('declares webhooks as an empty map, since Taggun sends none', () => {
		// Taggun is synchronous by design: no callbacks, no polling.
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({} as never)).toBe(false);
	});

	it('marks every destructive operation irreversible', () => {
		for (const [operation, entry] of Object.entries(meta)) {
			if (entry.riskLevel === 'destructive') {
				expect({ operation, irreversible: entry.irreversible }).toEqual({
					operation,
					irreversible: true,
				});
			}
		}
	});

	it('counts a delete as destructive, never a read', () => {
		expect(meta['campaigns.delete']?.riskLevel).toBe('destructive');
	});

	it('treats every scan as a write, because it stores and bills', () => {
		for (const operation of [
			'simple.url',
			'simple.encoded',
			'simple.file',
			'verbose.url',
			'verbose.encoded',
			'verbose.file',
			'campaigns.validateFile',
			'campaigns.validateUrl',
			'receiptValidation.file',
			'receiptValidation.url',
		]) {
			expect({ operation, risk: meta[operation]?.riskLevel }).toEqual({
				operation,
				risk: 'write',
			});
		}
	});

	it('keeps only the two campaign readers as reads', () => {
		const reads = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'read')
			.map(([operation]) => operation)
			.sort();

		expect(reads).toEqual(['campaigns.get', 'campaigns.list']);
	});

	it('describes every operation', () => {
		for (const entry of Object.values(meta)) {
			expect(entry.description.length).toBeGreaterThan(20);
		}
	});

	it('puts DEFAULT last so no handler shadows it', () => {
		expect(Object.keys(handlers).at(-1)).toBe('DEFAULT');
	});

	it('routes a 429 to a retrying handler and a 403 to a non-retrying one', async () => {
		const rateLimit = new TaggunAPIError('Taggun 429: rate', {
			status: 429,
			method: 'POST',
		});
		const auth = new TaggunAPIError('Taggun 403: bad key', {
			status: 403,
			method: 'POST',
		});

		const matcherContext = (error: Error) => ({
			pluginId: 'taggun',
			operation: 'simple.url',
			input: {},
			originalError: error,
		});
		const rateLimitName = Object.keys(handlers).find((name) =>
			handlers[name]?.match(rateLimit, matcherContext(rateLimit)),
		);
		const authName = Object.keys(handlers).find((name) =>
			handlers[name]?.match(auth, matcherContext(auth)),
		);

		expect(rateLimitName).toBe('RATE_LIMIT_ERROR');
		expect(authName).toBe('AUTH_ERROR');
	});
});

describe('taggun keyBuilder', () => {
	// A fixture cannot be typed as the full AccountKeyManager, so it implements
	// only the accessor the key builder reads.
	// The fixture implements only the accessor the key builder reads, because a
	// full AccountKeyManager carries a dozen methods a test would never call, and
	// its constructor needs a database this suite does not have.
	function contextWith(key: string | null): TaggunKeyBuilderContext {
		return {
			authType: 'api_key',
			keys: { get_api_key: async () => key },
		} as TaggunKeyBuilderContext;
	}

	it('prefers the inline key over the stored one', async () => {
		const plugin = taggun({ key: 'inline-key' });

		await expect(
			keyBuilderOf(plugin)(contextWith('stored-key'), 'endpoint'),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored key', async () => {
		const plugin = taggun();

		await expect(
			keyBuilderOf(plugin)(contextWith('stored-key'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when neither key exists', async () => {
		const plugin = taggun();

		await expect(
			keyBuilderOf(plugin)(contextWith(null), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
