import type { EndpointMetaEntry } from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	LISTCLEAN_BATCH_MAX,
	LISTCLEAN_LIST_STATUSES,
	LISTCLEAN_RESULT_TYPES,
	LISTCLEAN_SOURCES,
	LISTCLEAN_VERIFICATION_STATUSES,
} from './endpoints/types';
import type { ListcleanKeyBuilderContext } from './index';
import { listclean, listcleanEndpointSchemas } from './index';

type Meta = Record<string, EndpointMetaEntry | undefined>;
type KeyBuilder = (
	ctx: ListcleanKeyBuilderContext,
	source: 'endpoint' | 'webhook',
) => Promise<string>;

const plugin = listclean();

const meta = plugin.endpointMeta as Meta;

/** The nested endpoint tree flattened to its `group.op` paths. */
// unknown: the plugin's endpoint literal is read structurally here, so the
// map's values are unknown; only the keys matter.
function paths(tree: Record<string, Record<string, unknown>>): string[] {
	return Object.entries(tree).flatMap(([group, ops]) =>
		Object.keys(ops).map((op) => `${group}.${op}`),
	);
}

describe('Listclean plugin', () => {
	it('registers the nine operations across three groups', () => {
		expect(
			paths(plugin.endpoints as Record<string, Record<string, unknown>>).sort(),
		).toEqual(
			[
				'verify.verifyEmail',
				'verify.startBatchVerification',
				'verify.getVerificationLogs',
				'verify.getAnalytics',
				'lists.listLists',
				'lists.getList',
				'lists.getListResults',
				'lists.delete',
				'account.getCredits',
			].sort(),
		);
	});

	it('declares input and output schemas for every operation', () => {
		expect(Object.keys(listcleanEndpointSchemas).sort()).toEqual(
			paths(plugin.endpoints as Record<string, Record<string, unknown>>).sort(),
		);
		for (const entry of Object.values(listcleanEndpointSchemas)) {
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('defaults to api_key auth', () => {
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('receives no webhooks: the map is empty and the matcher refuses everything', () => {
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: { 'x-listclean-signature': 'x' },
			} as never),
		).toBe(false);
	});

	it('ranks every operation by its real side effect', () => {
		expect(meta['verify.verifyEmail']?.riskLevel).toBe('read');
		expect(meta['verify.getVerificationLogs']?.riskLevel).toBe('read');
		expect(meta['verify.getAnalytics']?.riskLevel).toBe('read');
		expect(meta['lists.listLists']?.riskLevel).toBe('read');
		expect(meta['lists.getList']?.riskLevel).toBe('read');
		expect(meta['lists.getListResults']?.riskLevel).toBe('read');
		expect(meta['account.getCredits']?.riskLevel).toBe('read');
		expect(meta['verify.startBatchVerification']?.riskLevel).toBe('write');
		expect(meta['lists.delete']?.riskLevel).toBe('destructive');
		expect(meta['lists.delete']?.irreversible).toBe(true);
	});

	it('says the billed read is billed, and pins the batch job on the submit', () => {
		expect(meta['verify.verifyEmail']?.description).toContain('credit');
		expect(meta['verify.startBatchVerification']?.job).toEqual({
			idPath: 'list_id',
			status: {
				op: 'lists.getList',
				idArg: 'list_id',
				statusPath: 'list.status',
				done: ['COMPLETED'],
				failed: [],
			},
		});
		expect(meta['lists.getList']?.description).toContain('polled');
	});

	it('pins the documented vocabularies and the batch cap', () => {
		expect(LISTCLEAN_VERIFICATION_STATUSES).toEqual([
			'clean',
			'dirty',
			'unknown',
			'error',
		]);
		expect(LISTCLEAN_SOURCES).toEqual(['api', 'file_upload', 'single_email']);
		expect(LISTCLEAN_RESULT_TYPES).toEqual(['clean', 'dirty', 'unknown']);
		expect(LISTCLEAN_LIST_STATUSES).toEqual([
			'SUBMITTED',
			'INPROCESS',
			'COMPLETED',
		]);
		expect(LISTCLEAN_BATCH_MAX).toBe(3000);
	});

	describe('keyBuilder', () => {
		// A fixture cannot be typed as the full key-builder context: `keys` must
		// be a complete AccountKeyManager, and the keyBuilder only ever calls
		// `get_api_key`, so the fixture implements just that one method.
		const keyContext = (key?: string) =>
			({
				authType: 'api_key',
				keys: { get_api_key: async () => key },
			}) as unknown as ListcleanKeyBuilderContext;

		it('returns the explicitly configured key', async () => {
			const configured = listclean({ key: 'inline-key' });
			await expect(
				(configured.keyBuilder as unknown as KeyBuilder)(
					keyContext(),
					'endpoint',
				),
			).resolves.toBe('inline-key');
		});

		it('falls back to the stored key', async () => {
			await expect(
				(plugin.keyBuilder as unknown as KeyBuilder)(
					keyContext('stored-key'),
					'endpoint',
				),
			).resolves.toBe('stored-key');
		});

		it('refuses to run with no key anywhere', async () => {
			await expect(
				(plugin.keyBuilder as unknown as KeyBuilder)(keyContext(), 'endpoint'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});
	});
});
