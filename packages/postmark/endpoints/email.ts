import type { PostmarkEndpoints } from '..';
import { asKey, call } from './call';
import {
	PostmarkEndpointInputSchemas as Inputs,
	PostmarkEndpointOutputSchemas as Outputs,
} from './types';

export const send: PostmarkEndpoints['emailSend'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'email.send',
			input: Inputs.emailSend,
			output: Outputs.emailSend,
		},
		input,
		(body) => ({ method: 'POST', path: '/email', body }),
		{
			// The route answers the result object directly.
			shape: asKey('message'),
			log: (_, result) => ({
				messageId: result.message.MessageID ?? undefined,
				errorCode: result.message.ErrorCode ?? undefined,
			}),
		},
	);

export const sendBatch: PostmarkEndpoints['emailSendBatch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'email.sendBatch',
			input: Inputs.emailSendBatch,
			output: Outputs.emailSendBatch,
		},
		input,
		({ Messages }) => ({
			method: 'POST',
			path: '/email/batch',
			body: Messages,
		}),
		{
			// A batch answers a bare array of per-message results, inside an
			// HTTP 200 even when some messages failed, so the codes are counted.
			shape: asKey('results'),
			log: (_, result) => ({
				count: result.results.length,
				failed: result.results.filter(
					(entry) => entry.ErrorCode !== undefined && entry.ErrorCode !== 0,
				).length,
			}),
		},
	);
