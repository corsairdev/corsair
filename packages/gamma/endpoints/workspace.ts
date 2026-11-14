import type { GammaEndpoints } from '..';
import { definedQuery } from '../client';
import { call } from './call';
import {
	GammaEndpointInputSchemas as Inputs,
	GammaEndpointOutputSchemas as Outputs,
} from './types';

export const themes: GammaEndpoints['themesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'themes.list',
			input: Inputs.themesList,
			output: Outputs.themesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1.0/themes',
			query: definedQuery({ ...parsed }),
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				more: result.hasMore ?? false,
			}),
		},
	);

export const folders: GammaEndpoints['foldersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.list',
			input: Inputs.foldersList,
			output: Outputs.foldersList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1.0/folders',
			query: definedQuery({ ...parsed }),
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				more: result.hasMore ?? false,
			}),
		},
	);
