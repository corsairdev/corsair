import type { SignpathEndpoints } from '..';
import { segment } from '../client';
import { call, orgPath } from './shared';
import {
	SignpathEndpointInputSchemas as Inputs,
	SignpathEndpointOutputSchemas as Outputs,
} from './types';

export const list: SignpathEndpoints['certificatesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'certificates.list',
			input: Inputs.certificatesList,
			output: Outputs.certificatesList,
		},
		input,
		(_, organizationId) => ({
			method: 'GET',
			path: orgPath(organizationId, '/Certificates'),
		}),
		{
			shape: (raw) => {
				if (!Array.isArray(raw)) {
					throw new Error(
						'certificates.list expected an array of certificates from SignPath.',
					);
				}
				return { certificates: raw };
			},
			log: (_, result) => ({ count: result.certificates.length }),
		},
	);

export const get: SignpathEndpoints['certificatesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'certificates.get',
			input: Inputs.certificatesGet,
			output: Outputs.certificatesGet,
		},
		input,
		({ certificateSlug }, organizationId) => ({
			method: 'GET',
			path: orgPath(
				organizationId,
				`/Certificates/${segment(certificateSlug)}`,
			),
		}),
		{
			log: ({ certificateSlug }) => ({ certificateSlug }),
		},
	);
