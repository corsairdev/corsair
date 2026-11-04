import type { z } from 'zod';
import {
	TinyFishEndpointInputSchemas,
	TinyFishEndpointOutputSchemas,
} from './endpoints/types';

const inputs = TinyFishEndpointInputSchemas;
const outputs = TinyFishEndpointOutputSchemas;

// ZodTypeAny is the schema base. Fixtures include values the schema must
// reject, so a stricter input than unknown is not practical.
type AnySchema = z.ZodTypeAny;

function accepts(
	schema: AnySchema,
	// Fixtures include values the schema must reject, so a stricter input is
	// not practical.
	value: unknown,
): boolean {
	return schema.safeParse(value).success;
}

const searchResult = {
	position: 1,
	site_name: 'example.com',
	snippet: 's',
	title: 't',
	url: 'https://example.com',
};

const runSummary = {
	run_id: 'run-1',
	status: 'COMPLETED',
	goal: 'Get the title',
	created_at: '2026-01-02T00:00:00.000Z',
	started_at: null,
	finished_at: null,
	num_of_steps: 1,
	result: null,
	output_schema: null,
	profile_attached: false,
	profile_id: null,
	error: null,
	streaming_url: null,
	browser_config: null,
};

const fullRun = {
	...runSummary,
	video_url: null,
	steps: [
		{
			id: 'step-1',
			timestamp: '2026-01-02T00:00:01.000Z',
			status: 'COMPLETED',
			action: 'click',
			screenshot: null,
			html: null,
			duration: '1.2s',
		},
	],
};

const researchRun = {
	research_run_id: 'rr-1',
	status: 'RUNNING',
	query: 'latest ai papers',
	quick_result: null,
	quick_result_summary: null,
	deep_result: null,
	run_ids: [],
	created_at: null,
	completed_at: null,
	error: null,
};

const profileRow = {
	id: 'p-1',
	name: 'Work',
	created_at: '2026-01-02T00:00:00.000Z',
};

describe('search.search input', () => {
	it('accepts the documented filters', () => {
		expect(
			accepts(inputs.search, {
				query: 'latest ai papers',
				purpose: 'prep a case study',
				location: 'US',
				language: 'en',
				include_domains: 'arxiv.org,openai.com',
				exclude_domains: 'reddit.com',
				domain_type: 'research_paper',
				after_date: '2026-01-01',
				before_date: '2026-06-01',
				recency_minutes: 1440,
				pub_year_min: 2020,
				pub_year_max: 2026,
				page: 2,
				include_thumbnail: 'true',
				fetch: '{}',
			}),
		).toBe(true);
	});

	it('requires a non-empty query capped at 2000 characters', () => {
		expect(accepts(inputs.search, {})).toBe(false);
		expect(accepts(inputs.search, { query: '' })).toBe(false);
		expect(accepts(inputs.search, { query: 'a'.repeat(2000) })).toBe(true);
		expect(accepts(inputs.search, { query: 'a'.repeat(2001) })).toBe(false);
	});

	it('wants the thumbnail flag as the documented string, not a boolean', () => {
		expect(
			accepts(inputs.search, { query: 'x', include_thumbnail: 'false' }),
		).toBe(true);
		expect(
			accepts(inputs.search, { query: 'x', include_thumbnail: true }),
		).toBe(false);
		expect(
			accepts(inputs.search, { query: 'x', include_thumbnail: 'yes' }),
		).toBe(false);
	});

	it('rejects unknown keys and out-of-range values', () => {
		expect(accepts(inputs.search, { query: 'x', oiseau: true })).toBe(false);
		expect(accepts(inputs.search, { query: 'x', domain_type: 'video' })).toBe(
			false,
		);
		expect(accepts(inputs.search, { query: 'x', page: 11 })).toBe(false);
		expect(accepts(inputs.search, { query: 'x', page: 10 })).toBe(true);
		expect(
			accepts(inputs.search, { query: 'x', recency_minutes: 5256001 }),
		).toBe(false);
		expect(accepts(inputs.search, { query: 'x', fetch: 'a'.repeat(257) })).toBe(
			false,
		);
	});
});

