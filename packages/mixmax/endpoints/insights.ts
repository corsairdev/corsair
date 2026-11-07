import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import { mixmaxPathParameter } from './path';
import type { MixmaxEndpointOutputs } from './types';

export const insightsReportsList: MixmaxEndpoints['insightsReportsList'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['insightsReportsList']
		>(ctx, '/v1/insightsreports', {
			method: 'GET',
			query: {
				limit: input.limit,
				accessThrough: input.accessThrough,
				next: input.next,
				previous: input.previous,
			},
		});

		await logEventFromContext(
			ctx,
			'mixmax.insightsReports.list',
			{ ...input },
			'completed',
		);
		return result;
	};

export const insightsReportsCreate: MixmaxEndpoints['insightsReportsCreate'] =
	async (ctx, input) => {
		const { ...report } = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['insightsReportsCreate']
		>(ctx, '/v1/insightsreports', {
			method: 'POST',
			body: report,
		});

		await logEventFromContext(
			ctx,
			'mixmax.insightsReports.create',
			{ ...input },
			'completed',
		);
		return result;
	};

export const insightsReportsUpdate: MixmaxEndpoints['insightsReportsUpdate'] =
	async (ctx, input) => {
		const { id, ...update } = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['insightsReportsUpdate']
		>(ctx, mixmaxPathParameter('/v1/insightsreports/{id}', 'id', id), {
			method: 'PATCH',
			body: update,
		});

		await logEventFromContext(
			ctx,
			'mixmax.insightsReports.update',
			{ ...input },
			'completed',
		);
		return result;
	};

export const insightsReportsDelete: MixmaxEndpoints['insightsReportsDelete'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['insightsReportsDelete']
		>(ctx, mixmaxPathParameter('/v1/insightsreports/{id}', 'id', input.id), {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'mixmax.insightsReports.delete',
			{ ...input },
			'completed',
		);
		return result;
	};

export const reportsRunDataTable: MixmaxEndpoints['reportsRunDataTable'] =
	async (ctx, input) => {
		const { ...report } = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['reportsRunDataTable']
		>(ctx, '/v1/reports/data/table', {
			method: 'POST',
			body: report,
		});

		await logEventFromContext(
			ctx,
			'mixmax.reports.runDataTable',
			{ ...input },
			'completed',
		);
		return result;
	};
