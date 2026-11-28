import type { DocuSealEndpoints } from '..';
import { call } from './call';
import {
	DocuSealEndpointInputSchemas as Inputs,
	DocuSealEndpointOutputSchemas as Outputs,
} from './types';

// Routes DocuSeal serves beside the published spec (see endpoints/types.ts).

export const me: DocuSealEndpoints['usersMe'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'users.me', input: Inputs.usersMe, output: Outputs.usersMe },
		input,
		() => ({ method: 'GET', path: '/user' }),
		{ log: (_, result) => ({ userId: result.id }) },
	);

export const listFormCompleted: DocuSealEndpoints['eventsListFormCompleted'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'events.listFormCompleted',
			input: Inputs.eventsListFormCompleted,
			output: Outputs.eventsListFormCompleted,
		},
		input,
		({ limit, after, before }) => ({
			method: 'GET',
			path: '/events/form/completed',
			query: { limit, after, before },
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const listSubmissionCompleted: DocuSealEndpoints['eventsListSubmissionCompleted'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'events.listSubmissionCompleted',
				input: Inputs.eventsListSubmissionCompleted,
				output: Outputs.eventsListSubmissionCompleted,
			},
			input,
			({ limit, after, before }) => ({
				method: 'GET',
				path: '/events/submission/completed',
				query: { limit, after, before },
			}),
			{ log: (_, result) => ({ count: result.data.length }) },
		);

export const mergePdfs: DocuSealEndpoints['toolsMergePdfs'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tools.mergePdfs',
			input: Inputs.toolsMergePdfs,
			output: Outputs.toolsMergePdfs,
		},
		input,
		({ files }) => ({ method: 'POST', path: '/tools/merge', body: { files } }),
		{ log: ({ files }) => ({ files: files.length }) },
	);

export const verifyPdf: DocuSealEndpoints['toolsVerifyPdf'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tools.verifyPdf',
			input: Inputs.toolsVerifyPdf,
			output: Outputs.toolsVerifyPdf,
		},
		input,
		({ file }) => ({ method: 'POST', path: '/tools/verify', body: { file } }),
		{
			log: (_, result) => ({
				checksum: result.checksum_status,
				signatures: result.signatures.length,
			}),
		},
	);