describe('search.usage input', () => {
	it('accepts the documented window', () => {
		expect(
			accepts(inputs.searchUsage, {
				start_after: '2026-01-01T00:00:00Z',
				end_before: '2026-02-01T00:00:00Z',
				status: 'completed',
				limit: 100,
				page: 2,
			}),
		).toBe(true);
	});

	it('rejects unknown statuses and out-of-range paging', () => {
		expect(accepts(inputs.searchUsage, { status: 'failed' })).toBe(true);
		expect(accepts(inputs.searchUsage, { status: 'errored' })).toBe(false);
		expect(accepts(inputs.searchUsage, { limit: 1001 })).toBe(false);
		expect(accepts(inputs.searchUsage, { page: 0 })).toBe(false);
	});
});

describe('fetch.fetch input', () => {
	it('accepts the documented extraction controls', () => {
		expect(
			accepts(inputs.fetch, {
				urls: ['https://example.com', 'https://example.org'],
				purpose: 'price monitoring',
				format: 'json',
				links: true,
				image_links: true,
				iframe_links: false,
				page_metadata: true,
				ttl: 3600,
				per_url_timeout_ms: 30000,
				if_none_match: 'W/"1"',
				if_modified_since: 'Wed, 01 Jan 2026 00:00:00 GMT',
				include_etag_and_last_modified: true,
				include_selectors: ['#main'],
				exclude_selectors: ['.ads'],
			}),
		).toBe(true);
	});

	it('accepts between 1 and 10 urls', () => {
		expect(accepts(inputs.fetch, { urls: [] })).toBe(false);
		expect(accepts(inputs.fetch, { urls: ['https://example.com'] })).toBe(true);
		expect(
			accepts(inputs.fetch, {
				urls: Array.from({ length: 10 }, (_, i) => `https://e.com/${i}`),
			}),
		).toBe(true);
		expect(
			accepts(inputs.fetch, {
				urls: Array.from({ length: 11 }, (_, i) => `https://e.com/${i}`),
			}),
		).toBe(false);
	});

	it('rejects unknown formats, selectors over 20 entries and unknown keys', () => {
		expect(accepts(inputs.fetch, { urls: ['https://x'], format: 'pdf' })).toBe(
			false,
		);
		expect(
			accepts(inputs.fetch, {
				urls: ['https://x'],
				include_selectors: Array.from({ length: 21 }, (_, i) => `#s${i}`),
			}),
		).toBe(false);
		expect(accepts(inputs.fetch, { urls: ['https://x'], depth: 2 })).toBe(
			false,
		);
	});
});

describe('fetch.usage input', () => {
	it('accepts the documented window', () => {
		expect(accepts(inputs.fetchUsage, { status: 'failed', limit: 5 })).toBe(
			true,
		);
		expect(accepts(inputs.fetchUsage, { status: 'errored' })).toBe(false);
	});
});

describe('browser inputs', () => {
	it('accepts a session request with proxy settings', () => {
		expect(
			accepts(inputs.createBrowserSession, {
				url: 'https://example.com',
				timeout_seconds: 600,
				proxy_config: {
					enabled: true,
					type: 'custom',
					country_code: 'DE',
					url: 'http://proxy.example.com:8080',
					username: 'u',
					password: 'p',
				},
			}),
		).toBe(true);
	});

	it('enforces the timeout window and nullable timeout', () => {
		expect(
			accepts(inputs.createBrowserSession, { timeout_seconds: null }),
		).toBe(true);
		expect(accepts(inputs.createBrowserSession, { timeout_seconds: 4 })).toBe(
			false,
		);
		expect(
			accepts(inputs.createBrowserSession, { timeout_seconds: 86401 }),
		).toBe(false);
		expect(
			accepts(inputs.createBrowserSession, {
				proxy_config: { type: 'public' },
			}),
		).toBe(false);
	});

	it('requires a non-empty session id to terminate', () => {
		expect(
			accepts(inputs.terminateBrowserSession, { sessionId: 'sess-1' }),
		).toBe(true);
		expect(accepts(inputs.terminateBrowserSession, { sessionId: '' })).toBe(
			false,
		);
		expect(accepts(inputs.terminateBrowserSession, {})).toBe(false);
	});

	it('accepts the browser usage window', () => {
		expect(
			accepts(inputs.browserUsage, {
				session_id: 'sess-1',
				status: 'ended',
				limit: 1000,
				page: 1,
			}),
		).toBe(true);
		expect(accepts(inputs.browserUsage, { status: 'closed' })).toBe(false);
	});
});

