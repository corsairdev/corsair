import { logEventFromContext } from 'corsair/core';
import { makeXeroRequest } from '../client';
import type { XeroEndpoints } from '../index';
import type { XeroEndpointOutputs } from './types';

export const getBalanceSheet: XeroEndpoints['reportsGetBalanceSheet'] = async (
	ctx,
	input,
) => {
	const {
		tenantId = ctx.options.tenantId,
		date,
		periods,
		timeframe,
		trackingCategoryID,
		trackingOptionID,
		paymentsOnly,
	} = input;

	const query: Record<string, string | number | boolean | undefined> = {};
	if (date) query.date = date;
	if (periods !== undefined) query.periods = periods;
	if (timeframe) query.timeframe = timeframe;
	if (trackingCategoryID) query.trackingCategoryID = trackingCategoryID;
	if (trackingOptionID) query.trackingOptionID = trackingOptionID;
	if (paymentsOnly !== undefined) query.paymentsOnly = paymentsOnly;

	const response = await makeXeroRequest<
		XeroEndpointOutputs['reportsGetBalanceSheet']
	>('Reports/BalanceSheet', ctx.key, {
		method: 'GET',
		query,
		tenantId,
	});

	await logEventFromContext(
		ctx,
		'xero.reports.getBalanceSheet',
		{ ...input },
		'completed',
	);
	return response;
};

export const getProfitLoss: XeroEndpoints['reportsGetProfitLoss'] = async (
	ctx,
	input,
) => {
	const {
		tenantId = ctx.options.tenantId,
		fromDate,
		toDate,
		periods,
		timeframe,
		trackingCategoryID,
		trackingOptionID,
		paymentsOnly,
	} = input;

	const query: Record<string, string | number | boolean | undefined> = {};
	if (fromDate) query.fromDate = fromDate;
	if (toDate) query.toDate = toDate;
	if (periods !== undefined) query.periods = periods;
	if (timeframe) query.timeframe = timeframe;
	if (trackingCategoryID) query.trackingCategoryID = trackingCategoryID;
	if (trackingOptionID) query.trackingOptionID = trackingOptionID;
	if (paymentsOnly !== undefined) query.paymentsOnly = paymentsOnly;

	const response = await makeXeroRequest<
		XeroEndpointOutputs['reportsGetProfitLoss']
	>('Reports/ProfitAndLoss', ctx.key, {
		method: 'GET',
		query,
		tenantId,
	});

	await logEventFromContext(
		ctx,
		'xero.reports.getProfitLoss',
		{ ...input },
		'completed',
	);
	return response;
};

export const Reports = {
	getBalanceSheet,
	getProfitLoss,
};
