import { logEventFromContext } from 'corsair/core';
import { makeClickmeetingRequest } from '../client';
import type { ClickmeetingEndpoints } from '../index';

export const getPing: ClickmeetingEndpoints['getPing'] = async (ctx) => {
	const res = await makeClickmeetingRequest<any>('/ping', ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'clickmeeting.utility.getPing',
		{},
		'completed',
	);
	return res;
};

export const getTimeZoneList: ClickmeetingEndpoints['getTimeZoneList'] = async (
	ctx,
) => {
	const res = await makeClickmeetingRequest<any>('/time_zone_list', ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'clickmeeting.utility.getTimeZoneList',
		{},
		'completed',
	);
	return res;
};

export const getTimeZoneListByCountry: ClickmeetingEndpoints['getTimeZoneListByCountry'] =
	async (ctx, input) => {
		const res = await makeClickmeetingRequest<any>(
			`/time_zone_list/${encodeURIComponent(input.country)}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.utility.getTimeZoneListByCountry',
			{ country: input.country },
			'completed',
		);
		return res;
	};

export const getPhoneGateways: ClickmeetingEndpoints['getPhoneGateways'] =
	async (ctx) => {
		const res = await makeClickmeetingRequest<any>('/phone_gateways', ctx.key, {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'clickmeeting.utility.getPhoneGateways',
			{},
			'completed',
		);
		return res;
	};
