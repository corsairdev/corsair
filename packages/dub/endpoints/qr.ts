import type { DubEndpoints } from '..';
import { call } from './call';
import {
	DubEndpointInputSchemas as Inputs,
	DubEndpointOutputSchemas as Outputs,
} from './types';

export const get: DubEndpoints['qrGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'qr.get',
			input: Inputs.qrGet,
			output: Outputs.qrGet,
		},
		input,
		({ url, size, level, fgColor, bgColor, margin }) => ({
			method: 'GET',
			path: '/qr',
			query: {
				url,
				size,
				level,
				fgColor,
				bgColor,
				margin,
				// PNG answers binary, which corsair/http would hand back as a
				// mangled text string, so the request is pinned to SVG.
				format: 'svg',
			},
		}),
		{
			// The answer is the SVG document itself, not JSON. Only a body that
			// actually looks like SVG is wrapped; anything else (an HTML error
			// page, a proxy notice) passes through so the output schema rejects
			// it loudly instead of reporting a QR code that is not one.
			shape: (raw) =>
				typeof raw === 'string' && raw.trimStart().startsWith('<svg')
					? { svg: raw }
					: raw,
			log: ({ url }) => ({ urlLength: url.length }),
		},
	);
