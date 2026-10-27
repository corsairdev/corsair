import { logEventFromContext } from 'corsair/core';
import { TypeSafeAPIError } from './client';
import { Models, SystemOne } from './endpoints';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'ts-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return {
		url,
		init,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

const answers = {
	fits: { type: 'noul', noul: 0.94 },
	seniority: {
		type: 'choice',
		choice: 'director_or_vp',
		confidence: 0.92,
		probabilities: { manager: 0.05, director_or_vp: 0.94, founder: 0.01 },
	},
	urgency: {
		type: 'score',
		score: 1.7,
		confidence: 0.8,
		legend: { '0': 'Can wait', '1': 'This week', '2': 'Today' },
		probabilities: { '0': 0.1, '1': 0.1, '2': 0.8 },
	},
	mug: {
		type: 'box',
		box: { top: 0.2, bottom: 0.66, left: 0.19, right: 0.68 },
		confidence: null,
	},
};

const askResponse = {
	model: 'jev-1.14.0',
	answers,
	usage: { input_tokens: 669, output_tokens: 234 },
};

const textQuestions = {
	fits: { type: 'noul', instructions: 'Does `lead` fit `icp`?' },
	seniority: {
		type: 'choice',
		instructions: 'How senior is `lead`?',
		criteria: { manager: null, director_or_vp: null, founder: null },
	},
};

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('systemOne.ask', () => {
	it('posts state and questions with jev-latest by default and returns typed answers', async () => {
		respond(askResponse);

		const result = (await invoke(SystemOne.ask, {
			state: { lead: { title: 'VP Platform' }, icp: 'engineering leaders' },
			questions: textQuestions,
		})) as typeof askResponse;

		const sent = lastRequest();
		expect(sent.url).toBe('https://api.typesafe.ai/v1/systemone');
		expect(sent.init.method).toBe('POST');
		expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
		expect(sent.body).toEqual({
			model: 'jev-latest',
			state: { lead: { title: 'VP Platform' }, icp: 'engineering leaders' },
			questions: textQuestions,
		});
		expect(sent.headers.get('typesafe-danger-zone-images')).toBeNull();
		expect(sent.headers.get('typesafe-danger-zone-long-context')).toBeNull();
		expect(result.model).toBe('jev-1.14.0');
		expect(result.answers.fits).toEqual({ type: 'noul', noul: 0.94 });
		expect(result.answers.seniority.choice).toBe('director_or_vp');
		expect(result.answers.urgency.score).toBe(1.7);
		expect(result.answers.mug.box.left).toBe(0.19);
		expect(result.usage.input_tokens).toBe(669);
	});

	it('logs counts, never the state or question text', async () => {
		respond(askResponse);

		await invoke(SystemOne.ask, {
			state: 'private message text',
			questions: textQuestions,
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'typesafe.systemOne.ask',
			{ model: 'jev-1.14.0', questions: 2, inputTokens: 669 },
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('private');
	});

	it('keeps a pinned model and sends long context as a header, not a field', async () => {
		respond(askResponse);

		await invoke(SystemOne.ask, {
			model: 'jev-1.14.0',
			state: 'a long contract',
			questions: {
				early_exit: { type: 'noul', instructions: 'Can it end early?' },
			},
			longContext: true,
		});

		const sent = lastRequest();
		expect(sent.headers.get('typesafe-danger-zone-long-context')).toBe('true');
		expect(sent.body).toEqual({
			model: 'jev-1.14.0',
			state: 'a long contract',
			questions: {
				early_exit: { type: 'noul', instructions: 'Can it end early?' },
			},
		});
	});

	it('opts into images when the request has image assets', async () => {
		respond(askResponse);

		await invoke(SystemOne.ask, {
			state: { photo: 'img-1' },
			questions: {
				has_mug: { type: 'noul', instructions: 'Is there a mug in `photo`?' },
			},
			assets: {
				'img-1': { type: 'image', format: 'png', data_base64: 'iVBORw0K' },
			},
		});

		expect(lastRequest().headers.get('typesafe-danger-zone-images')).toBe(
			'true',
		);
	});

	it('opts into images for a box question', async () => {
		respond(askResponse);

		await invoke(SystemOne.ask, {
			state: 'img-1',
			questions: { mug: { type: 'box', instructions: 'the coffee mug' } },
		});

		expect(lastRequest().headers.get('typesafe-danger-zone-images')).toBe(
			'true',
		);
	});

	it('accepts score criteria and noul criteria as structured content', async () => {
		respond(askResponse);

		await invoke(SystemOne.ask, {
			state: { ticket: 'Site is down for all users' },
			questions: {
				urgency: {
					type: 'score',
					instructions: 'How urgent is `ticket`?',
					criteria: [
						'Can wait',
						'Needs attention this week',
						{ level: 'today' },
					],
				},
				outage: {
					type: 'noul',
					instructions: 'Does `ticket` report an outage?',
					criteria: {
						true: 'Users cannot reach the service',
						false: 'A single feature misbehaves',
					},
				},
			},
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it.each([
		['no questions', { state: 'x', questions: {} }],
		[
			'a choice without criteria',
			{ state: 'x', questions: { a: { type: 'choice', instructions: '?' } } },
		],
		[
			'a choice with no options',
			{ state: 'x', questions: { a: { type: 'choice', criteria: {} } } },
		],
		[
			'more than 10 score levels',
			{
				state: 'x',
				questions: {
					a: {
						type: 'score',
						criteria: Array.from({ length: 11 }, (_, i) => `level ${i}`),
					},
				},
			},
		],
		[
			'an unknown question type',
			{ state: 'x', questions: { a: { type: 'extract' } } },
		],
		[
			'a non-image asset',
			{
				state: 'x',
				questions: { a: { type: 'noul' } },
				assets: { p: { type: 'pdf', format: 'png', data_base64: 'x' } },
			},
		],
		['a numeric state', { state: 42, questions: { a: { type: 'noul' } } }],
	])('rejects %s before calling TypeSafe', async (_label, input) => {
		await expect(invoke(SystemOne.ask, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a response whose answers do not match the question types', async () => {
		respond({
			model: 'jev-1.14.0',
			answers: { fits: { type: 'noul', noul: 'high' } },
			usage: { input_tokens: 1, output_tokens: 1 },
		});

		await expect(
			invoke(SystemOne.ask, {
				state: 'x',
				questions: { fits: { type: 'noul' } },
			}),
		).rejects.toThrow();
	});

	it('surfaces a 400 as an error, not as an answer', async () => {
		respond(
			{
				detail: {
					error_type: 'api_usage_error',
					message: 'Unknown model: jev-nope',
				},
			},
			400,
		);

		const error = await invoke(SystemOne.ask, {
			model: 'jev-nope',
			state: 'x',
			questions: { a: { type: 'noul' } },
		}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(TypeSafeAPIError);
		expect((error as TypeSafeAPIError).message).toBe(
			'TypeSafe 400: Unknown model: jev-nope',
		);
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('models.list', () => {
	it('GETs /v1/models and returns the names', async () => {
		respond({
			models: [
				{
					name: 'jev-latest',
					description:
						"The latest iteration of TypeSafe's System One Model: Jev",
					release_date: '2026-09-10T18:38:01.391457+00:00',
				},
				{
					name: 'jev-preview',
					description: 'A preview version',
					release_date: '2026-09-10',
				},
			],
		});

		const result = (await invoke(Models.list, {})) as {
			models: { name: string }[];
		};

		const sent = lastRequest();
		expect(sent.url).toBe('https://api.typesafe.ai/v1/models');
		expect(sent.init.method).toBe('GET');
		expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
		expect(result.models.map((model) => model.name)).toEqual([
			'jev-latest',
			'jev-preview',
		]);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'typesafe.models.list',
			{ count: 2 },
			'completed',
		);
	});

	it('accepts a missing input', async () => {
		respond({ models: [] });

		await expect(invoke(Models.list, undefined)).resolves.toEqual({
			models: [],
		});
	});

	it('rejects a malformed model list', async () => {
		respond({ models: [{ name: 'jev-latest' }] });

		await expect(invoke(Models.list, {})).rejects.toThrow();
	});
});
