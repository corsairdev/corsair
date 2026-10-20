import type { CeligoEndpoints } from '../index';
import { callCeligo } from './call';
import {
	CeligoEndpointInputSchemas as In,
	CeligoEndpointOutputSchemas as Out,
} from './types';

export const list: CeligoEndpoints['ediProfilesList'] = (ctx, input) =>
	callCeligo(
		ctx,
		'ediProfiles.list',
		In.ediProfilesList,
		Out.ediProfilesList,
		input,
		() => ({
			method: 'GET',
			path: ['ediprofiles'],
			empty: [],
		}),
	);
