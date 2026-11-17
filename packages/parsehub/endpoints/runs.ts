import type { CorsairEndpoint } from 'corsair/core';
import { pathPart } from '../client';
import type { ParsehubContext } from '../context';
import { callParsehub, requireKey } from './shared';
import type {
	CancelRunInput,
	CancelRunResponse,
	DeleteRunInput,
	DeleteRunResponse,
	GetRunDataInput,
	GetRunDataResponse,
	GetRunInput,
	GetRunResponse,
} from './types';
import {
	CancelRunInputSchema,
	CancelRunResponseSchema,
	DeleteRunInputSchema,
	DeleteRunResponseSchema,
	GetRunDataInputSchema,
	GetRunDataResponseSchema,
	GetRunInputSchema,
	GetRunResponseSchema,
} from './types';

const runPath = (runToken: string) => `/runs/${pathPart(runToken)}`;

export const getRun: CorsairEndpoint<
	ParsehubContext,
	GetRunInput,
	GetRunResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = GetRunInputSchema.parse(input);
	return callParsehub(
		ctx,
		'runs.get',
		{ path: runPath(parsed.run_token) },
		GetRunResponseSchema,
		{ run_token: parsed.run_token },
	);
};

export const getRunData: CorsairEndpoint<
	ParsehubContext,
	GetRunDataInput,
	GetRunDataResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = GetRunDataInputSchema.parse(input);
	return callParsehub(
		ctx,
		'runs.getData',
		{
			path: `${runPath(parsed.run_token)}/data`,
			query: { format: parsed.format },
		},
		GetRunDataResponseSchema,
		{ run_token: parsed.run_token },
	);
};

export const cancelRun: CorsairEndpoint<
	ParsehubContext,
	CancelRunInput,
	CancelRunResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = CancelRunInputSchema.parse(input);
	return callParsehub(
		ctx,
		'runs.cancel',
		{ method: 'POST', path: `${runPath(parsed.run_token)}/cancel`, form: {} },
		CancelRunResponseSchema,
		{ run_token: parsed.run_token },
	);
};

export const deleteRun: CorsairEndpoint<
	ParsehubContext,
	DeleteRunInput,
	DeleteRunResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = DeleteRunInputSchema.parse(input);
	return callParsehub(
		ctx,
		'runs.delete',
		{ method: 'DELETE', path: runPath(parsed.run_token) },
		DeleteRunResponseSchema,
		{ run_token: parsed.run_token },
	);
};

export const Runs = {
	get: getRun,
	getData: getRunData,
	cancel: cancelRun,
	delete: deleteRun,
};