describe('agent run inputs', () => {
	it('accepts the documented run body', () => {
		expect(
			accepts(inputs.run, {
				url: 'https://example.com',
				goal: 'Get the title',
				browser_profile: 'stealth',
				api_integration: 'none',
				agent_config: {
					mode: 'strict',
					cursor_style: 'fish',
					max_steps: 100,
					max_duration_seconds: 300,
				},
				capture_config: {
					elements: true,
					snapshots: true,
					screenshots: true,
					recording: false,
					html: true,
				},
				webhook_url: 'https://hooks.example.com/tinyfish',
				use_vault: false,
				use_profile: true,
				profile_id: 'p-1',
				credential_item_ids: ['vault://github/login'],
				proxy_config: { enabled: true, country_code: 'US' },
				output_schema: { type: 'object' },
			}),
		).toBe(true);
	});

	it('requires an url and a non-empty goal', () => {
		expect(accepts(inputs.run, { goal: 'x' })).toBe(false);
		expect(accepts(inputs.run, { url: 'https://x' })).toBe(false);
		expect(accepts(inputs.run, { url: 'https://x', goal: '' })).toBe(false);
	});

	it('enforces the agent config and capture ranges', () => {
		expect(
			accepts(inputs.run, {
				url: 'https://x',
				goal: 'g',
				agent_config: { max_steps: 0 },
			}),
		).toBe(false);
		expect(
			accepts(inputs.run, {
				url: 'https://x',
				goal: 'g',
				agent_config: { max_steps: 500 },
			}),
		).toBe(true);
		expect(
			accepts(inputs.run, {
				url: 'https://x',
				goal: 'g',
				credential_item_ids: [],
			}),
		).toBe(false);
		expect(
			accepts(inputs.run, {
				url: 'https://x',
				goal: 'g',
				proxy_config: { enabled: true, country_code: 'FR' },
			}),
		).toBe(true);
		expect(
			accepts(inputs.run, {
				url: 'https://x',
				goal: 'g',
				proxy_config: { enabled: true, country_code: 'RU' },
			}),
		).toBe(false);
	});

	it('accepts runAsync with the profile switch and rejects unknown keys', () => {
		expect(
			accepts(inputs.runAsync, {
				url: 'https://x',
				goal: 'g',
				use_profile: true,
			}),
		).toBe(true);
		expect(
			accepts(inputs.runAsync, { url: 'https://x', goal: 'g', oiseau: 1 }),
		).toBe(false);
	});

	it('accepts a batch of 1-100 runs without per-run profile fields', () => {
		expect(
			accepts(inputs.runBatch, {
				runs: [{ url: 'https://x', goal: 'g' }],
				profile_id: 'p-1',
				output_schema: { type: 'object' },
			}),
		).toBe(true);
		expect(accepts(inputs.runBatch, { runs: [] })).toBe(false);
		expect(
			accepts(inputs.runBatch, {
				runs: Array.from({ length: 101 }, () => ({
					url: 'https://x',
					goal: 'g',
				})),
			}),
		).toBe(false);
		expect(
			accepts(inputs.runBatch, {
				runs: [{ url: 'https://x', goal: 'g', use_profile: true }],
			}),
		).toBe(false);
	});

	it('accepts run list filters', () => {
		expect(
			accepts(inputs.listRuns, {
				status: 'RUNNING',
				goal: 'title',
				created_after: '2026-01-01',
				created_before: '2026-02-01',
				sort_direction: 'desc',
				cursor: 'c1',
				limit: 100,
			}),
		).toBe(true);
		expect(accepts(inputs.listRuns, { limit: 101 })).toBe(false);
		expect(accepts(inputs.listRuns, { sort_direction: 'up' })).toBe(false);
	});

	it('accepts the artifact switches for getRun', () => {
		expect(
			accepts(inputs.getRun, {
				runId: 'run-1',
				screenshots: 'base64',
				html: 'none',
			}),
		).toBe(true);
		expect(accepts(inputs.getRun, { runId: 'run-1', screenshots: 'zip' })).toBe(
			false,
		);
		expect(accepts(inputs.getRun, { runId: '' })).toBe(false);
	});

	it('accepts between 1 and 100 run ids for batch reads and cancels', () => {
		expect(accepts(inputs.getRuns, { run_ids: ['run-1'] })).toBe(true);
		expect(accepts(inputs.getRuns, { run_ids: [] })).toBe(false);
		expect(
			accepts(inputs.cancelRuns, {
				run_ids: Array.from({ length: 101 }, (_, i) => `run-${i}`),
			}),
		).toBe(false);
		expect(accepts(inputs.cancelRun, { runId: 'run-1' })).toBe(true);
		expect(accepts(inputs.cancelRun, {})).toBe(false);
	});
});

