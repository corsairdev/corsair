import {
	crawl4aiEndpointMeta,
	crawl4aiEndpointSchemas,
} from './endpoints/catalog';
import {
	Crawl4aiManifestSchema,
	crawl4aiManifest,
	crawl4aiOperations,
} from './endpoints/manifest';
import {
	crawl4aiInputFields,
	getCrawl4aiInputSchema,
	getCrawl4aiOutputSchema,
	getCrawl4aiWebhookPayloadSchema,
} from './endpoints/openapi-schema';
import { CRAWL4AI_OPERATION_IDS } from './endpoints/operation-types';

const ids = crawl4aiOperations.map((operation) => operation.id);
const risk = (id: string) =>
	crawl4aiEndpointMeta[id as keyof typeof crawl4aiEndpointMeta].riskLevel;

describe('crawl4ai-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			Crawl4aiManifestSchema.safeParse(crawl4aiManifest).error?.issues ?? [],
		).toEqual([]);
	});

	it('has 66 operations: 32 server routes and 34 Cloud ones', () => {
		expect(ids).toHaveLength(66);
		expect(new Set(ids).size).toBe(66);
		expect([...CRAWL4AI_OPERATION_IDS].sort()).toEqual([...ids].sort());
		const hosts = crawl4aiOperations.map((o) => o.host);
		expect(hosts.filter((h) => h === 'server')).toHaveLength(32);
		expect(hosts.filter((h) => h === 'cloud')).toHaveLength(34);
		for (const o of crawl4aiOperations) {
			expect(o.id.startsWith(`${o.host}.`)).toBe(true);
		}
	});
});

describe('schemas', () => {
	it('builds every input, output and webhook schema', () => {
		const failed: string[] = [];
		for (const id of ids) {
			try {
				getCrawl4aiInputSchema(id);
				getCrawl4aiOutputSchema(id);
			} catch {
				failed.push(id);
			}
		}
		getCrawl4aiWebhookPayloadSchema('jobFinished');
		expect(failed).toEqual([]);
		expect(Object.keys(crawl4aiEndpointMeta).sort()).toEqual([...ids].sort());
		expect(Object.keys(crawl4aiEndpointSchemas).sort()).toEqual(
			[...ids].sort(),
		);
	});

	it('checks inputs and keeps outputs lenient', () => {
		const scrape = getCrawl4aiInputSchema('cloud.scrape');
		expect(scrape.safeParse({}).success).toBe(false);
		expect(
			scrape.safeParse({ url: 'https://example.com', format: 'md' }).success,
		).toBe(true);
		expect(
			scrape.safeParse({ url: 'https://example.com', format: 'pdf' }).success,
		).toBe(false);
		expect(
			getCrawl4aiInputSchema('server.crawl').safeParse({
				urls: ['https://a.b'],
			}).success,
		).toBe(true);
		const reply = getCrawl4aiOutputSchema('cloud.scrape');
		expect(
			reply.safeParse({ tool: 'scrape', data: { markdown: '# Hi' }, extra: 1 })
				.success,
		).toBe(true);
		expect(reply.safeParse({ rows: 'no' }).success).toBe(false);
	});

	it('routes headers and tool inputs', () => {
		const where = (id: string) =>
			Object.fromEntries(
				crawl4aiInputFields(id).map((f) => [f.name, `${f.in}:${f.wire}`]),
			);
		expect(where('cloud.scrape')).toMatchObject({
			url: 'body:url',
			fresh: 'header:Crawl4AI-Fresh',
		});
		expect(where('cloud.tools.run')).toMatchObject({
			id: 'path:id',
			input: 'body-object:input',
		});
		expect(where('cloud.batch')).toMatchObject({
			idempotency_key: 'header:Idempotency-Key',
		});
	});
});

describe('risk levels', () => {
	it('keeps metered runs read and marks spending and deletes destructive', () => {
		for (const id of [
			'cloud.scrape',
			'cloud.search',
			'cloud.tools.run',
			'server.crawl',
			'server.markdown',
		]) {
			expect(risk(id)).toBe('read');
		}
		for (const id of [
			'cloud.billing.topup',
			'cloud.billing.subscribe',
			'cloud.jobs.cancel',
			'cloud.monitors.delete',
			'server.monitor.killBrowser',
		]) {
			expect(risk(id)).toBe('destructive');
		}
		expect(risk('cloud.watch')).toBe('write');
		expect(risk('server.executeJs')).toBe('write');
	});
});
