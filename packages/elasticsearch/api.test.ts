import {
	buildAuthorizationHeader,
	ElasticsearchAPIError,
	makeElasticsearchRequest,
} from './client';
import { ElasticsearchEndpointOutputSchemas } from './endpoints/types';

// Live API tests — skipped unless ELASTICSEARCH_API_KEY (the encoded value
// or an id:api_key pair) and ELASTICSEARCH_URL (the cluster endpoint, e.g.
// https://es.internal.example:9200) are set. They hit the caller's real
// cluster, run read-only calls, and prove the output schemas accept the
// shapes Elasticsearch actually returns.
const ELASTICSEARCH_API_KEY = process.env.ELASTICSEARCH_API_KEY ?? '';
const ELASTICSEARCH_URL = (process.env.ELASTICSEARCH_URL ?? '').replace(
	/\/+$/,
	'',
);

const describeIfLive =
	ELASTICSEARCH_API_KEY && ELASTICSEARCH_URL ? describe : describe.skip;

jest.setTimeout(180_000);

describeIfLive('Elasticsearch live API tests', () => {
	const authorization = buildAuthorizationHeader(ELASTICSEARCH_API_KEY);

	it('cluster health returns the documented shape', async () => {
		const raw = await makeElasticsearchRequest(
			ELASTICSEARCH_URL,
			authorization,
			{
				path: '/_cluster/health',
			},
		);

		const parsed =
			ElasticsearchEndpointOutputSchemas.clusterGetHealth.parse(raw);
		expect(['green', 'yellow', 'red']).toContain(parsed.status);
		expect(typeof parsed.number_of_nodes).toBe('number');
	});

	it('cat indices returns an array of string-valued rows', async () => {
		const raw = await makeElasticsearchRequest(
			ELASTICSEARCH_URL,
			authorization,
			{
				path: '/_cat/indices',
				query: { format: 'json' },
			},
		);

		const parsed = ElasticsearchEndpointOutputSchemas.indicesList.parse(raw);
		expect(Array.isArray(parsed)).toBe(true);
	});

	it('documents.get for a missing id in a real index answers the documented 404 found: false', async () => {
		const raw = await makeElasticsearchRequest(
			ELASTICSEARCH_URL,
			authorization,
			{
				path: '/_cat/indices',
				query: { format: 'json' },
			},
		);
		const first = ElasticsearchEndpointOutputSchemas.indicesList.parse(raw)[0];
		// An empty cluster has no index to target; the 404 shape below cannot
		// be asserted meaningfully.
		if (!first) return;

		// unknown: a rejection can be any value until the instanceof check
		// narrows it.
		const error = await makeElasticsearchRequest(
			ELASTICSEARCH_URL,
			authorization,
			{
				path: `/${encodeURIComponent(first.index)}/_doc/corsair-live-smoke-missing-id`,
			},
		).catch((e: unknown) => e);

		if (!(error instanceof ElasticsearchAPIError)) {
			throw new Error('expected a missing document to answer 404');
		}
		expect(error.status).toBe(404);
		expect(
			ElasticsearchEndpointOutputSchemas.documentsGet.parse(error.body),
		).toMatchObject({ found: false });
	});
});