describe('research inputs', () => {
	it('accepts the documented research body', () => {
		expect(
			accepts(inputs.startResearch, {
				query: 'state of browser agents',
				mode: 'deep',
				stream: false,
				output_language: 'en',
				weak_sources_enabled: true,
				domain_type: 'web',
				after_date: '2026-01-01',
				before_date: '2026-02-01',
				recency_minutes: 1440,
				domain_filter: {
					mode: 'include',
					domains: ['arxiv.org'],
					block: ['reddit.com'],
				},
				prior_run_id: 'rr-0',
				session_id: '3f1a9bfa-7d21-4a2a-9df2-3a3d9bbf0f3a',
			}),
		).toBe(true);
	});

	it('requires a query and a domain filter mode', () => {
		expect(accepts(inputs.startResearch, {})).toBe(false);
		expect(accepts(inputs.startResearch, { query: 'x', mode: 'quick' })).toBe(
			false,
		);
		expect(
			accepts(inputs.startResearch, {
				query: 'x',
				domain_filter: { domains: ['a.com'] },
			}),
		).toBe(false);
		expect(
			accepts(inputs.startResearch, {
				query: 'x',
				domain_filter: {
					mode: 'exclusive',
					domains: Array.from({ length: 151 }, (_, i) => `d${i}.com`),
				},
			}),
		).toBe(false);
	});

	it('accepts only the live deep and max research modes', () => {
		expect(accepts(inputs.startResearch, { query: 'x', mode: 'deep' })).toBe(
			true,
		);
		expect(accepts(inputs.startResearch, { query: 'x', mode: 'max' })).toBe(
			true,
		);
		expect(accepts(inputs.startResearch, { query: 'x', mode: 'auto' })).toBe(
			false,
		);
		expect(accepts(inputs.startResearch, { query: 'x', mode: 'instant' })).toBe(
			false,
		);
		expect(
			accepts(inputs.startResearch, { query: 'x', mode: 'standard' }),
		).toBe(false);
	});

	it('accepts research list filters and research run ids', () => {
		expect(
			accepts(inputs.listResearchRuns, { status: 'QUEUED', limit: 50 }),
		).toBe(true);
		expect(accepts(inputs.listResearchRuns, { status: 'PAUSED' })).toBe(false);
		expect(accepts(inputs.getResearchRun, { researchRunId: 'rr-1' })).toBe(
			true,
		);
		expect(accepts(inputs.getResearchRun, { researchRunId: '' })).toBe(false);
		expect(accepts(inputs.cancelResearchRun, { researchRunId: 'rr-1' })).toBe(
			true,
		);
	});
});

describe('profiles inputs', () => {
	it('accepts only an empty object for list', () => {
		expect(accepts(inputs.listProfiles, {})).toBe(true);
		expect(accepts(inputs.listProfiles, { verbose: true })).toBe(false);
	});

	it('accepts profile creation with a country and a default flag', () => {
		expect(
			accepts(inputs.createProfile, {
				name: 'Work',
				set_as_default: true,
				proxy_country_code: 'JP',
			}),
		).toBe(true);
		expect(
			accepts(inputs.createProfile, { name: 'Work', proxy_country_code: null }),
		).toBe(true);
		expect(accepts(inputs.createProfile, { name: '' })).toBe(false);
		expect(accepts(inputs.createProfile, { name: 'a'.repeat(101) })).toBe(
			false,
		);
		expect(
			accepts(inputs.createProfile, { name: 'Work', proxy_country_code: 'XX' }),
		).toBe(false);
	});

	it('requires a profile id for get, update and delete', () => {
		expect(accepts(inputs.getProfile, { profileId: 'p-1' })).toBe(true);
		expect(accepts(inputs.getProfile, {})).toBe(false);
		expect(
			accepts(inputs.updateProfile, { profileId: 'p-1', name: 'Home' }),
		).toBe(true);
		expect(
			accepts(inputs.updateProfile, {
				profileId: 'p-1',
				proxy_country_code: null,
			}),
		).toBe(true);
		expect(accepts(inputs.updateProfile, { profileId: 'p-1', oiseau: 1 })).toBe(
			false,
		);
		expect(accepts(inputs.deleteProfile, { profileId: 'p-1' })).toBe(true);
		expect(accepts(inputs.deleteProfile, { profileId: '' })).toBe(false);
	});
});

