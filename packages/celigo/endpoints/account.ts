import type { CeligoEndpoints } from '../index';
import { callCeligo } from './call';
import {
	CeligoEndpointInputSchemas as In,
	CeligoEndpointOutputSchemas as Out,
} from './types';

export const getTokenInfo: CeligoEndpoints['accountGetTokenInfo'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'account.getTokenInfo',
		In.accountGetTokenInfo,
		Out.accountGetTokenInfo,
		input,
		() => ({
			method: 'GET',
			path: ['tokenInfo'],
		}),
	);

export const listLicenses: CeligoEndpoints['accountListLicenses'] = (
	ctx,
	input,
) =>
	callCeligo(
		ctx,
		'account.listLicenses',
		In.accountListLicenses,
		Out.accountListLicenses,
		input,
		(i) => ({
			method: 'GET',
			path: ['licenses'],
			query: { type: i.type },
			empty: [],
		}),
	);
