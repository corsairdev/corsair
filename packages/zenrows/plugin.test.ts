import type { EndpointJob } from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { ZenRowsEndpointOutputSchemas } from './endpoints/types';
import { zenRowsEndpointSchemas, zenrows } from './index';

// The key builder only reads authType and keys.
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof zenrows>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.subscription',
	'crawl.get',
	'crawl.getContent',
	'crawl.list',
	'crawl.start',
	'crawl.stop',
	'extract.allowance',
	'extract.domains',
	'extract.getDomainStatus',
	'extract.listPreparedDomains',
	'extract.prepareDomain',
	'fetch.browse',
	'fetch.cssExtract',
	'fetch.extract',
	'fetch.jsonResponse',
	'fetch.outputs',
	'fetch.page',
	'fetch.post',
	'fetch.put',
];

describe('zenrows plugin definition', () => {
	const plugin = zenrows();

	it('registers as zenrows with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('zenrows');
		expect(plugin.options?.authType).toBe('api_key');
		// A crawl's webhook is set per crawl at start, so there is no
		// account-level delivery to route here.
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the nineteen catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('gives every endpoint a description and the right risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(30);
		}
		const reads = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'read')
			.map(([name]) => name)
			.sort();
		expect(reads).toEqual([
			'account.subscription',
			'crawl.get',
			'crawl.getContent',
			'crawl.list',
			'extract.allowance',
			'extract.domains',
			'extract.getDomainStatus',
			'extract.listPreparedDomains',
			'fetch.cssExtract',
			'fetch.extract',
			'fetch.jsonResponse',
			'fetch.outputs',
			'fetch.page',
		]);
		const writes = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'write')
			.map(([name]) => name)
			.sort();
		expect(writes).toEqual([
			'crawl.start',
			'crawl.stop',
			'extract.prepareDomain',
			// Browser actions reach the site, and a forwarded POST or PUT
			// reaches it with the caller's body.
			'fetch.browse',
			'fetch.post',
			'fetch.put',
		]);
		// Nothing here deletes: a crawl stop keeps the pages already fetched.
		expect(
			Object.values(meta).filter((entry) => entry.riskLevel === 'destructive'),
		).toEqual([]);
	});

	it('declares a schema pair for every endpoint', () => {
		expect(Object.keys(zenRowsEndpointSchemas).sort()).toEqual(operations);
		for (const [name, pair] of Object.entries(zenRowsEndpointSchemas)) {
			expect(pair.input).toBeDefined();
			expect(pair.output).toBeDefined();
			expect(name).toMatch(/^(fetch|crawl|extract|account)\./);
		}
	});
});

describe('zenrows key builder', () => {
	it('prefers the inline key over the stored one', async () => {
		const plugin = zenrows({ key: 'inline-key' });
		const ctx = keyContext('stored-key');
		expect(await buildKey(plugin, ctx)).toBe('inline-key');
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('falls back to the stored key', async () => {
		const plugin = zenrows();
		expect(await buildKey(plugin, keyContext('stored-key'))).toBe('stored-key');
	});

	it('throws AuthMissingError when neither exists', async () => {
		const plugin = zenrows();
		await expect(buildKey(plugin, keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});

describe('zenrows crawl job', () => {
	const meta = pluginMeta();
	const jobs = Object.entries(meta).filter(
		(entry): entry is [string, { job: EndpointJob }] => Boolean(entry[1]?.job),
	);

	function pluginMeta() {
		return zenrows().endpointMeta as Record<
			string,
			{ job?: EndpointJob } | undefined
		>;
	}

	it('declares a job on crawl.start only', () => {
		expect(jobs.map(([op]) => op)).toEqual(['crawl.start']);
	});

	it('reads the crawl back through an operation this plugin has', () => {
		const [, entry] = jobs[0]!;
		expect(meta[entry.job.status.op]).toBeDefined();
		const cancelOp = entry.job.cancel?.op;
		expect(cancelOp === undefined ? undefined : meta[cancelOp]).toBeDefined();
		// A zod object's `shape` is not public on the base type, so the schema
		// is narrowed to the one member this test reads.
		// unknown: `shape` is not on the base zod type, so the schema is narrowed
		// to the single member this assertion reads.
		const shape = (
			ZenRowsEndpointOutputSchemas.crawlStart as unknown as {
				shape: Record<string, unknown>;
			}
		).shape;
		expect(shape[entry.job.idPath]).toBeDefined();
	});

	it('takes the crawl id as the status read argument', () => {
		const [, entry] = jobs[0]!;
		const input =
			zenRowsEndpointSchemas[
				entry.job.status.op as keyof typeof zenRowsEndpointSchemas
			].input;
		expect(
			input.safeParse({ [entry.job.status.idArg]: 'c_01M72F' }).success,
		).toBe(true);
	});

	it('sorts every crawl status into done, failed or running', () => {
		const [, entry] = jobs[0]!;
		// The output's `status` is a plain string, so a status Zenrows adds
		// later cannot fail a read. That means nothing can enumerate the values
		// here, so the job's sorted lists are pinned instead.
		const sorted = [...entry.job.status.done, ...entry.job.status.failed];
		expect(sorted.sort()).toEqual(['completed', 'failed', 'stopped']);
		// `stopped` is a failure, not a success: a crawl stops when the account
		// runs out of credits.
		expect(entry.job.status.done).toEqual(['completed']);
		expect(entry.job.status.failed).toContain('stopped');
	});
});
