import type { CorsairEndpoint } from 'corsair/core';
import { pathPart } from '../client';
import type { DraftableContext } from '../context';
import { callDraftable, requireKey } from './shared';
import type {
	CreateExportInput,
	CreateExportResponse,
	GetExportInput,
	GetExportResponse,
} from './types';
import {
	CreateExportInputSchema,
	CreateExportResponseSchema,
	GetExportInputSchema,
	GetExportResponseSchema,
} from './types';

export const createExport: CorsairEndpoint<
	DraftableContext,
	CreateExportInput,
	CreateExportResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = CreateExportInputSchema.parse(input);
	return callDraftable(
		ctx,
		'exports.create',
		{ method: 'POST', path: '/exports', body: parsed },
		CreateExportResponseSchema,
		{ comparison: parsed.comparison },
	);
};

export const getExport: CorsairEndpoint<
	DraftableContext,
	GetExportInput,
	GetExportResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = GetExportInputSchema.parse(input);
	return callDraftable(
		ctx,
		'exports.get',
		{ path: `/exports/${pathPart(parsed.identifier)}` },
		GetExportResponseSchema,
		{ identifier: parsed.identifier },
	);
};

export const Exports = { create: createExport, get: getExport };
