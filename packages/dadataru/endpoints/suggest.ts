import { logEventFromContext } from 'corsair/core';
import { makeDadataruRequest } from '../client';
import type { DadataruEndpoints } from '../index';

async function handleSuggest(
	ctx: any,
	query: string,
	count: number | undefined,
	endpointPath: string,
	eventName: string,
) {
	const response = await makeDadataruRequest<any>(endpointPath, ctx.key, {
		method: 'POST',
		body: {
			query: query,
			count: count ?? 5,
		},
		apiType: 'suggest',
	});

	await logEventFromContext(ctx, eventName, { query }, 'completed');
	return response;
}

export const address: DadataruEndpoints['suggestAddress'] = (ctx, input) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/address',
		'dadataru.suggest.address',
	);

export const bank: DadataruEndpoints['suggestBank'] = (ctx, input) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/bank',
		'dadataru.suggest.bank',
	);

export const partyBy: DadataruEndpoints['suggestPartyBy'] = (ctx, input) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/party',
		'dadataru.suggest.partyBy',
	);

export const carBrand: DadataruEndpoints['suggestCarBrand'] = (ctx, input) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/car_brand',
		'dadataru.suggest.carBrand',
	);

export const country: DadataruEndpoints['suggestCountry'] = (ctx, input) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/country',
		'dadataru.suggest.country',
	);

export const court: DadataruEndpoints['suggestCourt'] = (ctx, input) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/court',
		'dadataru.suggest.court',
	);

export const currency: DadataruEndpoints['suggestCurrency'] = (ctx, input) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/currency',
		'dadataru.suggest.currency',
	);

export const email: DadataruEndpoints['suggestEmail'] = (ctx, input) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/email',
		'dadataru.suggest.email',
	);

export const fias: DadataruEndpoints['suggestFias'] = (ctx, input) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/fias',
		'dadataru.suggest.fias',
	);

export const fmsUnit: DadataruEndpoints['suggestFmsUnit'] = (ctx, input) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/fms_unit',
		'dadataru.suggest.fmsUnit',
	);

export const fnsUnit: DadataruEndpoints['suggestFnsUnit'] = (ctx, input) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/fns_unit',
		'dadataru.suggest.fnsUnit',
	);

export const ftsUnit: DadataruEndpoints['suggestFtsUnit'] = (ctx, input) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/fts_unit',
		'dadataru.suggest.ftsUnit',
	);

export const partyKz: DadataruEndpoints['suggestPartyKz'] = (ctx, input) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/party',
		'dadataru.suggest.partyKz',
	);

export const mktu: DadataruEndpoints['suggestMktu'] = (ctx, input) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/mktu',
		'dadataru.suggest.mktu',
	);

export const medicalPosition: DadataruEndpoints['suggestMedicalPosition'] = (
	ctx,
	input,
) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/medical_position',
		'dadataru.suggest.medicalPosition',
	);

export const metro: DadataruEndpoints['suggestMetro'] = (ctx, input) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/metro',
		'dadataru.suggest.metro',
	);

export const name: DadataruEndpoints['suggestName'] = (ctx, input) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/fio',
		'dadataru.suggest.name',
	);

export const okpd2: DadataruEndpoints['suggestOkpd2'] = (ctx, input) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/okpd2',
		'dadataru.suggest.okpd2',
	);

export const okpdtrPosition: DadataruEndpoints['suggestOkpdtrPosition'] = (
	ctx,
	input,
) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/okpdtr_position',
		'dadataru.suggest.okpdtrPosition',
	);

export const okpdtrProfession: DadataruEndpoints['suggestOkpdtrProfession'] = (
	ctx,
	input,
) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/okpdtr_profession',
		'dadataru.suggest.okpdtrProfession',
	);

export const oktmo: DadataruEndpoints['suggestOktmo'] = (ctx, input) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/oktmo',
		'dadataru.suggest.oktmo',
	);

export const okved2: DadataruEndpoints['suggestOkved2'] = (ctx, input) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/okved2',
		'dadataru.suggest.okved2',
	);

export const party: DadataruEndpoints['suggestParty'] = (ctx, input) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/party',
		'dadataru.suggest.party',
	);

export const postalOffice: DadataruEndpoints['suggestPostalOffice'] = (
	ctx,
	input,
) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/postal_office',
		'dadataru.suggest.postalOffice',
	);

export const postalUnit: DadataruEndpoints['suggestPostalUnit'] = (
	ctx,
	input,
) =>
	handleSuggest(
		ctx,
		input.query,
		input.count,
		'suggest/postal_unit',
		'dadataru.suggest.postalUnit',
	);
