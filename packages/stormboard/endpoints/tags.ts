import type { StormboardEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	StormboardEndpointInputSchemas as Inputs,
	StormboardEndpointOutputSchemas as Outputs,
} from './types';

export const createForStorm: StormboardEndpoints['tagsCreateForStorm'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'tags.createForStorm',
			input: Inputs.tagsCreateForStorm,
			output: Outputs.tagsCreateForStorm,
		},
		input,
		({ stormId, name }) => ({
			method: 'POST',
			path: `/storms/${segment(stormId)}/tags`,
			body: { name },
		}),
	);

export const createForIdea: StormboardEndpoints['tagsCreateForIdea'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'tags.createForIdea',
			input: Inputs.tagsCreateForIdea,
			output: Outputs.tagsCreateForIdea,
		},
		input,
		({ ideaId, data }) => ({
			method: 'POST',
			path: `/ideas/${segment(ideaId)}/tags`,
			body: { data },
		}),
	);

export const listForStorm: StormboardEndpoints['tagsListForStorm'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'tags.listForStorm',
			input: Inputs.tagsListForStorm,
			output: Outputs.tagsListForStorm,
		},
		input,
		({ stormId }) => ({
			method: 'GET',
			path: `/storms/${segment(stormId)}/tags`,
		}),
		{
			log: (_, result) => ({ count: result.tags.length }),
		},
	);

export const getForIdea: StormboardEndpoints['tagsGetForIdea'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.getForIdea',
			input: Inputs.tagsGetForIdea,
			output: Outputs.tagsGetForIdea,
		},
		input,
		({ ideaId }) => ({
			method: 'GET',
			path: `/ideas/${segment(ideaId)}/tags`,
		}),
	);
