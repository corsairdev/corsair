import { definePineconeEndpoint } from './factory';

const encode = encodeURIComponent;
const assistantData = {
	surface: 'assistant-data' as const,
	host: (input: { host: string }) => input.host,
};

/** Decodes file content without placing plaintext binary data in JSON payloads. */
function decodeBase64(value: string): Uint8Array {
	try {
		const binary = atob(value);
		return Uint8Array.from(binary, (character) => character.charCodeAt(0));
	} catch {
		throw new Error('fileBase64 must contain valid base64-encoded file data');
	}
}

export const listAssistants = definePineconeEndpoint('listAssistants', {
	method: 'GET',
	path: () => '/assistants',
	surface: 'assistant-control',
	query: ({ limit, paginationToken }) => ({
		limit,
		pagination_token: paginationToken,
	}),
});

export const createAssistant = definePineconeEndpoint('createAssistant', {
	method: 'POST',
	path: () => '/assistants',
	surface: 'assistant-control',
	body: (input) => input,
});

export const getAssistant = definePineconeEndpoint('getAssistant', {
	method: 'GET',
	path: ({ assistantName }) => `/assistants/${encode(assistantName)}`,
	surface: 'assistant-control',
});

export const updateAssistant = definePineconeEndpoint('updateAssistant', {
	method: 'PATCH',
	path: ({ assistantName }) => `/assistants/${encode(assistantName)}`,
	surface: 'assistant-control',
	body: ({ assistantName: _assistantName, ...body }) => body,
});

export const deleteAssistant = definePineconeEndpoint('deleteAssistant', {
	method: 'DELETE',
	path: ({ assistantName }) => `/assistants/${encode(assistantName)}`,
	surface: 'assistant-control',
});

export const listFiles = definePineconeEndpoint('listFiles', {
	...assistantData,
	method: 'GET',
	path: ({ assistantName }) => `/files/${encode(assistantName)}`,
	query: ({ filter, limit, paginationToken }) => ({
		filter,
		limit,
		pagination_token: paginationToken,
	}),
});

export const uploadFile = definePineconeEndpoint('uploadFile', {
	...assistantData,
	method: 'POST',
	path: ({ assistantName }) => `/files/${encode(assistantName)}`,
	query: ({ multimodal }) => ({ multimodal }),
	body: ({ fileBase64, fileName, contentType, metadata }) => {
		const form = new FormData();
		form.append(
			'file',
			new Blob([decodeBase64(fileBase64)], {
				type: contentType ?? 'application/octet-stream',
			}),
			fileName,
		);
		if (metadata) form.append('metadata', JSON.stringify(metadata));
		return form;
	},
});

export const describeFile = definePineconeEndpoint('describeFile', {
	...assistantData,
	method: 'GET',
	path: ({ assistantName, fileId }) =>
		`/files/${encode(assistantName)}/${encode(fileId)}`,
	query: ({ includeUrl }) => ({ include_url: includeUrl }),
});

export const deleteFile = definePineconeEndpoint('deleteFile', {
	...assistantData,
	method: 'DELETE',
	path: ({ assistantName, fileId }) =>
		`/files/${encode(assistantName)}/${encode(fileId)}`,
});

export const chatAssistant = definePineconeEndpoint('chatAssistant', {
	...assistantData,
	method: 'POST',
	path: ({ assistantName }) => `/chat/${encode(assistantName)}`,
	body: ({ host: _host, assistantName: _assistantName, ...body }) => body,
});

export const chatCompletionAssistant = definePineconeEndpoint(
	'chatCompletionAssistant',
	{
		...assistantData,
		method: 'POST',
		path: ({ assistantName }) =>
			`/chat/${encode(assistantName)}/chat/completions`,
		body: ({ host: _host, assistantName: _assistantName, ...body }) => body,
	},
);

export const retrieveContext = definePineconeEndpoint('retrieveContext', {
	...assistantData,
	method: 'POST',
	path: ({ assistantName }) => `/chat/${encode(assistantName)}/context`,
	body: ({ host: _host, assistantName: _assistantName, ...body }) => body,
});
