import { AuthMissingError } from 'corsair/core';
import type { SatisMeterKeyBuilderContext } from './index';
import { satisMeterEndpointSchemas, satismeter } from './index';

const OPERATIONS = [
	'projects.get',
	'responses.list',
	'responses.listForSurvey',
	'surveys.get',
	'surveys.list',
	'surveys.statistics',
	'users.list',
	'users.remove',
	'users.track',
	'users.upsert',
] as const;

type EndpointMeta = {
	riskLevel: string;
	description: string;
	irreversible?: boolean;
};
type KeyBuilder = (
	ctx: SatisMeterKeyBuilderContext,
	source: 'endpoint' | 'webhook',
) => Promise<string>;

function flatten(endpoints: object): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(endpoints)) {
		for (const name of Object.keys(members)) {
			paths.push(`${group}.${name}`);
		}
	}
	return paths.sort();
}

/**
 * Reads the builder off an instance. Each instance types its keyBuilder context
 * from its own options, and `satismeter({ key: 'x' })` narrows that context to
 * `never`, so the instances cannot share one parameter type; the cast restates
 * it as the builder every instance really is.
 */
function keyBuilderOf(plugin: object): KeyBuilder {
	return (plugin as { keyBuilder?: KeyBuilder }).keyBuilder as KeyBuilder;
}

describe('satismeter plugin', () => {
	const plugin = satismeter();
	const meta = plugin.endpointMeta as Record<string, EndpointMeta>;

	it('registers every operation', () => {
		expect(flatten(plugin.endpoints ?? {})).toEqual([...OPERATIONS]);
	});

	it('advertises api_key as its only auth type', () => {
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('has no webhooks, because SatisMeter sends none', () => {
		expect(plugin.webhooks).toEqual({});
		// A plugin that handles no webhooks must not claim one it cannot verify.
		expect(plugin.pluginWebhookMatcher?.({ headers: {} } as never)).toBe(false);
	});

	it('registers an input and output schema for every operation', () => {
		expect(Object.keys(satisMeterEndpointSchemas).sort()).toEqual([
			...OPERATIONS,
		]);
		for (const operation of OPERATIONS) {
			const entry = satisMeterEndpointSchemas[operation];
			expect({ operation, hasInput: entry.input !== undefined }).toEqual({
				operation,
				hasInput: true,
			});
			expect({ operation, hasOutput: entry.output !== undefined }).toEqual({
				operation,
				hasOutput: true,
			});
		}
	});

	it('classifies the six reads as reads', () => {
		const reads = OPERATIONS.filter(
			(operation) => meta[operation]?.riskLevel === 'read',
		);
		expect(reads).toEqual([
			'projects.get',
			'responses.list',
			'responses.listForSurvey',
			'surveys.get',
			'surveys.list',
			'surveys.statistics',
			'users.list',
		]);
	});

	it('classifies the two user writes as writes', () => {
		expect(meta['users.upsert']?.riskLevel).toBe('write');
		expect(meta['users.track']?.riskLevel).toBe('write');
		expect(meta['users.upsert']?.irreversible).toBeUndefined();
	});

	it('marks the delete destructive and irreversible', () => {
		// The provider keeps no way back: responses survive but are no longer
		// tied to a person.
		expect(meta['users.remove']?.riskLevel).toBe('destructive');
		expect(meta['users.remove']?.irreversible).toBe(true);
	});

	it('describes every operation without generator placeholder text', () => {
		for (const operation of OPERATIONS) {
			const description = meta[operation]?.description ?? '';
			expect({ operation, long: description.length > 20 }).toEqual({
				operation,
				long: true,
			});
			expect(description).not.toMatch(/example resource/i);
		}
	});
});

describe('keyBuilder', () => {
	function contextWith(storedKey: string | undefined): {
		ctx: SatisMeterKeyBuilderContext;
		get_api_key: jest.Mock;
	} {
		const get_api_key = jest.fn().mockResolvedValue(storedKey);
		// unknown: a fixture cannot be a full AccountKeyManager (it would need
		// get_dek, issue_new_dek and the rest), so this implements the one
		// accessor the builder reads and casts the rest.
		return {
			ctx: {
				authType: 'api_key',
				keys: { get_api_key },
			} as unknown as SatisMeterKeyBuilderContext,
			get_api_key,
		};
	}

	it('prefers an inline key', async () => {
		const { ctx, get_api_key } = contextWith('stored-key');
		await expect(
			keyBuilderOf(satismeter({ key: 'inline-key' }))(ctx, 'endpoint'),
		).resolves.toBe('inline-key');
		expect(get_api_key).not.toHaveBeenCalled();
	});

	it('falls back to the stored key', async () => {
		const { ctx, get_api_key } = contextWith('stored-key');
		await expect(keyBuilderOf(satismeter())(ctx, 'endpoint')).resolves.toBe(
			'stored-key',
		);
		expect(get_api_key).toHaveBeenCalledTimes(1);
	});

	it('throws AuthMissingError when neither key exists', async () => {
		const { ctx } = contextWith(undefined);
		// Failing open would send an empty bearer token and surface SatisMeter's
		// own 404 or 403 instead of Corsair's disconnected-auth flow.
		await expect(
			keyBuilderOf(satismeter())(ctx, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws for a webhook source, which this plugin does not serve', async () => {
		const { ctx } = contextWith('stored-key');
		await expect(
			keyBuilderOf(satismeter())(ctx, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
