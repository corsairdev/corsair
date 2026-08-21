import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import type { ClockifyEndpoints } from '..';
import { clockifyQuery, makeClockifyRequest } from '../client';
import {
	ClockifyEndpointInputSchemas,
	ClockifyEndpointOutputSchemas,
} from './types';

const CREATE_MAX_ATTEMPTS = 6;

function isRateLimited(error: unknown): error is ApiError {
	return error instanceof ApiError && error.status === 429;
}

function rateLimitDelayMs(error: ApiError, attempt: number): number {
	if (typeof error.retryAfter === 'number' && error.retryAfter >= 0) {
		return error.retryAfter;
	}
	return 2 ** attempt * 1000;
}

async function postTimeEntry(
	workspaceId: string,
	apiKey: string,
	body: Record<string, unknown>,
): Promise<unknown> {
	let lastError: unknown;
	for (let attempt = 0; attempt < CREATE_MAX_ATTEMPTS; attempt++) {
		try {
			return await makeClockifyRequest<unknown>(
				`workspaces/${workspaceId}/time-entries`,
				apiKey,
				{
					method: 'POST',
					body,
					retries: false,
				},
			);
		} catch (error) {
			lastError = error;
			if (!isRateLimited(error) || attempt === CREATE_MAX_ATTEMPTS - 1) {
				throw error;
			}
			await new Promise((resolve) =>
				setTimeout(resolve, rateLimitDelayMs(error, attempt)),
			);
		}
	}
	throw lastError;
}

export const create: ClockifyEndpoints['timeEntriesCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ClockifyEndpointInputSchemas.timeEntriesCreate.parse(input);
	const { workspaceId, ...body } = parsedInput;
	const response = await postTimeEntry(
		workspaceId,
		ctx.key,
		body as Record<string, unknown>,
	);

	const parsed =
		ClockifyEndpointOutputSchemas.timeEntriesCreate.parse(response);
	await logEventFromContext(
		ctx,
		'clockify.timeEntries.create',
		{ ...parsedInput },
		'completed',
	);
	return parsed;
};

export const list: ClockifyEndpoints['timeEntriesList'] = async (
	ctx,
	input,
) => {
	const parsedInput = ClockifyEndpointInputSchemas.timeEntriesList.parse(input);
	const { workspaceId, userId, project, page, pageSize, description } =
		parsedInput;
	const query = clockifyQuery({
		description,
		project,
		page,
		'page-size': pageSize,
	});
	const response = await makeClockifyRequest<unknown>(
		`workspaces/${workspaceId}/user/${userId}/time-entries`,
		ctx.key,
		{
			method: 'GET',
			...(query ? { query } : {}),
		},
	);

	const parsed = ClockifyEndpointOutputSchemas.timeEntriesList.parse(response);
	await logEventFromContext(
		ctx,
		'clockify.timeEntries.list',
		{ ...parsedInput },
		'completed',
	);
	return parsed;
};
