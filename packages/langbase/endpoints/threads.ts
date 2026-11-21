import { makeLangbaseRequest } from '../client';
import type { LangbasePluginContext } from '../index';
import type {
	AppendThreadMessagesInput,
	AppendThreadMessagesOutput,
	CreateThreadInput,
	CreateThreadOutput,
	DeleteThreadInput,
	DeleteThreadOutput,
	GetThreadInput,
	GetThreadOutput,
	ListThreadMessagesInput,
	ListThreadMessagesOutput,
	UpdateThreadInput,
	UpdateThreadOutput,
} from './types';
import {
	AppendThreadMessagesOutputSchema,
	CreateThreadOutputSchema,
	DeleteThreadOutputSchema,
	GetThreadOutputSchema,
	LangbaseEndpointInputSchemas,
	ListThreadMessagesOutputSchema,
	UpdateThreadOutputSchema,
} from './types';

export const threads = {
	create: async (
		ctx: LangbasePluginContext,
		input: CreateThreadInput,
	): Promise<CreateThreadOutput> => {
		const parsedInput =
			LangbaseEndpointInputSchemas['threads.create'].parse(input);
		// `unknown` because the provider response is untrusted until parsed below.
		const raw = await makeLangbaseRequest<unknown>('/threads', ctx.key, {
			method: 'POST',
			body: parsedInput,
		});
		return CreateThreadOutputSchema.parse(raw);
	},

	get: async (
		ctx: LangbasePluginContext,
		input: GetThreadInput,
	): Promise<GetThreadOutput> => {
		const parsedInput =
			LangbaseEndpointInputSchemas['threads.get'].parse(input);
		const path = `/threads/${encodeURIComponent(parsedInput.threadId)}`;
		// `unknown` because the provider response is untrusted until parsed below.
		const raw = await makeLangbaseRequest<unknown>(path, ctx.key, {
			method: 'GET',
		});
		return GetThreadOutputSchema.parse(raw);
	},

	update: async (
		ctx: LangbasePluginContext,
		input: UpdateThreadInput,
	): Promise<UpdateThreadOutput> => {
		const parsedInput =
			LangbaseEndpointInputSchemas['threads.update'].parse(input);
		const path = `/threads/${encodeURIComponent(parsedInput.threadId)}`;
		// `unknown` because the provider response is untrusted until parsed below.
		const raw = await makeLangbaseRequest<unknown>(path, ctx.key, {
			method: 'POST',
			body: { metadata: parsedInput.metadata },
		});
		return UpdateThreadOutputSchema.parse(raw);
	},

	delete: async (
		ctx: LangbasePluginContext,
		input: DeleteThreadInput,
	): Promise<DeleteThreadOutput> => {
		const parsedInput =
			LangbaseEndpointInputSchemas['threads.delete'].parse(input);
		const path = `/threads/${encodeURIComponent(parsedInput.threadId)}`;
		// `unknown` because the provider response is untrusted until parsed below.
		const raw = await makeLangbaseRequest<unknown>(path, ctx.key, {
			method: 'DELETE',
		});
		return DeleteThreadOutputSchema.parse(raw);
	},

	appendMessages: async (
		ctx: LangbasePluginContext,
		input: AppendThreadMessagesInput,
	): Promise<AppendThreadMessagesOutput> => {
		const parsedInput =
			LangbaseEndpointInputSchemas['threads.appendMessages'].parse(input);
		const path = `/threads/${encodeURIComponent(parsedInput.threadId)}/messages`;
		// `unknown` because the provider response is untrusted until parsed below.
		const raw = await makeLangbaseRequest<unknown>(path, ctx.key, {
			method: 'POST',
			body: parsedInput.messages,
		});
		return AppendThreadMessagesOutputSchema.parse(raw);
	},

	listMessages: async (
		ctx: LangbasePluginContext,
		input: ListThreadMessagesInput,
	): Promise<ListThreadMessagesOutput> => {
		const parsedInput =
			LangbaseEndpointInputSchemas['threads.listMessages'].parse(input);
		const path = `/threads/${encodeURIComponent(parsedInput.threadId)}/messages`;
		// `unknown` because the provider response is untrusted until parsed below.
		const raw = await makeLangbaseRequest<unknown>(path, ctx.key, {
			method: 'GET',
		});
		return ListThreadMessagesOutputSchema.parse(raw);
	},
};
