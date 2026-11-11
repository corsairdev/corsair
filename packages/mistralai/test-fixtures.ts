import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import type { MistralAiPluginOptions } from './index';
import { mistralai } from './index';

export const API_KEY = 'mistral-test-key';
export const BASE = 'https://api.mistral.ai';

/** A Corsair client with the plugin registered and an API key stored. */
export async function createClient(options: MistralAiPluginOptions = {}) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'mistralai', 'default');
	const corsair = createCorsair({
		plugins: [mistralai(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	await corsair.mistralai.keys.issue_new_dek();
	await corsair.mistralai.keys.set_api_key(API_KEY);
	return { corsair, testDb };
}

/**
 * A fetch spy that fails any call a test did not queue a response for, so
 * nothing reaches the network.
 */
export function mockFetch() {
	return jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		throw new Error('unmocked fetch: queue a response first');
	});
}

// unknown: response bodies are arbitrary JSON, as Mistral sends them.
export function jsonResponse(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', ...headers },
	});
}

// Shapes below follow the response schemas in Mistral's OpenAPI spec.

export const FILE_ID = '497f6eca-6276-4993-bfeb-53cbbbba6f08';
export const JOB_ID = 'b2f4a1c8-1e0d-4a8e-9c3b-5d6e7f809a1b';
export const AUDIO_AGENT_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
export const VOICE_ID = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
export const AGENT_ID = 'ag_0193a8f0c2f47f2b9d1e5a6b7c8d9e0f';
export const FT_MODEL_ID = 'ft:open-mistral-7b:587a6b29:20240514:7e773925';
const CREATED = 1762819200;
const STAMP = '2026-11-11T00:00:00Z';

export const completion = {
	id: 'cmpl-e5cc70bb28c444948073e77776eb30ef',
	object: 'chat.completion',
	model: 'mistral-small-latest',
	created: CREATED,
	usage: { prompt_tokens: 12, completion_tokens: 3, total_tokens: 15 },
	choices: [
		{
			index: 0,
			message: { role: 'assistant', content: 'Paris.', tool_calls: null },
			finish_reason: 'stop',
		},
	],
};

export const file = {
	id: FILE_ID,
	object: 'file',
	bytes: 13,
	created_at: CREATED,
	filename: 'requests.jsonl',
	purpose: 'batch',
	sample_type: 'batch_request',
	num_lines: 1,
	mimetype: 'application/jsonl',
	source: 'upload',
};

export const batchJob = {
	id: JOB_ID,
	object: 'batch',
	input_files: [FILE_ID],
	endpoint: '/v1/chat/completions',
	model: 'mistral-small-latest',
	output_file: null,
	error_file: null,
	errors: [],
	status: 'QUEUED',
	created_at: CREATED,
	total_requests: 1,
	completed_requests: 0,
	succeeded_requests: 0,
	failed_requests: 0,
	started_at: null,
	completed_at: null,
};

export const agent = {
	id: AGENT_ID,
	object: 'agent',
	name: 'Support triage',
	model: 'mistral-medium-latest',
	instructions: 'Answer in one sentence.',
	tools: [{ type: 'web_search' }],
	completion_args: { temperature: 0.3 },
	version: 1,
	versions: [0, 1],
	created_at: STAMP,
	updated_at: STAMP,
	deployment_chat: false,
	source: 'api',
};

export const alias = {
	alias: 'production',
	version: 1,
	created_at: STAMP,
	updated_at: STAMP,
};

export const model = {
	id: 'mistral-small-latest',
	object: 'model',
	created: CREATED,
	owned_by: 'mistralai',
	capabilities: { completion_chat: true, function_calling: true },
	name: 'mistral-small-2506',
	max_context_length: 131072,
	aliases: ['mistral-small-2506'],
	type: 'base',
};

export const fineTunedModel = {
	id: FT_MODEL_ID,
	object: 'model',
	created: CREATED,
	owned_by: 'org-1',
	workspace_id: 'ws-1',
	root: 'open-mistral-7b',
	root_version: '1',
	archived: false,
	name: 'Support tone',
	description: 'Tuned on support replies',
	capabilities: { completion_chat: true },
	job: '7e773925-0000-4000-8000-000000000001',
	model_type: 'completion',
};

export const voice = {
	id: VOICE_ID,
	name: 'Narrator',
	languages: ['en'],
	gender: 'female',
	created_at: STAMP,
	user_id: 'user-1',
	kind: 'ivc',
	type: 'custom',
};

export const audioAgent = {
	id: AUDIO_AGENT_ID,
	owner_id: 'user-1',
	name: 'Receptionist',
	description: null,
	created_at: STAMP,
	updated_at: STAMP,
	version: 1,
	configuration: { llm: { model: 'mistral-small-latest' } },
};

export const moderation = {
	id: 'mod-1',
	model: 'mistral-moderation-latest',
	results: [
		{
			categories: {
				hate_and_discrimination: false,
				violence_and_threats: false,
			},
			category_scores: {
				hate_and_discrimination: 0.001,
				violence_and_threats: 0.002,
			},
		},
	],
};

export const classification = {
	id: 'cls-1',
	model: 'ft:classifier:intent:1',
	results: [{ intent: { scores: { refund: 0.91, other: 0.09 } } }],
};
