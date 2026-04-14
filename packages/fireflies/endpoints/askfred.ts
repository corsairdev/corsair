import { logEventFromContext } from 'corsair/core';
import type { FirefliesEndpoints } from '..';
import { makeFirefliesRequest } from '../client';
import type { FirefliesEndpointOutputs } from './types';

// askfred_threads returns AskFredThreadSummary (no messages field)
const THREAD_SUMMARY_FIELDS = `id title transcript_id user_id created_at`;
// askfred_thread returns AskFredThread (has messages field)
const THREAD_FIELDS = `id title transcript_id user_id created_at messages { id thread_id query answer status created_at updated_at }`;

// Fireflies uses snake_case query names: askfred_threads, askfred_thread
const ASK_FRED_THREADS_QUERY = `
  query AskFredThreads($transcript_id: String) {
    askfred_threads(transcript_id: $transcript_id) {
      ${THREAD_SUMMARY_FIELDS}
    }
  }
`;

const ASK_FRED_THREAD_QUERY = `
  query AskFredThread($id: String!) {
    askfred_thread(id: $id) {
      ${THREAD_FIELDS}
    }
  }
`;

const MESSAGE_FIELDS = `id thread_id query answer status created_at updated_at`;

// createAskFredThread takes input: { query, transcript_id }
const CREATE_ASK_FRED_THREAD_MUTATION = `
  mutation CreateAskFredThread($input: CreateAskFredThreadInput!) {
    createAskFredThread(input: $input) {
      message { ${MESSAGE_FIELDS} }
      cost
    }
  }
`;

// continueAskFredThread takes input: { thread_id, query }
const CONTINUE_ASK_FRED_THREAD_MUTATION = `
  mutation ContinueAskFredThread($input: ContinueAskFredThreadInput!) {
    continueAskFredThread(input: $input) {
      message { ${MESSAGE_FIELDS} }
      cost
    }
  }
`;

// deleteAskFredThread returns the deleted AskFredThread
const DELETE_ASK_FRED_THREAD_MUTATION = `
  mutation DeleteAskFredThread($id: String!) {
    deleteAskFredThread(id: $id) {
      ${THREAD_FIELDS}
    }
  }
`;

export const getThreads: FirefliesEndpoints['askFredGetThreads'] = async (
	ctx,
	input,
) => {
	const response = await makeFirefliesRequest<
		FirefliesEndpointOutputs['askFredGetThreads']
	>(ASK_FRED_THREADS_QUERY, ctx.key, { transcript_id: input.transcriptId });

	if (ctx.db.askFredThreads) {
		for (const thread of response.askfred_threads) {
			try {
				await ctx.db.askFredThreads.upsertByEntityId(thread.id, { ...thread });
			} catch (error) {
				console.warn('Failed to save AskFred thread to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'fireflies.askFred.getThreads',
		{ ...input },
		'completed',
	);
	return response;
};

export const getThread: FirefliesEndpoints['askFredGetThread'] = async (
	ctx,
	input,
) => {
	const response = await makeFirefliesRequest<
		FirefliesEndpointOutputs['askFredGetThread']
	>(ASK_FRED_THREAD_QUERY, ctx.key, { id: input.threadId });

	if (ctx.db.askFredThreads && response.askfred_thread) {
		try {
			await ctx.db.askFredThreads.upsertByEntityId(response.askfred_thread.id, {
				...response.askfred_thread,
			});
		} catch (error) {
			console.warn('Failed to save AskFred thread to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'fireflies.askFred.getThread',
		{ ...input },
		'completed',
	);
	return response;
};

export const createThread: FirefliesEndpoints['askFredCreateThread'] = async (
	ctx,
	input,
) => {
	const response = await makeFirefliesRequest<
		FirefliesEndpointOutputs['askFredCreateThread']
	>(CREATE_ASK_FRED_THREAD_MUTATION, ctx.key, {
		input: { transcript_id: input.transcriptId, query: input.query },
	});

	await logEventFromContext(
		ctx,
		'fireflies.askFred.createThread',
		{ ...input },
		'completed',
	);
	return response;
};

export const continueThread: FirefliesEndpoints['askFredContinueThread'] =
	async (ctx, input) => {
		const response = await makeFirefliesRequest<
			FirefliesEndpointOutputs['askFredContinueThread']
		>(CONTINUE_ASK_FRED_THREAD_MUTATION, ctx.key, {
			input: { thread_id: input.threadId, query: input.query },
		});

		await logEventFromContext(
			ctx,
			'fireflies.askFred.continueThread',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteThread: FirefliesEndpoints['askFredDeleteThread'] = async (
	ctx,
	input,
) => {
	const response = await makeFirefliesRequest<
		FirefliesEndpointOutputs['askFredDeleteThread']
	>(DELETE_ASK_FRED_THREAD_MUTATION, ctx.key, { id: input.threadId });

	if (ctx.db.askFredThreads) {
		try {
			await ctx.db.askFredThreads.deleteByEntityId(input.threadId);
		} catch (error) {
			console.warn('Failed to delete AskFred thread from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'fireflies.askFred.deleteThread',
		{ ...input },
		'completed',
	);
	return response;
};
