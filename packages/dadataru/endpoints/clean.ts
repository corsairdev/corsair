import { logEventFromContext } from 'corsair/core';
import { makeDadataruRequest } from '../client';
import type { DadataruEndpoints } from '../index';

async function handleClean(
	ctx: any,
	queries: string[],
	endpointPath: string,
	eventName: string,
) {
	const response = await makeDadataruRequest<Record<string, unknown>[]>(
		endpointPath,
		ctx.key,
		{
			method: 'POST',
			body: queries,
			apiType: 'clean',
			secretKey: ctx.options.secret,
		},
	);

	await logEventFromContext(
		ctx,
		eventName,
		{ count: queries.length },
		'completed',
	);
	return { results: response };
}

export const address: DadataruEndpoints['cleanAddress'] = (ctx, input) =>
	handleClean(ctx, input.queries, 'clean/address', 'dadataru.clean.address');

export const birthdate: DadataruEndpoints['cleanBirthdate'] = (ctx, input) =>
	handleClean(
		ctx,
		input.queries,
		'clean/birthdate',
		'dadataru.clean.birthdate',
	);

export const email: DadataruEndpoints['cleanEmail'] = (ctx, input) =>
	handleClean(ctx, input.queries, 'clean/email', 'dadataru.clean.email');

export const name: DadataruEndpoints['cleanName'] = (ctx, input) =>
	handleClean(ctx, input.queries, 'clean/name', 'dadataru.clean.name');

export const passport: DadataruEndpoints['cleanPassport'] = (ctx, input) =>
	handleClean(ctx, input.queries, 'clean/passport', 'dadataru.clean.passport');

export const phone: DadataruEndpoints['cleanPhone'] = (ctx, input) =>
	handleClean(ctx, input.queries, 'clean/phone', 'dadataru.clean.phone');

export const vehicle: DadataruEndpoints['cleanVehicle'] = (ctx, input) =>
	handleClean(ctx, input.queries, 'clean/vehicle', 'dadataru.clean.vehicle');

export const cleanRecord: DadataruEndpoints['cleanRecord'] = async (
	ctx,
	input,
) => {
	const response = await makeDadataruRequest<{
		structure: string[];
		data: Record<string, unknown>[][];
	}>('clean', ctx.key, {
		method: 'POST',
		body: {
			structure: input.structure,
			data: input.data,
		},
		apiType: 'clean',
		secretKey: ctx.options.secret,
	});

	await logEventFromContext(
		ctx,
		'dadataru.clean.record',
		{ fields: input.structure },
		'completed',
	);
	return response;
};
