/**
 * Live demo for Corsair OSS R4 (Loom / screen recording).
 *
 * Auth: OAuth 2.0 access token (NOT a simple API key).
 *
 * Required env:
 *   GOOGLE_ACCESS_TOKEN              — short-lived Bearer token with BigQuery scope
 *   GOOGLE_BIGQUERY_TEST_PROJECT_ID  — GCP project id that has BigQuery enabled
 *
 * Optional (for refresh / full integration tests only):
 *   GOOGLE_CLIENT_ID
 *   GOOGLE_CLIENT_SECRET
 *   GOOGLE_REFRESH_TOKEN
 *
 * Usage (PowerShell, from monorepo root):
 *   $env:GOOGLE_ACCESS_TOKEN = "ya29...."
 *   $env:GOOGLE_BIGQUERY_TEST_PROJECT_ID = "my-gcp-project"
 *   node packages/googlebigquery/scripts/demo.mjs
 *
 * Package script:
 *   pnpm --filter @corsair-dev/googlebigquery demo
 *
 * What it proves on camera:
 *   1. List datasets (GET .../datasets)
 *   2. Dry-run query jobs.query (POST .../queries with dryRun=true)
 *   3. List jobs (GET .../jobs) — best effort
 *
 * Never paste tokens into Loom titles or GitHub. Blur the terminal if needed.
 */

const TOKEN = process.env.GOOGLE_ACCESS_TOKEN;
const PROJECT = process.env.GOOGLE_BIGQUERY_TEST_PROJECT_ID;
const BASE = 'https://bigquery.googleapis.com/bigquery/v2';

if (!TOKEN || !PROJECT) {
	console.error(`
❌  Missing credentials for live BigQuery demo.

This plugin uses OAuth 2.0 (not a single static API key).

Required:
  GOOGLE_ACCESS_TOKEN              — OAuth access token with scope
                                     https://www.googleapis.com/auth/bigquery
  GOOGLE_BIGQUERY_TEST_PROJECT_ID  — GCP project id with BigQuery API enabled

How to get a short-lived access token (for Loom only):

  1) Install Google Cloud CLI: https://cloud.google.com/sdk/docs/install
  2) Login and set project:
       gcloud auth login
       gcloud config set project YOUR_PROJECT_ID
  3) Print an access token:
       gcloud auth print-access-token
  4) Enable BigQuery API on the project:
       https://console.cloud.google.com/apis/library/bigquery.googleapis.com

Then re-run (PowerShell):
  $env:GOOGLE_ACCESS_TOKEN = "ya29...."   # from gcloud
  $env:GOOGLE_BIGQUERY_TEST_PROJECT_ID = "YOUR_PROJECT_ID"
  node packages/googlebigquery/scripts/demo.mjs

Offline tests (no credentials needed):
  pnpm --filter @corsair-dev/googlebigquery test
`);
	process.exit(1);
}

async function request(path, { method = 'GET', body } = {}) {
	const url = path.startsWith('http') ? path : `${BASE}${path}`;
	const res = await fetch(url, {
		method,
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: body ? JSON.stringify(body) : undefined,
	});
	const text = await res.text();
	let json;
	try {
		json = JSON.parse(text);
	} catch {
		json = { raw: text };
	}
	if (!res.ok) {
		throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 500)}`);
	}
	return json;
}

function section(title) {
	console.log(`\n${'═'.repeat(60)}`);
	console.log(`  ${title}`);
	console.log('═'.repeat(60));
}

async function main() {
	console.log('Corsair × Google BigQuery plugin — live API demo');
	console.log('PR: https://github.com/corsairdev/corsair/pull/364');
	console.log('Package: @corsair-dev/googlebigquery');
	console.log(`Project: ${PROJECT}`);
	console.log('Ops: datasets.list · queries.query (dryRun) · jobs.list');

	section('1/3  datasets.list  (GOOGLEBIGQUERY_DATASETS_LIST)');
	const datasets = await request(`/projects/${PROJECT}/datasets?maxResults=10`);
	const ids = (datasets.datasets ?? []).map(
		(d) => d.datasetReference?.datasetId ?? d.id,
	);
	console.log('datasets:', ids.join(', ') || '(none yet)');
	console.log('count:', ids.length);

	section('2/3  queries.query  dryRun  (GOOGLEBIGQUERY_QUERIES_QUERY)');
	const dry = await request(`/projects/${PROJECT}/queries`, {
		method: 'POST',
		body: {
			query: 'SELECT 1 AS value',
			useLegacySql: false,
			dryRun: true,
		},
	});
	console.log('jobComplete:', dry.jobComplete);
	console.log(
		'totalBytesProcessed:',
		dry.totalBytesProcessed ?? dry.statistics?.query?.totalBytesProcessed,
	);
	console.log(
		'schema fields:',
		dry.schema?.fields?.map((f) => f.name).join(', '),
	);

	section('3/3  jobs.list  (GOOGLEBIGQUERY_QUERIES_LIST_JOBS) — best effort');
	try {
		const jobs = await request(
			`/projects/${PROJECT}/jobs?maxResults=5&projection=minimal`,
		);
		const jobIds = (jobs.jobs ?? []).map((j) => j.jobReference?.jobId ?? j.id);
		console.log('recent jobs:', jobIds.join(', ') || '(none)');
		console.log('count:', jobIds.length);
	} catch (err) {
		console.log('jobs.list failed (non-fatal):', err.message);
	}

	section('✅  BigQuery live demo finished');
	console.log(
		'Next: record this run in Loom, then paste https://www.loom.com/share/... into PR #364 under ## Screenshots / Demos',
	);
	console.log('Access tokens expire quickly — do not commit them.');
}

main().catch((err) => {
	console.error('\n❌  Demo failed:', err.message || err);
	process.exit(1);
});
