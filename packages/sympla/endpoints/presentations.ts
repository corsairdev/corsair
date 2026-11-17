import type { CorsairEndpoint } from 'corsair/core';
import { pathPart } from '../client';
import type { SymplaContext } from '../context';
import { callSympla, requireKey } from './shared';
import type {
	GetPresentationInput,
	GetPresentationResponse,
	ListPresentationsInput,
	ListPresentationsResponse,
} from './types';
import {
	GetPresentationInputSchema,
	GetPresentationResponseSchema,
	ListPresentationsInputSchema,
	ListPresentationsResponseSchema,
} from './types';

export const listPresentations: CorsairEndpoint<
	SymplaContext,
	ListPresentationsInput,
	ListPresentationsResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = ListPresentationsInputSchema.parse(input);
	const { event_id: _event_id, ...query } = parsed;
	return callSympla(
		ctx,
		'presentations.list',
		{ path: `/events/${pathPart(parsed.event_id)}/presentations`, query },
		ListPresentationsResponseSchema,
		{ event_id: String(parsed.event_id) },
	);
};

export const getPresentation: CorsairEndpoint<
	SymplaContext,
	GetPresentationInput,
	GetPresentationResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = GetPresentationInputSchema.parse(input);
	const {
		event_id: _event_id,
		presentation_id: _presentation_id,
		...query
	} = parsed;
	return callSympla(
		ctx,
		'presentations.get',
		{
			path: `/events/${pathPart(parsed.event_id)}/presentations/${pathPart(parsed.presentation_id)}`,
			query,
		},
		GetPresentationResponseSchema,
		{
			event_id: String(parsed.event_id),
			presentation_id: String(parsed.presentation_id),
		},
	);
};

export const Presentations = {
	list: listPresentations,
	get: getPresentation,
};
