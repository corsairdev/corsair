import type { CeligoEndpoints } from '../index';
import { callCeligo } from './call';
import {
	CeligoEndpointInputSchemas as In,
	CeligoEndpointOutputSchemas as Out,
} from './types';

export const parseCsv: CeligoEndpoints['processorsParseCsv'] = (ctx, input) =>
	callCeligo(
		ctx,
		'processors.parseCsv',
		In.processorsParseCsv,
		Out.processorsParseCsv,
		input,
		(i) => ({
			method: 'POST',
			path: ['processors', 'csvParser'],
			body: i,
		}),
	);

export const parseXml: CeligoEndpoints['processorsParseXml'] = (ctx, input) =>
	callCeligo(
		ctx,
		'processors.parseXml',
		In.processorsParseXml,
		Out.processorsParseXml,
		input,
		(i) => ({
			method: 'POST',
			path: ['processors', 'xmlParser'],
			body: i,
		}),
	);

export const parseStructuredFile: CeligoEndpoints['processorsParseStructuredFile'] =
	(ctx, input) =>
		callCeligo(
			ctx,
			'processors.parseStructuredFile',
			In.processorsParseStructuredFile,
			Out.processorsParseStructuredFile,
			input,
			(i) => ({
				method: 'POST',
				path: ['processors', 'structuredFileParser'],
				body: i,
			}),
		);

export const generateStructuredFile: CeligoEndpoints['processorsGenerateStructuredFile'] =
	(ctx, input) =>
		callCeligo(
			ctx,
			'processors.generateStructuredFile',
			In.processorsGenerateStructuredFile,
			Out.processorsGenerateStructuredFile,
			input,
			(i) => ({
				method: 'POST',
				path: ['processors', 'structuredFileGenerator'],
				body: i,
			}),
		);
