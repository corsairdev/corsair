import type { ShotstackEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import type { MediaProbeInput } from './types';
import {
	ShotstackEndpointInputSchemas,
	ShotstackEndpointOutputSchemas,
} from './types';

export const probe: ShotstackEndpoints['mediaProbe'] = async (
	ctx,
	rawInput,
) => {
	return call(
		ctx,
		{
			event: 'media.probe',
			input: ShotstackEndpointInputSchemas.mediaProbe,
			output: ShotstackEndpointOutputSchemas.mediaProbe,
		},
		rawInput,
		(input: MediaProbeInput) => ({
			method: 'GET',
			service: 'edit',
			path: `/probe/${segment(input.url)}`,
			errorPath: '/probe/{url}',
		}),
	);
};
