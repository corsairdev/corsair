import type { SaperlyEndpoints } from '../index';
import {
	callSaperly,
	callSaperlyRecording,
	idempotencyHeaders,
	omitUndefined,
} from './call';
import {
	CallSchema,
	EndCallInputSchema,
	PlaceCallInputSchema,
	RecordingSchema,
	SaperlyEndpointInputSchemas,
	SaperlyEndpointOutputSchemas,
	TransferCallInputSchema,
} from './types';

export const place: SaperlyEndpoints['placeCall'] = async (ctx, input) => {
	return callSaperly(
		ctx,
		'saperly.calls.place',
		PlaceCallInputSchema,
		CallSchema,
		input,
		(body) => ({
			method: 'POST',
			url: '/calls',
			headers: idempotencyHeaders(body.idempotencyKey),
			body: omitUndefined({
				fromNumberId: body.fromNumberId,
				to: body.to,
				connectionId: body.connectionId,
				instructions: body.instructions,
			}),
		}),
		(body, call) => ({
			callId: call.id,
			fromNumberId: body.fromNumberId,
		}),
	);
};

export const list: SaperlyEndpoints['listCalls'] = async (ctx, input) => {
	return callSaperly(
		ctx,
		'saperly.calls.list',
		SaperlyEndpointInputSchemas.listCalls,
		SaperlyEndpointOutputSchemas.listCalls,
		input,
		() => ({ method: 'GET', url: '/calls' }),
		(_input, calls) => ({ count: calls.length }),
	);
};

export const get: SaperlyEndpoints['getCall'] = async (ctx, input) => {
	return callSaperly(
		ctx,
		'saperly.calls.get',
		SaperlyEndpointInputSchemas.getCall,
		CallSchema,
		input,
		(body) => ({
			method: 'GET',
			url: '/calls/{id}',
			path: { id: body.id },
		}),
		(body) => ({ callId: body.id }),
	);
};

export const end: SaperlyEndpoints['endCall'] = async (ctx, input) => {
	return callSaperly(
		ctx,
		'saperly.calls.end',
		EndCallInputSchema,
		CallSchema,
		input,
		(body) => ({
			method: 'POST',
			url: '/calls/{id}/end',
			path: { id: body.id },
			headers: idempotencyHeaders(body.idempotencyKey),
		}),
		(body, call) => ({ callId: body.id, status: call.status }),
	);
};

export const transfer: SaperlyEndpoints['transferCall'] = async (
	ctx,
	input,
) => {
	return callSaperly(
		ctx,
		'saperly.calls.transfer',
		TransferCallInputSchema,
		CallSchema,
		input,
		(body) => ({
			method: 'POST',
			url: '/calls/{id}/transfer',
			path: { id: body.id },
			headers: idempotencyHeaders(body.idempotencyKey),
			body: { to: body.to },
		}),
		(body) => ({ callId: body.id }),
	);
};

export const recording: SaperlyEndpoints['getRecording'] = async (
	ctx,
	input,
) => {
	return callSaperlyRecording(
		ctx,
		'saperly.calls.recording',
		SaperlyEndpointInputSchemas.getRecording,
		RecordingSchema,
		input,
		(body) => ({
			url: '/calls/{id}/recording',
			path: { id: body.id },
		}),
		(body) => ({ callId: body.id }),
	);
};

export const transcript: SaperlyEndpoints['getTranscript'] = async (
	ctx,
	input,
) => {
	return callSaperly(
		ctx,
		'saperly.calls.transcript',
		SaperlyEndpointInputSchemas.getTranscript,
		SaperlyEndpointOutputSchemas.getTranscript,
		input,
		(body) => ({
			method: 'GET',
			url: '/calls/{id}/transcript',
			path: { id: body.id },
		}),
		(body) => ({ callId: body.id }),
	);
};