describe('wallet input', () => {
	it('accepts only an empty object', () => {
		expect(accepts(inputs.getWallet, {})).toBe(true);
		expect(accepts(inputs.getWallet, { refresh: true })).toBe(false);
	});
});

describe('step artifact and vault inputs', () => {
	it('requires a run id and step id for the artifact endpoints', () => {
		expect(
			accepts(inputs.getStepScreenshot, { runId: 'run-1', stepId: 'evt_1' }),
		).toBe(true);
		expect(
			accepts(inputs.getStepHtml, { runId: 'run-1', stepId: 'evt_1' }),
		).toBe(true);
		expect(accepts(inputs.getStepScreenshot, { runId: 'run-1' })).toBe(false);
		expect(accepts(inputs.getStepHtml, { runId: 'run-1', stepId: '' })).toBe(
			false,
		);
		expect(
			accepts(inputs.getStepHtml, {
				runId: 'run-1',
				stepId: 'evt_1',
				format: 'pdf',
			}),
		).toBe(false);
	});

	it('accepts only an empty object for the vault list', () => {
		expect(accepts(inputs.listVaultItems, {})).toBe(true);
		expect(accepts(inputs.listVaultItems, { page: 1 })).toBe(false);
	});
});

describe('outputs', () => {
	it('validates search responses with ranked results', () => {
		expect(
			accepts(outputs.search, {
				query: 'corsair',
				results: [
					{
						...searchResult,
						thumbnail_url: 'https://example.com/thumb.png',
						fetch: { text: 'page' },
					},
				],
				total_results: 1,
				page: 0,
			}),
		).toBe(true);
		expect(
			accepts(outputs.search, {
				query: 'corsair',
				results: [{ position: 1, site_name: 'x', snippet: 's', title: 't' }],
				total_results: 1,
				page: 0,
			}),
		).toBe(false);
	});

	it('validates search usage pages with nullable result payloads', () => {
		expect(
			accepts(outputs.searchUsage, {
				items: [
					{
						id: 1,
						request_id: 'req-1',
						query: 'corsair',
						status_code: 200,
						result_count: 10,
						results: null,
						cached: false,
						response_size_bytes: 2048,
						created_at: '2026-01-02T00:00:00.000Z',
					},
				],
				total: 1,
				limit: 20,
				page: 1,
				total_pages: 1,
				has_more: false,
			}),
		).toBe(true);
		expect(
			accepts(outputs.searchUsage, {
				items: [{ id: 1, request_id: 'req-1', query: 'x' }],
				total: 1,
				limit: 20,
				page: 1,
				total_pages: 1,
				has_more: false,
			}),
		).toBe(false);
	});

	it('validates fetch responses with object text and per-url errors', () => {
		expect(
			accepts(outputs.fetch, {
				results: [
					{
						url: 'https://example.com',
						final_url: 'https://example.com',
						title: 'Example',
						description: null,
						language: 'en',
						format: 'json',
						text: { title: 'Example' },
						author: null,
						published_date: null,
						links: ['https://example.com/a'],
						page_metadata: { site: 'example' },
						latency_ms: 120,
						etag: 'W/"1"',
					},
				],
				errors: [{ url: 'https://example.org', error: 'timeout', status: 504 }],
				request_id: 'req-1',
			}),
		).toBe(true);
		expect(
			accepts(outputs.fetch, {
				results: [],
				errors: [],
			}),
		).toBe(true);
		expect(
			accepts(outputs.fetch, {
				results: [
					{
						url: 'https://example.com',
						final_url: null,
						title: null,
						description: null,
						language: null,
						format: 'pdf',
						text: null,
						author: null,
						published_date: null,
						latency_ms: null,
					},
				],
				errors: [],
			}),
		).toBe(false);
	});

	it('validates fetch usage pages', () => {
		expect(
			accepts(outputs.fetchUsage, {
				items: [
					{
						id: 'f-1',
						url: 'https://example.com',
						final_url: 'https://example.com',
						title: null,
						description: null,
						language: null,
						author: null,
						published_date: null,
						format: 'markdown',
						status: 'completed',
						request_origin: 'api',
						request_id: null,
						text_length: 100,
						links_count: 3,
						image_links_count: 0,
						latency_ms: 90,
						created_at: '2026-01-02T00:00:00.000Z',
						error: null,
					},
				],
				total: 1,
				limit: 20,
				page: 1,
				total_pages: 1,
				has_more: false,
			}),
		).toBe(true);
		expect(
			accepts(outputs.fetchUsage, {
				items: [
					{
						id: 'f-1',
						url: 'https://example.com',
						final_url: 'https://example.com',
						title: null,
						description: null,
						language: null,
						author: null,
						published_date: null,
						format: 'markdown',
						status: 'errored',
						request_origin: 'api',
						request_id: null,
						text_length: null,
						links_count: 0,
						image_links_count: 0,
						latency_ms: null,
						created_at: '2026-01-02T00:00:00.000Z',
						error: 'timeout',
					},
				],
				total: 1,
				limit: 20,
				page: 1,
				total_pages: 1,
				has_more: false,
			}),
		).toBe(false);
	});

	it('validates browser session creation and termination', () => {
		expect(
			accepts(outputs.createBrowserSession, {
				session_id: 'sess-1',
				cdp_url: 'wss://cdp.tinyfish.ai/sess-1',
				base_url: 'https://browser.tinyfish.ai/sess-1',
			}),
		).toBe(true);
		expect(
			accepts(outputs.createBrowserSession, {
				session_id: 'sess-1',
				cdp_url: 'wss://cdp.tinyfish.ai/sess-1',
			}),
		).toBe(false);
		expect(
			accepts(outputs.terminateBrowserSession, {
				terminated: true,
				session_id: 'sess-1',
			}),
		).toBe(true);
		expect(
			accepts(outputs.terminateBrowserSession, {
				terminated: false,
				session_id: 'sess-1',
			}),
		).toBe(false);
	});

	it('validates browser usage pages', () => {
		expect(
			accepts(outputs.browserUsage, {
				items: [
					{
						session_id: 'sess-1',
						user_id: 'u-1',
						sub_user_id: null,
						mode: 'light',
						start_time: '2026-01-02T00:00:00.000Z',
						end_time: null,
						duration_ms: null,
						proxy_trg_rx_bytes: null,
						proxy_trg_tx_bytes: null,
						status: 'running',
						created_at: '2026-01-02T00:00:00.000Z',
						updated_at: '2026-01-02T00:00:00.000Z',
					},
				],
				total: 1,
				limit: 100,
				page: 1,
				total_pages: 1,
				has_more: false,
			}),
		).toBe(true);
		expect(
			accepts(outputs.browserUsage, {
				items: [{ session_id: 'sess-1', mode: 'headless' }],
				total: 1,
				limit: 100,
				page: 1,
				total_pages: 1,
				has_more: false,
			}),
		).toBe(false);
	});

	it('only accepts terminal statuses on a sync run', () => {
		expect(
			accepts(outputs.run, {
				run_id: 'run-1',
				status: 'COMPLETED',
				started_at: null,
				finished_at: null,
				num_of_steps: 2,
				result: { title: 'Example' },
				error: null,
			}),
		).toBe(true);
		expect(
			accepts(outputs.run, {
				run_id: 'run-1',
				status: 'RUNNING',
				started_at: null,
				finished_at: null,
				num_of_steps: null,
				result: null,
				error: null,
			}),
		).toBe(false);
		expect(
			accepts(outputs.runAsync, {
				run_id: null,
				error: { code: 'SITE_BLOCKED' },
			}),
		).toBe(false);
		expect(
			accepts(outputs.runAsync, {
				run_id: null,
				error: { code: 'SITE_BLOCKED', message: 'Blocked' },
			}),
		).toBe(true);
		expect(accepts(outputs.runBatch, { run_ids: 'nope', error: null })).toBe(
			false,
		);
		expect(accepts(outputs.runBatch, { run_ids: ['run-1'], error: null })).toBe(
			true,
		);
	});

	it('validates run list pages', () => {
		expect(
			accepts(outputs.listRuns, {
				data: [runSummary],
				pagination: { total: 1, next_cursor: null, has_more: false },
			}),
		).toBe(true);
		expect(
			accepts(outputs.listRuns, {
				data: [runSummary],
				pagination: { total: 1 },
			}),
		).toBe(false);
	});

	it('validates a fully hydrated run with steps', () => {
		expect(accepts(outputs.getRun, fullRun)).toBe(true);
		expect(
			accepts(outputs.getRun, {
				...fullRun,
				steps: [{ id: 'step-1', status: 'COMPLETED' }],
			}),
		).toBe(false);
		expect(
			accepts(outputs.getRuns, { data: [fullRun], not_found: ['run-2'] }),
		).toBe(true);
		expect(accepts(outputs.getRuns, { data: 'nope', not_found: null })).toBe(
			false,
		);
	});

	it('only accepts terminal statuses on run cancellations', () => {
		expect(
			accepts(outputs.cancelRun, {
				run_id: 'run-1',
				status: 'CANCELLED',
				cancelled_at: null,
				message: null,
			}),
		).toBe(true);
		expect(
			accepts(outputs.cancelRun, {
				run_id: 'run-1',
				status: 'RUNNING',
				cancelled_at: null,
				message: null,
			}),
		).toBe(false);
		expect(
			accepts(outputs.cancelRuns, {
				results: [
					{
						run_id: 'run-1',
						status: 'COMPLETED',
						cancelled_at: '2026-01-02T00:00:00.000Z',
						message: 'Already done',
					},
				],
				not_found: ['run-9'],
			}),
		).toBe(true);
	});

	it('validates research start acknowledgements', () => {
		expect(
			accepts(outputs.startResearch, {
				research_run_id: 'rr-1',
				error: null,
			}),
		).toBe(true);
		expect(
			accepts(outputs.startResearch, {
				research_run_id: 'rr-1',
				error: { code: 'FEATURE_NOT_AVAILABLE' },
			}),
		).toBe(false);
	});

	it('validates research run pages and detail payloads', () => {
		const pagination = { total: 1, next_cursor: null, has_more: false };
		expect(
			accepts(outputs.listResearchRuns, {
				data: [researchRun],
				pagination,
			}),
		).toBe(true);
		expect(
			accepts(outputs.listResearchRuns, {
				data: [{ ...researchRun, status: 'PAUSED' }],
				pagination,
			}),
		).toBe(false);
		expect(
			accepts(outputs.getResearchRun, {
				...researchRun,
				error: { code: 'BRAND_NEW_PROVIDER_CODE', message: 'later' },
			}),
		).toBe(true);
		expect(
			accepts(outputs.listResearchRuns, {
				data: [
					{
						...researchRun,
						error: { code: 'BRAND_NEW_PROVIDER_CODE', message: 'later' },
					},
				],
				pagination,
			}),
		).toBe(true);

		expect(
			accepts(outputs.getResearchRun, {
				...researchRun,
				status: 'COMPLETED',
				quick_result: {
					answer: 'AI',
					citations: ['https://example.com'],
					actions: [{ id: 'a1', label: 'plan', status: 'done' }],
					stats: {
						iterations: 1,
						sources_searched: 5,
						sources_fetched: 4,
						agent_runs: 1,
						claims_extracted: 6,
						termination_reason: 'planner_done',
						subquestions_covered: 1,
						subquestions_total: 1,
					},
				},
				quick_result_summary: 'summary',
				deep_result: {
					result: 'report',
					citations: ['https://example.com'],
					freshness_report: {
						sources_with_dates: 1,
						sources_without_dates: 0,
						sources_in_requested_window: 1,
					},
					termination_reason: 'planner_done',
				},
				research_plan: {
					summary: 'plan',
					subquestions: [{ id: 'q1', question: 'Q?', priority: 'high' }],
					search_queries: ['query'],
					done: true,
				},
				evidence: [
					{
						url: 'https://example.com',
						title: 'Example',
						subquestions_covered: ['q1'],
						claims: [
							{
								claim: 'c',
								snippet: 's',
								subquestion_id: 'q1',
								confidence: 'high',
							},
						],
						source_quality: 'primary',
					},
				],
				iterations: 2,
			}),
		).toBe(true);

		const { quick_result: _quick, ...missingQuick } = {
			...researchRun,
			quick_result: null,
		};
		expect(accepts(outputs.getResearchRun, missingQuick)).toBe(false);
		expect(
			accepts(outputs.cancelResearchRun, {
				research_run_id: 'rr-1',
				status: 'CANCELLED',
				cancelled: true,
			}),
		).toBe(true);
		expect(
			accepts(outputs.cancelResearchRun, {
				research_run_id: 'rr-1',
				status: 'CANCELLED',
				cancelled: 'yes',
			}),
		).toBe(false);
	});

	it('validates profile lists, details and deletions', () => {
		expect(accepts(outputs.listProfiles, { profiles: [profileRow] })).toBe(
			true,
		);
		expect(
			accepts(outputs.listProfiles, {
				profiles: [{ id: 'p-1', name: 'Work' }],
			}),
		).toBe(false);
		expect(
			accepts(outputs.createProfile, {
				...profileRow,
				is_default: true,
				proxy_country_code: null,
			}),
		).toBe(true);
		expect(accepts(outputs.createProfile, { id: 'p-1' })).toBe(false);

		const profileDetail = {
			...profileRow,
			domains: [
				{
					domain: 'example.com',
					cookie_count: 2,
					local_storage_origin_count: 1,
					last_accessed_at: '2026-01-02T00:00:00.000Z',
					last_written_at: '2026-01-02T00:00:00.000Z',
					last_written_by_run_id: 'run-1',
				},
			],
		};
		expect(accepts(outputs.getProfile, profileDetail)).toBe(true);
		expect(accepts(outputs.updateProfile, profileDetail)).toBe(true);
		expect(accepts(outputs.getProfile, profileRow)).toBe(false);
		expect(accepts(outputs.deleteProfile, { deleted: true })).toBe(true);
		expect(accepts(outputs.deleteProfile, { deleted: 'yes' })).toBe(false);
	});

	it('validates the wallet, including a live rate table', () => {
		expect(
			accepts(outputs.getWallet, {
				available_balance: '12.50',
				currency: 'USD',
				as_of: '2026-01-02T00:00:00.000Z',
				auto_reload: null,
				pending_top_up: null,
				rates: null,
			}),
		).toBe(true);
		expect(
			accepts(outputs.getWallet, {
				available_balance: '12.50',
				currency: 'USD',
				as_of: '2026-01-02T00:00:00.000Z',
				auto_reload: { state: 'disabled' },
				pending_top_up: {
					amount: '10.00',
					started_at: '2026-01-02T00:00:00.000Z',
				},
				rates: {
					meters: [
						{
							label: 'Agent step',
							unit_amount: '0.01',
							currency: 'USD',
							per: 'step',
						},
					],
					as_of: '2026-01-02T00:00:00.000Z',
				},
			}),
		).toBe(true);
		expect(
			accepts(outputs.getWallet, {
				available_balance: '0',
				currency: 'EUR',
				as_of: '2026-01-02T00:00:00.000Z',
				auto_reload: null,
				pending_top_up: null,
				rates: null,
			}),
		).toBe(false);
	});

	it('validates step artifact envelopes and vault metadata', () => {
		expect(
			accepts(outputs.getStepScreenshot, {
				contentType: 'image/jpeg',
				base64: 'AQID',
				sizeBytes: 3,
			}),
		).toBe(true);
		expect(
			accepts(outputs.getStepScreenshot, {
				contentType: 'image/jpeg',
				base64: 'AQID',
			}),
		).toBe(false);
		expect(
			accepts(outputs.getStepHtml, {
				contentType: 'text/html',
				html: '<html></html>',
			}),
		).toBe(true);
		expect(accepts(outputs.getStepHtml, { contentType: 'text/html' })).toBe(
			false,
		);

		expect(
			accepts(outputs.listVaultItems, {
				items: [
					{
						itemId: 'cred:conn-123:Personal:item-abc123',
						connectionId: 'conn_123',
						label: 'Amazon Login',
						vaultName: 'Personal',
						domains: ['amazon.com'],
						fieldMetadata: [
							{ fieldId: 'password', label: 'Password', type: 'CONCEALED' },
						],
						hasTotp: true,
					},
				],
			}),
		).toBe(true);
		expect(accepts(outputs.listVaultItems, { items: [] })).toBe(true);
		expect(
			accepts(outputs.listVaultItems, {
				items: [
					{
						itemId: 'item-1',
						connectionId: null,
						label: 'Login',
						vaultName: 'Personal',
						domains: [],
						fieldMetadata: [
							{ fieldId: 'password', label: 'Password', type: 'SECRET' },
						],
						hasTotp: false,
					},
				],
			}),
		).toBe(false);
	});
});
