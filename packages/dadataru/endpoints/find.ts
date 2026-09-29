import { logEventFromContext } from 'corsair/core';
import { makeDadataruRequest } from '../client';
import type { DadataruContext, DadataruEndpoints } from '../index';
import type { SuggestResponse } from './types';

async function handleFind(
	ctx: DadataruContext,
	query: string,
	count: number | undefined,
	kpp: string | undefined,
	endpointPath: string,
	eventName: string,
): Promise<SuggestResponse> {
	const response = await makeDadataruRequest<SuggestResponse>(
		endpointPath,
		ctx.key,
		{
			method: 'POST',
			body: {
				query: query,
				count: count ?? 5,
				kpp: kpp,
			},
			apiType: 'suggest',
		},
	);

	await logEventFromContext(ctx, eventName, { query }, 'completed');
	return response;
}

export const address: DadataruEndpoints['findAddress'] = (ctx, input) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		undefined,
		'findById/address',
		'dadataru.find.address',
	);

export const fiasById: DadataruEndpoints['findFiasById'] = (ctx, input) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		undefined,
		'findById/fias',
		'dadataru.find.fiasById',
	);

export const bank: DadataruEndpoints['findBank'] = (ctx, input) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		input.kpp,
		'findById/bank',
		'dadataru.find.bank',
	);

export const partyBy: DadataruEndpoints['findPartyBy'] = (ctx, input) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		undefined,
		'findById/party',
		'dadataru.find.partyBy',
	);

export const carBrand: DadataruEndpoints['findCarBrand'] = (ctx, input) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		undefined,
		'findById/car_brand',
		'dadataru.find.carBrand',
	);

export const companyByEmail: DadataruEndpoints['findCompanyByEmail'] = (
	ctx,
	input,
) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		undefined,
		'findByEmail/company',
		'dadataru.find.companyByEmail',
	);

export const party: DadataruEndpoints['findParty'] = (ctx, input) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		input.kpp,
		'findById/party',
		'dadataru.find.party',
	);

export const country: DadataruEndpoints['findCountry'] = (ctx, input) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		undefined,
		'findById/country',
		'dadataru.find.country',
	);

export const courtById: DadataruEndpoints['findCourtById'] = (ctx, input) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		undefined,
		'findById/court',
		'dadataru.find.courtById',
	);

export const currency: DadataruEndpoints['findCurrency'] = (ctx, input) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		undefined,
		'findById/currency',
		'dadataru.find.currency',
	);

export const delivery: DadataruEndpoints['findDelivery'] = (ctx, input) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		undefined,
		'findById/delivery',
		'dadataru.find.delivery',
	);

export const fmsUnit: DadataruEndpoints['findFmsUnit'] = (ctx, input) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		undefined,
		'findById/fms_unit',
		'dadataru.find.fmsUnit',
	);

export const fnsUnit: DadataruEndpoints['findFnsUnit'] = (ctx, input) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		undefined,
		'findById/fns_unit',
		'dadataru.find.fnsUnit',
	);

export const ftsUnit: DadataruEndpoints['findFtsUnit'] = (ctx, input) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		undefined,
		'findById/fts_unit',
		'dadataru.find.ftsUnit',
	);

export const partyKz: DadataruEndpoints['findPartyKz'] = (ctx, input) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		undefined,
		'findById/party',
		'dadataru.find.partyKz',
	);

export const mktu: DadataruEndpoints['findMktu'] = (ctx, input) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		undefined,
		'findById/mktu',
		'dadataru.find.mktu',
	);

export const medicalPositionById: DadataruEndpoints['findMedicalPositionById'] =
	(ctx, input) =>
		handleFind(
			ctx,
			input.query,
			input.count,
			undefined,
			'findById/medical_position',
			'dadataru.find.medicalPositionById',
		);

export const okpd2ById: DadataruEndpoints['findOkpd2ById'] = (ctx, input) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		undefined,
		'findById/okpd2',
		'dadataru.find.okpd2ById',
	);

export const okpdtrPosition: DadataruEndpoints['findOkpdtrPosition'] = (
	ctx,
	input,
) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		undefined,
		'suggest/okpdtr_position',
		'dadataru.find.okpdtrPosition',
	);

export const okpdtrProfession: DadataruEndpoints['findOkpdtrProfession'] = (
	ctx,
	input,
) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		undefined,
		'suggest/okpdtr_profession',
		'dadataru.find.okpdtrProfession',
	);

export const okved2: DadataruEndpoints['findOkved2'] = (ctx, input) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		undefined,
		'findById/okved2',
		'dadataru.find.okved2',
	);

export const postalOffice: DadataruEndpoints['findPostalOffice'] = (
	ctx,
	input,
) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		undefined,
		'findById/postal_office',
		'dadataru.find.postalOffice',
	);

export const postalUnitById: DadataruEndpoints['findPostalUnitById'] = (
	ctx,
	input,
) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		undefined,
		'findById/postal_unit',
		'dadataru.find.postalUnitById',
	);

export const oktmoById: DadataruEndpoints['findOktmoById'] = (ctx, input) =>
	handleFind(
		ctx,
		input.query,
		input.count,
		undefined,
		'findById/oktmo',
		'dadataru.find.oktmoById',
	);
