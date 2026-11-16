import type { MailssoEndpoints } from '..';
import { readJobInProgress, segment } from '../client';
import { call } from './call';
import {
	MailssoEndpointInputSchemas as Inputs,
	MailssoSingleEnvelopeSchema,
	MailssoEndpointOutputSchemas as Outputs,
} from './types';

export const single: MailssoEndpoints['validationsSingle'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'validations.single',
			input: Inputs.validationsSingle,
			output: Outputs.validationsSingle,
		},
		input,
		({ email }) => ({
			method: 'GET',
			path: '/v1/validate',
			query: { email },
		}),
		{
			// The answer is `{ data, error }`; the result is the `data` object.
			shape: (raw) => MailssoSingleEnvelopeSchema.parse(raw).data,
			log: ({ result, reason, score }) => ({
				result,
				reason: reason ?? undefined,
				score: score ?? undefined,
			}),
		},
	);

// POST /v1/batch starts an asynchronous job and answers a bare job object
// (no `{ data, error }` envelope) with no results. The results are read with
// validations.getBatch.
export const batch: MailssoEndpoints['validationsBatch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'validations.batch',
			input: Inputs.validationsBatch,
			output: Outputs.validationsBatch,
		},
		input,
		({ emails }) => ({
			method: 'POST',
			path: '/v1/batch',
			body: { emails },
		}),
		{
			log: ({ id, size, status }) => ({
				batchId: id,
				size,
				status: status ?? undefined,
			}),
		},
	);

export const getBatch: MailssoEndpoints['validationsGetBatch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'validations.getBatch',
			input: Inputs.validationsGetBatch,
			output: Outputs.validationsGetBatch,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/v1/batch/${segment(id)}`,
			allowInProgress: true,
		}),
		{
			// A running job answers 202 with its id, created_at and status
			// 'processing' under `data`; a finished one is the bare job.
			shape: (raw) => readJobInProgress(raw) ?? raw,
			log: ({ id, status, size }) => ({
				batchId: id,
				status,
				size: size ?? undefined,
			}),
		},
	);
