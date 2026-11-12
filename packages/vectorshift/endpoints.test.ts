import { logEventFromContext } from 'corsair/core';
import { VectorshiftAPIError } from './client';
import {
	Chatbots,
	KnowledgeBases,
	Pipelines,
	Transformations,
} from './endpoints';
import { VectorshiftRunFailedError } from './endpoints/call';
import {
	chatbotCreated,
	chatbotRun,
	failedRun,
	failedWithoutReason,
	invalidKey,
	knowledgeBase,
	knowledgeBaseCreated,
	knowledgeBaseQuery,
	pipelineBulkRun,
	pipelineCreated,
	pipelineRun,
	pipelineRunWithFile,
	pipelines,
	pipelinesVerbose,
	transformationCreated,
	transformationRun,
} from './test-fixtures';
import {
	expectAuthenticated,
	installFetchMock,
	invoke,
	lastRequest,
	respond,
} from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const fetchMock = installFetchMock();

beforeEach(() => {
	mockLog.mockClear();
});

describe('pipelines', () => {
	it('lists pipeline ids', async () => {
		respond(fetchMock, pipelines);

		const result = await invoke(Pipelines.list, {});

		expect(result).toEqual(pipelines);
		expectAuthenticated(fetchMock);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/v1/pipelines');
	});

	it('accepts a status value VectorShift adds later', async () => {
		// The beta API warns response formats may change; only `failed` is an error.
		respond(fetchMock, { ...pipelines, status: 'partial' });

		const result = await invoke(Pipelines.list, {});

		expect(result).toEqual({ ...pipelines, status: 'partial' });
	});

	it('asks for shared pipelines and full objects', async () => {
		respond(fetchMock, pipelinesVerbose);

		const result = await invoke(Pipelines.list, {
			include_shared: true,
			verbose: true,
		});

		expect(result).toEqual(pipelinesVerbose);
		const sent = lastRequest(fetchMock);
		expect(sent.query.include_shared).toBe('true');
		expect(sent.query.verbose).toBe('true');
	});

	it('runs a pipeline and returns every output', async () => {
		respond(fetchMock, pipelineRun);

		const result = await invoke(Pipelines.run, {
			id: 'pl_7f3a2b',
			inputs: { question: 'Where is my refund?' },
		});

		expect(result).toEqual(pipelineRun);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/pipeline/pl_7f3a2b/run');
		expect(sent.body).toEqual({ inputs: { question: 'Where is my refund?' } });
	});

	it('passes a file output through unchanged', async () => {
		respond(fetchMock, pipelineRunWithFile);

		const result = await invoke(Pipelines.run, { id: 'pl_7f3a2b' });

		expect(result).toEqual(pipelineRunWithFile);
	});

	it('runs a pipeline with no inputs at all', async () => {
		respond(fetchMock, pipelineRun);

		await invoke(Pipelines.run, { id: 'pl_7f3a2b' });

		expect(lastRequest(fetchMock).body).toEqual({ inputs: undefined });
	});

	it('requires a pipeline id', async () => {
		await expect(invoke(Pipelines.run, {})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('runs one pipeline many times in a bulk run', async () => {
		respond(fetchMock, pipelineBulkRun);

		const result = await invoke(Pipelines.bulkRun, {
			id: 'pl_7f3a2b',
			runs: [{ inputs: { question: 'one' } }, { inputs: { question: 'two' } }],
		});

		expect(result).toEqual(pipelineBulkRun);
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/v1/pipeline/pl_7f3a2b/bulk_run');
		expect((sent.body as { runs: unknown[] }).runs).toHaveLength(2);
	});

	it('rejects a bulk run with no runs', async () => {
		await expect(
			invoke(Pipelines.bulkRun, { id: 'pl_7f3a2b', runs: [] }),
		).rejects.toThrow();
	});

	it('creates a pipeline from a graph', async () => {
		respond(fetchMock, pipelineCreated);

		const result = await invoke(Pipelines.create, {
			name: 'Support triage',
			description: 'Routes tickets by intent',
			config: { nodes: [], edges: [] },
		});

		expect(result).toEqual(pipelineCreated);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/pipeline');
		expect(sent.body).toMatchObject({
			name: 'Support triage',
			config: { nodes: [], edges: [] },
		});
	});

	it('requires a config, which the API insists on', async () => {
		await expect(
			invoke(Pipelines.create, { name: 'No config' }),
		).rejects.toThrow();
	});
});

describe('a failed run reported inside a 200', () => {
	it('raises rather than returning an empty success', async () => {
		respond(fetchMock, failedRun);

		// unknown: a promise can reject with any value; the cast below narrows it.
		const error = (await invoke(Pipelines.run, { id: 'pl_7f3a2b' }).catch(
			(thrown: unknown) => thrown,
		)) as VectorshiftRunFailedError;

		expect(error).toBeInstanceOf(VectorshiftRunFailedError);
		expect(error.operation).toBe('pipelines.run');
		expect(error.detail).toBe('Pipeline node "llm" raised: rate limited');
	});

	it('says so when no reason was given', async () => {
		respond(fetchMock, failedWithoutReason);

		// unknown: a promise can reject with any value; the cast below narrows it.
		const error = (await invoke(Pipelines.run, { id: 'pl_7f3a2b' }).catch(
			(thrown: unknown) => thrown,
		)) as VectorshiftRunFailedError;

		expect(error.detail).toBe('no reason given');
	});

	it('does not log a completed event for a failure', async () => {
		respond(fetchMock, failedRun);

		await expect(invoke(Pipelines.run, { id: 'pl_7f3a2b' })).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('knowledge bases', () => {
	it('creates one with a parser and chunking', async () => {
		respond(fetchMock, knowledgeBaseCreated);

		const result = await invoke(KnowledgeBases.create, {
			name: 'Product docs',
			description: 'Everything from the help centre',
			file_processing_implementation: 'LlamaParse',
			chunk_size: 1000,
			chunk_overlap: 200,
		});

		expect(result).toEqual(knowledgeBaseCreated);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/knowledge-base');
		expect(sent.body).toMatchObject({
			name: 'Product docs',
			file_processing_implementation: 'LlamaParse',
		});
	});

	it('rejects an unknown parser', async () => {
		await expect(
			invoke(KnowledgeBases.create, {
				name: 'Docs',
				file_processing_implementation: 'Magic',
			}),
		).rejects.toThrow();
	});

	it('fetches one by id, on the plural route', async () => {
		respond(fetchMock, knowledgeBase);

		const result = await invoke(KnowledgeBases.get, { id: 'kb_4d2f9a' });

		expect(result).toEqual(knowledgeBase);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/v1/knowledge-bases');
		expect(sent.query.id).toBe('kb_4d2f9a');
	});

	it('fetches by name with an owner', async () => {
		respond(fetchMock, knowledgeBase);

		await invoke(KnowledgeBases.get, {
			name: 'Product docs',
			org_name: 'Acme',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.query.name).toBe('Product docs');
		expect(sent.query.org_name).toBe('Acme');
	});

	it('rejects a lookup with neither id nor name', async () => {
		await expect(invoke(KnowledgeBases.get, {})).rejects.toThrow(
			'A knowledge base needs an id or a name to look up.',
		);
	});

	it('rejects a lookup with both an id and a name', async () => {
		await expect(
			invoke(KnowledgeBases.get, { id: 'kb_1', name: 'Docs' }),
		).rejects.toThrow('Send either an id or a name, not both.');
	});

	it('rejects an owner filter on an id lookup', async () => {
		await expect(
			invoke(KnowledgeBases.get, { id: 'kb_1', org_name: 'Acme' }),
		).rejects.toThrow('username and org_name only apply to a name lookup.');
	});

	it('queries it on the singular route', async () => {
		respond(fetchMock, knowledgeBaseQuery);

		const result = await invoke(KnowledgeBases.query, {
			id: 'kb_4d2f9a',
			queries: ['How do I reset my password?'],
		});

		expect(result).toEqual(knowledgeBaseQuery);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/knowledge-base/kb_4d2f9a/query');
		expect(sent.body).toMatchObject({
			queries: ['How do I reset my password?'],
		});
	});

	it('sends the retrieval switches', async () => {
		respond(fetchMock, knowledgeBaseQuery);

		await invoke(KnowledgeBases.query, {
			id: 'kb_4d2f9a',
			queries: ['pricing'],
			search_metadata: { top_k: 5 },
			config: { rerank_documents: true, score_cutoff: 0.5 },
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			search_metadata: { top_k: 5 },
			config: { rerank_documents: true, score_cutoff: 0.5 },
		});
	});

	it('rejects a query with no questions', async () => {
		await expect(
			invoke(KnowledgeBases.query, { id: 'kb_1', queries: [] }),
		).rejects.toThrow();
	});
});

describe('chatbots', () => {
	const chatBody = {
		pipeline: { id: 'pl_7f3a2b' },
		name: 'Support bot',
		description: 'Answers support questions',
		deployment_options: {},
		access_config: {},
		twilio_config: {},
		slack_config: {},
		deployed: true,
		input: 'question',
		output: 'answer',
	};

	it('creates one over a pipeline', async () => {
		respond(fetchMock, chatbotCreated);

		const result = await invoke(Chatbots.create, chatBody);

		expect(result).toEqual(chatbotCreated);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/chatbot');
		expect(sent.body).toMatchObject({
			name: 'Support bot',
			input: 'question',
			output: 'answer',
		});
	});

	it('accepts an exact pipeline version', async () => {
		respond(fetchMock, chatbotCreated);

		await invoke(Chatbots.create, {
			...chatBody,
			pipeline: { id: 'pl_7f3a2b', version: { major: 1, minor: 2, patch: 0 } },
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			pipeline: { version: { major: 1, minor: 2, patch: 0 } },
		});
	});

	it('requires the input and output node names', async () => {
		const { input: _input, ...withoutInput } = chatBody;
		await expect(invoke(Chatbots.create, withoutInput)).rejects.toThrow();
	});

	it('sends a text message and returns the reply', async () => {
		respond(fetchMock, chatbotRun);

		const result = await invoke(Chatbots.run, {
			id: 'cb_1a2b3c',
			text: 'When does my order ship?',
		});

		expect(result).toEqual(chatbotRun);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/chatbot/cb_1a2b3c/run');
		expect(sent.body).toEqual({ text: 'When does my order ship?' });
	});

	it('continues a conversation by id', async () => {
		respond(fetchMock, chatbotRun);

		await invoke(Chatbots.run, {
			id: 'cb_1a2b3c',
			text: 'Thanks',
			conversation_id: 'conv_9f8e7d',
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			conversation_id: 'conv_9f8e7d',
		});
	});

	it('accepts base64 audio instead of text', async () => {
		respond(fetchMock, chatbotRun);

		await invoke(Chatbots.run, { id: 'cb_1a2b3c', audio: 'UklGRiQAAABX' });

		expect(lastRequest(fetchMock).body).toMatchObject({
			audio: 'UklGRiQAAABX',
		});
	});

	it('rejects a message with neither text nor audio', async () => {
		await expect(invoke(Chatbots.run, { id: 'cb_1a2b3c' })).rejects.toThrow(
			'A chatbot message needs text or audio.',
		);
	});

	it('rejects a message with both text and audio', async () => {
		await expect(
			invoke(Chatbots.run, {
				id: 'cb_1a2b3c',
				text: 'hi',
				audio: 'UklGRiQAAABX',
			}),
		).rejects.toThrow('Send either text or audio, not both.');
	});

	it('never logs the reply text, which is the user content', async () => {
		respond(fetchMock, chatbotRun);

		await invoke(Chatbots.run, { id: 'cb_1a2b3c', text: 'Hello' });

		// unknown: the log payload is a free-form record; only the two keys below are
		// asserted on, and a stricter type would have to restate every log field.
		const logged = mockLog.mock.calls.at(-1)?.[2] as Record<string, unknown>;
		expect(logged).not.toHaveProperty('output_message');
		expect(logged.replied).toBe(true);
	});
});

describe('transformations', () => {
	const transformationBody = {
		name: 'Order total',
		description: 'Sums the line items',
		function_name: 'total',
		function: 'def total(items):\n    return sum(items)',
		input_schema: { items: 'list[float]' },
		output_schema: { total: 'float' },
	};

	it('creates one from a Python function', async () => {
		respond(fetchMock, transformationCreated);

		const result = await invoke(Transformations.create, transformationBody);

		expect(result).toEqual(transformationCreated);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/transformation');
		expect(sent.body).toMatchObject({ function_name: 'total' });
	});

	it('requires both schemas', async () => {
		const { output_schema: _out, ...withoutOutput } = transformationBody;
		await expect(
			invoke(Transformations.create, withoutOutput),
		).rejects.toThrow();
	});

	it('runs one with its arguments', async () => {
		respond(fetchMock, transformationRun);

		const result = await invoke(Transformations.run, {
			id: 'tr_5e6f7a',
			inputs: { items: [19.5, 22.5] },
		});

		expect(result).toEqual(transformationRun);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/transformation/tr_5e6f7a/run');
		expect(sent.body).toEqual({ inputs: { items: [19.5, 22.5] } });
	});

	it('requires a pipeline id to run', async () => {
		await expect(
			invoke(Transformations.run, { inputs: { items: [] } }),
		).rejects.toThrow();
	});
});

describe('error surface', () => {
	it('surfaces a bad key as a VectorshiftAPIError', async () => {
		respond(fetchMock, invalidKey, 401);

		// unknown: a promise can reject with any value; the cast below narrows it.
		const error = (await invoke(Pipelines.list, {}).catch(
			(thrown: unknown) => thrown,
		)) as VectorshiftAPIError;

		expect(error).toBeInstanceOf(VectorshiftAPIError);
		expect(error.isAuthError).toBe(true);
	});

	it('logs the operation and safe fields on success', async () => {
		respond(fetchMock, pipelineRun);

		await invoke(Pipelines.run, { id: 'pl_7f3a2b' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'vectorshift.pipelines.run',
			{ id: 'pl_7f3a2b', run: 'run_5b8e1c', outputs: 3 },
			'completed',
		);
	});
});
