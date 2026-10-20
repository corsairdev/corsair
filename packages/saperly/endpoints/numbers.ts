import type { SaperlyEndpoints } from '../index';
import { callSaperly, idempotencyHeaders, omitUndefined } from './call';
import {
	AssignConnectionInputSchema,
	PhoneNumberSchema,
	ProvisionNumberInputSchema,
	ReleaseNumberInputSchema,
	SaperlyEndpointInputSchemas,
	SaperlyEndpointOutputSchemas,
	SetCallerIdInputSchema,
	SetSmsSenderInputSchema,
	SetWebhookInputSchema,
	StatusSchema,
} from './types';

export const list: SaperlyEndpoints['listNumbers'] = async (ctx, input) => {
	return callSaperly(
		ctx,
		'saperly.numbers.list',
		SaperlyEndpointInputSchemas.listNumbers,
		SaperlyEndpointOutputSchemas.listNumbers,
		input,
		() => ({ method: 'GET', url: '/numbers' }),
		(_input, numbers) => ({ count: numbers.length }),
	);
};

export const provision: SaperlyEndpoints['provisionNumber'] = async (
	ctx,
	input,
) => {
	return callSaperly(
		ctx,
		'saperly.numbers.provision',
		ProvisionNumberInputSchema,
		PhoneNumberSchema,
		input,
		(body) => ({
			method: 'POST',
			url: '/numbers',
			headers: idempotencyHeaders(body.idempotencyKey),
			body: omitUndefined({
				country: body.country,
				numberType: body.numberType,
				areaCode: body.areaCode,
				expectedMonthlyPriceCents: body.expectedMonthlyPriceCents,
				expectedUpfrontPriceCents: body.expectedUpfrontPriceCents,
				approveHigherPrice: body.approveHigherPrice,
			}),
		}),
		(body, number) => ({
			numberId: number.id,
			country: body.country ?? null,
		}),
	);
};

export const get: SaperlyEndpoints['getNumber'] = async (ctx, input) => {
	return callSaperly(
		ctx,
		'saperly.numbers.get',
		SaperlyEndpointInputSchemas.getNumber,
		PhoneNumberSchema,
		input,
		(body) => ({
			method: 'GET',
			url: '/numbers/{id}',
			path: { id: body.id },
		}),
		(body) => ({ numberId: body.id }),
	);
};

export const release: SaperlyEndpoints['releaseNumber'] = async (
	ctx,
	input,
) => {
	return callSaperly(
		ctx,
		'saperly.numbers.release',
		ReleaseNumberInputSchema,
		StatusSchema,
		input,
		(body) => ({
			method: 'POST',
			url: '/numbers/{id}/release',
			path: { id: body.id },
			headers: idempotencyHeaders(body.idempotencyKey),
		}),
		(body, result) => ({ numberId: body.id, status: result.status }),
	);
};

export const assignConnection: SaperlyEndpoints['assignConnection'] = async (
	ctx,
	input,
) => {
	return callSaperly(
		ctx,
		'saperly.numbers.assignConnection',
		AssignConnectionInputSchema,
		PhoneNumberSchema,
		input,
		(body) => ({
			method: 'POST',
			url: '/numbers/{id}/connection',
			path: { id: body.id },
			headers: idempotencyHeaders(body.idempotencyKey),
			body: { connectionId: body.connectionId },
		}),
		(body) => ({ numberId: body.id, connectionId: body.connectionId }),
	);
};

export const setWebhook: SaperlyEndpoints['setNumberWebhook'] = async (
	ctx,
	input,
) => {
	return callSaperly(
		ctx,
		'saperly.numbers.setWebhook',
		SetWebhookInputSchema,
		PhoneNumberSchema,
		input,
		(body) => ({
			method: 'POST',
			url: '/numbers/{id}/webhook',
			path: { id: body.id },
			headers: idempotencyHeaders(body.idempotencyKey),
			body: { url: body.url },
		}),
		(body) => ({ numberId: body.id }),
	);
};

export const setSmsSender: SaperlyEndpoints['setSmsSender'] = async (
	ctx,
	input,
) => {
	return callSaperly(
		ctx,
		'saperly.numbers.setSmsSender',
		SetSmsSenderInputSchema,
		PhoneNumberSchema,
		input,
		(body) => ({
			method: 'POST',
			url: '/numbers/{id}/sms-sender',
			path: { id: body.id },
			headers: idempotencyHeaders(body.idempotencyKey),
			body: { smsSenderId: body.smsSenderId },
		}),
		(body) => ({ numberId: body.id }),
	);
};

export const setCallerId: SaperlyEndpoints['setCallerId'] = async (
	ctx,
	input,
) => {
	return callSaperly(
		ctx,
		'saperly.numbers.setCallerId',
		SetCallerIdInputSchema,
		PhoneNumberSchema,
		input,
		(body) => ({
			method: 'POST',
			url: '/numbers/{id}/caller-id',
			path: { id: body.id },
			headers: idempotencyHeaders(body.idempotencyKey),
			body: { callerIdName: body.callerIdName },
		}),
		(body) => ({ numberId: body.id }),
	);
};
