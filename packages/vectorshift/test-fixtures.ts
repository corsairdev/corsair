// Response bodies built from the OpenAPI documents shipped in
// https://docs.vectorshift.ai/api-reference, with made-up ids and values.
// They were not captured from the live API.

export const pipelines = {
	status: 'success',
	object_ids: ['pl_7f3a2b', 'pl_9c1d4e'],
};

export const pipelinesVerbose = {
	...pipelines,
	objects: [
		{ id: 'pl_7f3a2b', name: 'Support triage', version: '1.2.0' },
		{ id: 'pl_9c1d4e', name: 'Invoice extraction', version: '2.0.1' },
	],
};

export const pipelineRun = {
	status: 'success',
	run_id: 'run_5b8e1c',
	outputs: {
		answer: 'Your refund is on its way.',
		confidence: 0.94,
		sources: ['kb_doc_1', 'kb_doc_2'],
	},
};

/** A file output is one of the documented DataType variants. */
export const pipelineRunWithFile = {
	status: 'success',
	run_id: 'run_5b8e1c',
	outputs: {
		report: {
			type: 'file',
			raw_bytes: 'JVBERi0xLjQK',
			metadata: { name: 'report.pdf', mime_type: 'application/pdf' },
		},
	},
};

export const pipelineBulkRun = {
	status: 'success',
	run_outputs: [
		{ run_id: 'run_1', outputs: { answer: 'First' } },
		{ run_id: 'run_2', outputs: { answer: 'Second' } },
	],
};

export const pipelineCreated = { status: 'success', id: 'pl_new01' };

export const knowledgeBaseCreated = { status: 'success', id: 'kb_4d2f9a' };

export const knowledgeBase = {
	status: 'success',
	object: {
		id: 'kb_4d2f9a',
		name: 'Product docs',
		description: 'Everything from the help centre',
		chunk_size: 1000,
		chunk_overlap: 200,
	},
};

export const knowledgeBaseQuery = {
	status: 'success',
	result: {
		answer: 'You can reset your password from the settings page.',
		documents: [{ content: 'Open Settings, then Security.', score: 0.88 }],
	},
};

export const chatbotCreated = { status: 'success', id: 'cb_1a2b3c' };

export const chatbotRun = {
	status: 'success',
	conversation_id: 'conv_9f8e7d',
	output_message: 'Your order ships on Friday.',
	follow_up_questions: ['Where is my order?', 'Can I change the address?'],
};

/** A run that reports failure inside a 200. */
export const failedRun = {
	status: 'failed',
	error: 'Pipeline node "llm" raised: rate limited',
};

/** A failure with no reason given. */
export const failedWithoutReason = { status: 'failed' };

export const transformationCreated = { status: 'success', id: 'tr_5e6f7a' };

export const transformationRun = {
	status: 'success',
	result: { total: 42, currency: 'EUR' },
};

/** The error bodies the API sends. */
export const missingHeader = { error: 'Missing authorization header' };

export const badHeaderFormat = { error: 'Invalid authorization header format' };

export const invalidKey = {
	error: 'Invalid API key: failed to parse API key: invalid API key format',
};

export const badRequest = { error: 'Pipeline not found' };

export const rateLimited = { error: 'Too many requests' };
